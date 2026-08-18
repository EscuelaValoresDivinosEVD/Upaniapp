import type { RssItem } from './rss'
import { formatDate } from './rss'

export type { RssItem }
export { formatDate }

const TTL = 5 * 60 * 1000

export interface FeedResult {
  items: RssItem[]
  error?: string
}

let homeCached: { items: RssItem[]; ts: number } | null = null
const categoryCached = new Map<string, { items: RssItem[]; ts: number }>()

async function getList(url: string): Promise<FeedResult> {
  try {
    const res = await fetch(url)
    const body = await res.json()
    if (!res.ok || !Array.isArray(body)) {
      return { items: [], error: body?.error ?? `HTTP ${res.status}` }
    }
    return { items: body }
  } catch (e) {
    return { items: [], error: e instanceof Error ? e.message : String(e) }
  }
}

export async function fetchFeedClient(): Promise<FeedResult> {
  if (homeCached && Date.now() - homeCached.ts < TTL) return { items: homeCached.items }

  const result = await getList('/api/articles')
  if (result.items.length > 0) homeCached = { items: result.items, ts: Date.now() }
  return result
}

export async function fetchFeedByCategory(categorySlug: string): Promise<RssItem[]> {
  const hit = categoryCached.get(categorySlug)
  if (hit && Date.now() - hit.ts < TTL) return hit.items

  const { items } = await getList(`/api/articles?category=${encodeURIComponent(categorySlug)}`)
  if (items.length > 0) categoryCached.set(categorySlug, { items, ts: Date.now() })
  return items
}

/** Fetch one article with its full content — feed list responses omit `content`. */
export async function fetchArticleBySlug(slug: string): Promise<RssItem | null> {
  try {
    const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
