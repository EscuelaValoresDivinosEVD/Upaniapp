import type { RssItem } from './rss'
import { formatDate } from './rss'

export type { RssItem }
export { formatDate }

let cached: { items: RssItem[]; ts: number } | null = null
const TTL = 3600 * 1000

const WP_API = 'https://upaninews.com/wp-json/wp/v2/posts'

export async function fetchFeedClient(): Promise<RssItem[]> {
  if (cached && Date.now() - cached.ts < TTL) return cached.items

  try {
    const res = await fetch(
      `${WP_API}?per_page=100&_embed=true&orderby=date&order=desc`,
      { headers: { Accept: 'application/json' } }
    )
    if (!res.ok) return []
    const posts: WpPost[] = await res.json()
    const items = posts.map(mapWpPost)
    cached = { items, ts: Date.now() }
    return items
  } catch {
    return []
  }
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
