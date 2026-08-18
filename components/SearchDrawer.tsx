'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { fetchFeedClient, type RssItem } from '@/lib/rss-client'
import { formatDate } from '@/lib/rss'

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchDrawer({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [all, setAll] = useState<RssItem[]>([])
  const [results, setResults] = useState<RssItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      fetchFeedClient().then(({ items }) => setAll(items))
      setTimeout(() => inputRef.current?.focus(), 350)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase().trim()
    setResults(
      all.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.categories.some(c => c.toLowerCase().includes(q))
      ).slice(0, 15)
    )
  }, [query, all])

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--border)',
          maxHeight: '90vh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
        </div>

        {/* Search input */}
        <div style={{ padding: '8px 20px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <svg
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar entradas..."
              style={{
                width: '100%',
                padding: '10px 36px 10px 40px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                background: 'var(--card)',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px', display: 'flex' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Cancelar
          </button>
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
            ✦ Escribe para buscar
          </div>
        ) : results.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '0.9rem' }}>
            Sin resultados para &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div>
            {results.map(item => (
              <Link
                key={item.guid}
                href={`/article/${item.slug}`}
                onClick={onClose}
                style={{ display: 'block', padding: '14px 20px', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
              >
                {item.categories[0] && (
                  <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orange)', fontFamily: 'var(--font-ui)', display: 'block', marginBottom: '4px' }}>
                    {item.categories[0]}
                  </span>
                )}
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)', margin: '0 0 5px', lineHeight: '1.35' }}>
                  {item.title}
                </p>
                <time style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
                  {formatDate(item.pubDate)}
                </time>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
