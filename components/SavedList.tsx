'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSaved, unsaveArticle, type SavedArticle } from '@/lib/saved'
import { formatDate } from '@/lib/rss'

export default function SavedList() {
  const [articles, setArticles] = useState<SavedArticle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setArticles(getSaved())
    setMounted(true)
  }, [])

  function remove(slug: string) {
    unsaveArticle(slug)
    setArticles((prev) => prev.filter((a) => a.slug !== slug))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        height: '52px',
        gap: '14px',
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--text)',
          margin: 0,
          flex: 1,
        }}>
          Guardados
        </h1>
        {mounted && articles.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
            {articles.length} {articles.length === 1 ? 'artículo' : 'artículos'}
          </span>
        )}
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px 120px' }}>
        {!mounted ? null : articles.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '80px',
            gap: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', color: 'var(--border)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>
              No hay artículos guardados
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, maxWidth: '260px' }}>
              Toca el botón <strong>Guardar</strong> en cualquier artículo para acceder a él sin conexión.
            </p>
            <Link
              href="/"
              style={{
                marginTop: '8px',
                padding: '10px 24px',
                background: 'var(--accent-warm)',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              Ver artículos
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.map((article) => (
              <SavedCard key={article.slug} article={article} onRemove={() => remove(article.slug)} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function SavedCard({ article, onRemove }: { article: SavedArticle; onRemove: () => void }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      overflow: 'hidden',
      display: 'flex',
      gap: '0',
    }}>
      {article.image && (
        <div style={{ width: '90px', flexShrink: 0 }}>
          <img
            src={article.image}
            alt={article.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        {article.categories[0] && (
          <span style={{
            fontSize: '0.62rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            fontFamily: 'var(--font-ui)',
          }}>
            {article.categories[0]}
          </span>
        )}
        <Link
          href={`/article/${article.slug}`}
          style={{ textDecoration: 'none' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: '700',
            lineHeight: '1.3',
            color: 'var(--text)',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.title}
          </h2>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <time style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
            {formatDate(article.pubDate)}
          </time>
          <button
            onClick={onRemove}
            title="Quitar de guardados"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
