import type { RssItem } from './rss'
import { formatDate } from './rss'

export type { RssItem }
export { formatDate }

const TTL = 5 * 60 * 1000

let homeCached: { items: RssItem[]; ts: number } | null = null
const categoryCached = new Map<string, { items: RssItem[]; ts: number }>()

export async function fetchFeedClient(): Promise<RssItem[]> {
  if (homeCached && Date.now() - homeCached.ts < TTL) return homeCached.items
  try {
    const res = await fetch('/api/articles')
    if (!res.ok) return []
    const items: RssItem[] = await res.json()
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
    const res = await fetch(`/api/articles?category=${encodeURIComponent(categorySlug)}`)
    if (!res.ok) return []
    const items: RssItem[] = await res.json()
    categoryCached.set(categorySlug, { items, ts: Date.now() })
    return items
  } catch {
    return []
  }
}
