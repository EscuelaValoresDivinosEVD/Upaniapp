'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { fetchFeedClient, fetchFeedByCategory, type RssItem } from '@/lib/rss-client'
import ArticleCard from './ArticleCard'

interface Props {
  categorySlug?: string
}

export default function FeedList({ categorySlug }: Props) {
  const [items, setItems] = useState<RssItem[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const loadFeed = useCallback((silent = false) => {
    if (!silent) setLoading(true)
    const fetcher = categorySlug ? fetchFeedByCategory(categorySlug) : fetchFeedClient()
    fetcher.then((result) => {
      setOffline(result.length === 0 && !navigator.onLine)
      setItems(result)
      if (!silent) setLoading(false)
    })
  }, [categorySlug])

  useEffect(() => {
    loadFeed()

    const onVisible = () => {
      if (!document.hidden) loadFeed(true)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [loadFeed])

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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        gap: '16px',
        textAlign: 'center',
      }}>
        {offline ? (
          <>
            <div style={{ color: 'var(--border)', marginBottom: '4px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" />
                <path d="M5 12.55a10.94 10.94 0 015.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0122.56 9" />
                <path d="M1.42 9a15.91 15.91 0 014.7-2.88" />
                <path d="M8.53 16.11a6 6 0 016.95 0" />
                <circle cx="12" cy="20" r="1" fill="currentColor" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
              Modo offline
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '240px', lineHeight: '1.5' }}>
              Sin conexión a internet. Puedes leer los artículos que guardaste.
            </p>
            <Link
              href="/saved"
              style={{
                marginTop: '8px',
                padding: '11px 28px',
                background: 'var(--accent-warm)',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.02em',
              }}
            >
              Ver guardados
            </Link>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            No hay entradas disponibles.
          </p>
        )}
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
