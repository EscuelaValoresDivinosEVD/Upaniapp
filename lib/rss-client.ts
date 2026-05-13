import { XMLParser } from 'fast-xml-parser'
import type { RssItem } from './rss'
import { getSlugFromUrl, formatDate } from './rss'

export type { RssItem }
export { formatDate }

let cached: { items: RssItem[]; ts: number } | null = null
const TTL = 3600 * 1000

export async function fetchFeedClient(): Promise<RssItem[]> {
  if (cached && Date.now() - cached.ts < TTL) return cached.items

  try {
    const res = await fetch('/api/feed')
    if (!res.ok) return []
    const xml = await res.text()
    const items = parseXml(xml)
    cached = { items, ts: Date.now() }
    return items
  } catch {
    return []
  }
}

function parseXml(xml: string): RssItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    isArray: (name) => name === 'category' || name === 'item',
    cdataPropName: '__cdata',
    textNodeName: '#text',
  })

  const result = parser.parse(xml)
  const items: unknown[] = result?.rss?.channel?.item ?? []

  return items.map((item: unknown) => {
    const i = item as Record<string, unknown>

    const str = (v: unknown): string => {
      if (typeof v === 'string') return v
      if (v && typeof v === 'object') {
        const o = v as Record<string, unknown>
        return String(o['__cdata'] ?? o['#text'] ?? '')
      }
      return ''
    }

    const rawCategories = (i['category'] as unknown[]) ?? []
    const categories = rawCategories.map((c) => str(c)).filter(Boolean)

    const link = String(i['link'] ?? '')
    const rawGuid = i['guid']
    const guid =
      rawGuid && typeof rawGuid === 'object'
        ? String((rawGuid as Record<string, unknown>)['#text'] ?? rawGuid)
        : String(rawGuid ?? '')

    const content = str(i['content:encoded'])

    return {
      title: str(i['title']),
      link,
      pubDate: String(i['pubDate'] ?? ''),
      description: str(i['description']),
      content,
      categories,
      creator: str(i['dc:creator']),
      guid,
      image: extractFirstImage(content),
      slug: getSlugFromUrl(link),
    }
  })
}

function extractFirstImage(html: string): string | undefined {
  return html.match(/<img[^>]+src="([^"]+)"/)?.[1]
}
