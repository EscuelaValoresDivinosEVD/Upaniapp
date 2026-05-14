'use client'

import { useEffect, useState } from 'react'
import { fetchFeedClient, type RssItem } from '@/lib/rss-client'
import ReaderClient from './ReaderClient'

export default function ArticleLoader({ slug }: { slug: string }) {
  const [item, setItem] = useState<RssItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedClient().then((items) => {
      setItem(items.find((i) => i.slug === slug) ?? null)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--accent-warm)', animation: 'pulse 1.5s ease-in-out infinite' }}>
          ❦
        </p>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }`}</style>
      </div>
    )
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)' }}>Entrada no encontrada</p>
        <a href="/" style={{ color: 'var(--accent-warm)', fontFamily: 'var(--font-ui)' }}>← Volver al inicio</a>
      </div>
    )
  }

  return (
    <ReaderClient
      slug={item.slug}
      title={item.title}
      pubDate={item.pubDate}
      categories={item.categories}
      content={item.content}
      description={item.description}
      image={item.image}
      sourceUrl={item.link}
    />
  )
}
