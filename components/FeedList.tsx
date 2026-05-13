'use client'

import { useEffect, useState } from 'react'
import { fetchFeedClient, type RssItem } from '@/lib/rss-client'
import { categoryNameToSlug } from '@/lib/categories'
import ArticleCard from './ArticleCard'

interface Props {
  categorySlug?: string
}

export default function FeedList({ categorySlug }: Props) {
  const [items, setItems] = useState<RssItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedClient().then((all) => {
      const filtered = categorySlug
        ? all.filter((item) =>
            item.categories.some((cat) => categoryNameToSlug(cat) === categorySlug)
          )
        : all
      setItems(filtered)
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item, i) => (
        <ArticleCard key={item.guid || item.link} item={item} index={i} />
      ))}
    </div>
  )
}
