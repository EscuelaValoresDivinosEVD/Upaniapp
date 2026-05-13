import { XMLParser } from 'fast-xml-parser'

export interface RssItem {
  title: string
  link: string
  pubDate: string
  description: string
  content: string
  categories: string[]
  creator: string
  guid: string
  image?: string
  slug: string
}

export async function fetchFeed(): Promise<RssItem[]> {
  try {
    const res = await fetch('https://upaninews.com/feed/', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return []
    return parseFeed(await res.text())
  } catch {
    return []
  }
}

function parseFeed(xml: string): RssItem[] {
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
    const rawCategories = (i['category'] as unknown[]) ?? []
    const categories = rawCategories.map((c) => {
      if (typeof c === 'string') return c
      const co = c as Record<string, unknown>
      return String(co['__cdata'] ?? co['#text'] ?? c)
    })

    const rawTitle = i['title']
    const title =
      typeof rawTitle === 'string'
        ? rawTitle
        : rawTitle && typeof rawTitle === 'object'
          ? String((rawTitle as Record<string, unknown>)['__cdata'] ?? rawTitle)
          : ''

    const rawContent = i['content:encoded']
    const content =
      typeof rawContent === 'string'
        ? rawContent
        : rawContent && typeof rawContent === 'object'
          ? String((rawContent as Record<string, unknown>)['__cdata'] ?? '')
          : ''

    const rawDesc = i['description']
    const description =
      typeof rawDesc === 'string'
        ? rawDesc
        : rawDesc && typeof rawDesc === 'object'
          ? String((rawDesc as Record<string, unknown>)['__cdata'] ?? '')
          : ''

    const rawCreator = i['dc:creator']
    const creator =
      typeof rawCreator === 'string'
        ? rawCreator
        : rawCreator && typeof rawCreator === 'object'
          ? String((rawCreator as Record<string, unknown>)['__cdata'] ?? '')
          : ''

    const link = String(i['link'] ?? '')
    const pubDate = String(i['pubDate'] ?? '')
    const rawGuid = i['guid']
    const guid =
      rawGuid && typeof rawGuid === 'object'
        ? String((rawGuid as Record<string, unknown>)['#text'] ?? rawGuid)
        : String(rawGuid ?? '')

    return {
      title,
      link,
      pubDate,
      description,
      content,
      categories,
      creator,
      guid,
      image: extractFirstImage(content),
      slug: getSlugFromUrl(link),
    }
  })
}

function extractFirstImage(html: string): string | undefined {
  const match = html.match(/<img[^>]+src="([^"]+)"/)
  return match?.[1]
}

export function getSlugFromUrl(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? ''
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}
