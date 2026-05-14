'use client'

import { useEffect, useState } from 'react'
import { fetchFeedClient, fetchFeedByCategory, type RssItem } from '@/lib/rss-client'
import ArticleCard from './ArticleCard'

interface Props {
  categorySlug?: string
}

export default function FeedList({ categorySlug }: Props) {
  const [items, setItems] = useState<RssItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetcher = categorySlug
      ? fetchFeedByCategory(categorySlug)
      : fetchFeedClient()
    fetcher.then((result) => {
      setItems(result)
      setLoading(false)
    })
  }, [categorySlug])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              height: '160px',
              opacity: 0.5 + i * 0.1,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        ))}
        <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
      </div>
    )
  }

  if (!loading && items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
          No hay entradas disponibles.
        </p>
      </div>
    )
  }

  const featured = items.slice(0, 5)
  const grid = items.slice(5)

  return (
    <div>
      {/* First 5 full width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {featured.map((item, i) => (
          <ArticleCard key={item.guid || item.link} item={item} index={i} />
        ))}
      </div>

      {/* Rest in 2-column grid */}
      {grid.length > 0 && (
        <>
          <div style={{ textAlign: 'center', margin: '28px 0 20px', color: 'var(--border)', letterSpacing: '0.3em', fontSize: '0.9rem' }}>
            ✦ ✦ ✦
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {grid.map((item, i) => (
              <ArticleCard key={item.guid || item.link} item={item} index={i + 5} compact />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
