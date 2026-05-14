const KEY = 'upani-saved'

export interface SavedArticle {
  slug: string
  title: string
  pubDate: string
  categories: string[]
  content: string
  description: string
  image?: string
  link: string
  savedAt: number
}

export function getSaved(): SavedArticle[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function isSaved(slug: string): boolean {
  return getSaved().some((a) => a.slug === slug)
}

export function saveArticle(article: SavedArticle): void {
  const list = getSaved().filter((a) => a.slug !== article.slug)
  list.unshift({ ...article, savedAt: Date.now() })
  localStorage.setItem(KEY, JSON.stringify(list))
  cacheImage(article.image)
}

async function cacheImage(url?: string): Promise<void> {
  if (!url || !('caches' in window)) return
  try {
    const cache = await caches.open('upani-images-v1')
    if (!await cache.match(url)) await cache.add(url)
  } catch { /* ignore — cross-origin or network failure */ }
}

export function unsaveArticle(slug: string): void {
  const list = getSaved().filter((a) => a.slug !== slug)
  localStorage.setItem(KEY, JSON.stringify(list))
}
