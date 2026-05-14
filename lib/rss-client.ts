import type { RssItem } from './rss'
import { formatDate } from './rss'

export type { RssItem }
export { formatDate }

const TTL = 3600 * 1000
const WP_API = 'https://upaninews.com/wp-json/wp/v2'

// Cache for the home feed (latest 100 posts)
let homeCached: { items: RssItem[]; ts: number } | null = null

// Cache per category slug
const categoryCached = new Map<string, { items: RssItem[]; ts: number }>()

export async function fetchFeedClient(): Promise<RssItem[]> {
  if (homeCached && Date.now() - homeCached.ts < TTL) return homeCached.items

  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=100&_embed=true&orderby=date&order=desc`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return []
    const posts: WpPost[] = await res.json()
    const items = posts.map(mapWpPost)
    homeCached = { items, ts: Date.now() }
    return items
  } catch {
    return []
  }
}

export async function fetchFeedByCategory(categorySlug: string): Promise<RssItem[]> {
  const hit = categoryCached.get(categorySlug)
  if (hit && Date.now() - hit.ts < TTL) return hit.items

  try {
    // Step 1: resolve category slug → WP term ID
    const catRes = await fetch(
      `${WP_API}/categories?slug=${encodeURIComponent(categorySlug)}&per_page=1`,
      { headers: { Accept: 'application/json' } }
    )
    if (!catRes.ok) return []
    const cats: WpTerm[] = await catRes.json()

    // Also try tags if not found as a category
    let termId: number | null = cats[0]?.id ?? null
    let termType: 'categories' | 'tags' = 'categories'

    if (!termId) {
      const tagRes = await fetch(
        `${WP_API}/tags?slug=${encodeURIComponent(categorySlug)}&per_page=1`,
        { headers: { Accept: 'application/json' } }
      )
      if (tagRes.ok) {
        const tags: WpTerm[] = await tagRes.json()
        termId = tags[0]?.id ?? null
        termType = 'tags'
      }
    }

    if (!termId) return []

    // Step 2: fetch posts filtered by that term ID
    const postsRes = await fetch(
      `${WP_API}/posts?${termType}=${termId}&per_page=100&_embed=true&orderby=date&order=desc`,
      { headers: { Accept: 'application/json' } }
    )
    if (!postsRes.ok) return []
    const posts: WpPost[] = await postsRes.json()
    const items = posts.map(mapWpPost)
    categoryCached.set(categorySlug, { items, ts: Date.now() })
    return items
  } catch {
    return []
  }
}

interface WpTerm {
  id: number
  name: string
  slug: string
}

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

function mapWpPost(post: WpPost): RssItem {
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
}

function extractFirstImage(html: string): string | undefined {
  return html.match(/<img[^>]+src="([^"]+)"/)?.[1]
}
