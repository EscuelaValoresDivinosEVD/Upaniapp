'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { fetchFeedClient, fetchFeedByCategory, type RssItem } from '@/lib/rss-client'
import ArticleCard from './ArticleCard'

interface Props {
  categorySlug?: string
}

const PULL_THRESHOLD = 65
const MAX_PULL = 88

export default function FeedList({ categorySlug }: Props) {
  const [items, setItems] = useState<RssItem[]>([])
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const pullDistanceRef = useRef(0)
  const refreshingRef = useRef(false)

  useEffect(() => { refreshingRef.current = refreshing }, [refreshing])

  const doFetch = useCallback(() => {
    const fetcher = categorySlug ? fetchFeedByCategory(categorySlug) : fetchFeedClient()
    return fetcher.then((result) => {
      setOffline(result.length === 0 && !navigator.onLine)
      setItems(result)
    })
  }, [categorySlug])

  // Initial load + silent background refresh on re-focus
  useEffect(() => {
    setLoading(true)
    doFetch().finally(() => setLoading(false))

    const onVisible = () => { if (!document.hidden) doFetch() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [doFetch])

  // Pull-to-refresh completion
  useEffect(() => {
    if (!refreshing) return
    doFetch().finally(() => {
      setTimeout(() => setRefreshing(false), 500)
    })
  }, [refreshing, doFetch])

  // Touch handlers (non-passive for preventDefault)
  useEffect(() => {
    let startY = 0
    let active = false

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
        active = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!active) return
      if (window.scrollY > 0) {
        active = false
        pullDistanceRef.current = 0
        setPullDistance(0)
        return
      }
      const delta = e.touches[0].clientY - startY
      if (delta > 0) {
        e.preventDefault()
        const d = Math.min(delta * 0.48, MAX_PULL)
        pullDistanceRef.current = d
        setPullDistance(d)
      } else {
        pullDistanceRef.current = 0
        setPullDistance(0)
      }
    }

    const onTouchEnd = () => {
      if (!active) return
      active = false
      const d = pullDistanceRef.current
      pullDistanceRef.current = 0
      setPullDistance(0)
      if (d >= PULL_THRESHOLD && !refreshingRef.current) {
        setRefreshing(true)
      }
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: false })
    document.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1)
  const indicatorY = refreshing ? 0 : pullDistance - MAX_PULL - 4

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
    <>
      {/* Pull-to-refresh indicator */}
      <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: `${MAX_PULL + 4}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${indicatorY}px)`,
          transition: (pullDistance === 0 && !refreshing) ? 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
          zIndex: 55,
          pointerEvents: 'none',
          background: 'var(--bg)',
          borderBottom: (refreshing || pullDistance > 0) ? '1px solid var(--border)' : 'none',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 907 601.67"
          style={{
            width: `${36 + progress * 14}px`,
            height: 'auto',
            opacity: refreshing ? 1 : progress,
            animation: refreshing ? 'ptr-spin 1s linear infinite' : 'none',
            transition: 'width 0.1s, opacity 0.1s',
          }}
        >
          <circle fill="#E8895A" cx="453.5" cy="32.36" r="22.3"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="453.5" cy="300.84" rx="69.23" ry="192.29"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="624.03" y1="389.74" x2="283.1" y2="389.74"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="261.21" y1="300.84" x2="644.21" y2="300.84"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="283.1" y1="211.66" x2="621.82" y2="211.66"/>
          <circle fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="453.5" cy="300.84" r="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="599.94" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="638.55" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="675.75" cy="300.84" rx="222.25" ry="291.84"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="307.06" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="268.45" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="231.25" cy="300.84" rx="222.25" ry="291.84"/>
        </svg>
      </div>

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
    </>
  )
}
