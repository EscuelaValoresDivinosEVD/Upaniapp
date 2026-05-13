import { fetchFeed } from '@/lib/rss'
import ReaderClient from '@/components/ReaderClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const items = await fetchFeed()
  const item = items.find((i) => i.slug === slug)
  if (!item) return {}
  return {
    title: `${item.title} — Upaninews`,
    description: item.description.replace(/<[^>]*>/g, '').slice(0, 160),
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const items = await fetchFeed()
  const item = items.find((i) => i.slug === slug)

  if (!item) notFound()

  return (
    <ReaderClient
      title={item.title}
      pubDate={item.pubDate}
      categories={item.categories}
      content={item.content}
      description={item.description}
      sourceUrl={item.link}
    />
  )
}
