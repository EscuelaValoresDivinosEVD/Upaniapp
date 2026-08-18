export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const WP_API = 'https://store.upaninews.com/wp-json/wp/v2'

interface WpPost {
  id: number
  date: string
  link: string
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  _embedded?: {
    'wp:term'?: Array<Array<{ name: string; taxonomy: string }>>
    'wp:featuredmedia'?: Array<{ source_url: string }>
    author?: Array<{ name: string }>
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/&#\d+;/g, '')
    .trim()
}

function extractFirstImage(html: string): string | undefined {
  return html.match(/<img[^>]+src="([^"]+)"/)?.[1]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category')

  try {
    let postsUrl: string

    if (categorySlug) {
      // Resolve term ID first
      const catRes = await fetch(`${WP_API}/categories?slug=${encodeURIComponent(categorySlug)}&per_page=1`)
      let termId: number | null = null
      let termType = 'categories'
      if (catRes.ok) {
        const cats = await catRes.json()
        termId = cats[0]?.id ?? null
      }
      if (!termId) {
        const tagRes = await fetch(`${WP_API}/tags?slug=${encodeURIComponent(categorySlug)}&per_page=1`)
        if (tagRes.ok) {
          const tags = await tagRes.json()
          termId = tags[0]?.id ?? null
          termType = 'tags'
        }
      }
      if (!termId) return Response.json([])
      postsUrl = `${WP_API}/posts?${termType}=${termId}&per_page=100&_embed=true&orderby=date&order=desc`
    } else {
      postsUrl = `${WP_API}/posts?per_page=100&_embed=true&orderby=date&order=desc`
    }

    const res = await fetch(postsUrl, { next: { revalidate: 300 } })
    if (!res.ok) {
      console.error('WP API error:', res.status, await res.text())
      return Response.json([], { status: 200 })
    }

    const posts: WpPost[] = await res.json()

    const items = posts.map((post) => {
      const terms = post._embedded?.['wp:term'] ?? []
      const categories = terms
        .flat()
        .filter((t) => t.taxonomy === 'category' || t.taxonomy === 'post_tag')
        .map((t) => t.name)

      const content = post.content.rendered
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
      const image = featuredImage ?? extractFirstImage(content)

      return {
        title: stripHtml(post.title.rendered),
        link: post.link,
        pubDate: post.date,
        description: stripHtml(post.excerpt.rendered),
        content,
        categories,
        creator: post._embedded?.author?.[0]?.name ?? '',
        guid: String(post.id),
        image,
        slug: post.slug,
      }
    })

    return Response.json(items, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    })
  } catch (err) {
    console.error('Articles route error:', err)
    return Response.json([], { status: 200 })
  }
}
