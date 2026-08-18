export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const WP_API = 'https://store.upaninews.com/wp-json/wp/v2'

// Fields needed for feed cards — deliberately excludes `content`, which is the
// bulk of the payload (~1.7MB for 100 posts) and is only read on article pages.
const LIST_FIELDS = 'id,date,link,slug,title,excerpt,_links,_embedded'

interface WpPost {
  id: number
  date: string
  link: string
  slug: string
  title: { rendered: string }
  content?: { rendered: string }
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

function mapPost(post: WpPost) {
  const categories = (post._embedded?.['wp:term'] ?? [])
    .flat()
    .filter((t) => t.taxonomy === 'category' || t.taxonomy === 'post_tag')
    .map((t) => t.name)

  const content = post.content?.rendered ?? ''

  return {
    title: stripHtml(post.title.rendered),
    link: post.link,
    pubDate: post.date,
    description: stripHtml(post.excerpt.rendered),
    content,
    categories,
    creator: post._embedded?.author?.[0]?.name ?? '',
    guid: String(post.id),
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? extractFirstImage(content),
    slug: post.slug,
  }
}

async function wpFetch(url: string) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(25000),
  })
  if (!res.ok) {
    throw new Error(`WP ${res.status} on ${url.replace(WP_API, '')}: ${(await res.text()).slice(0, 200)}`)
  }
  return res.json()
}

/** Resolve a category-or-tag slug to its WP term id. */
async function resolveTerm(slug: string): Promise<{ type: string; id: number } | null> {
  for (const type of ['categories', 'tags']) {
    const terms = await wpFetch(`${WP_API}/${type}?slug=${encodeURIComponent(slug)}&per_page=1&_fields=id`)
    if (terms[0]?.id) return { type, id: terms[0].id }
  }
  return null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const category = searchParams.get('category')

  try {
    // ── Single article (full content) ──────────────────────────────────────
    if (slug) {
      const posts: WpPost[] = await wpFetch(
        `${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed=true&per_page=1`
      )
      return Response.json(posts[0] ? mapPost(posts[0]) : null, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
      })
    }

    // ── Feed list (no content) ─────────────────────────────────────────────
    let filter = ''
    if (category) {
      const term = await resolveTerm(category)
      if (!term) return Response.json([])
      filter = `&${term.type}=${term.id}`
    }

    const posts: WpPost[] = await wpFetch(
      `${WP_API}/posts?per_page=100&orderby=date&order=desc&_embed=true&_fields=${LIST_FIELDS}${filter}`
    )

    return Response.json(posts.map(mapPost), {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
    })
  } catch (err) {
    console.error('[api/articles]', err)
    return Response.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    )
  }
}
