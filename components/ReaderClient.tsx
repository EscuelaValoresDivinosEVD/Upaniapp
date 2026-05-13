'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { formatDate } from '@/lib/rss'

interface Props {
  title: string
  pubDate: string
  categories: string[]
  content: string
  description: string
  sourceUrl: string
}

const FONT_SIZES = [
  { label: 'S', value: '0.95rem', lineHeight: '1.85' },
  { label: 'M', value: '1.05rem', lineHeight: '1.9' },
  { label: 'L', value: '1.2rem', lineHeight: '1.95' },
  { label: 'XL', value: '1.35rem', lineHeight: '2.0' },
]

export default function ReaderClient({ title, pubDate, categories, content, description, sourceUrl }: Props) {
  const [fontIndex, setFontIndex] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem('upani-font-size')
    if (stored) {
      const idx = FONT_SIZES.findIndex(f => f.value === stored)
      if (idx >= 0) setFontIndex(idx)
    }
  }, [])

  const changeFontSize = (idx: number) => {
    setFontIndex(idx)
    localStorage.setItem('upani-font-size', FONT_SIZES[idx].value)
  }

  const currentFont = FONT_SIZES[fontIndex]
  const bodyText = content || description

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '52px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Font size control */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowControls(!showControls)}
              style={{
                background: showControls ? 'var(--card)' : 'none',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                color: 'var(--text-soft)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
              }}
            >
              Aa
            </button>

            {showControls && (
              <div style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                gap: '8px',
                whiteSpace: 'nowrap',
                zIndex: 100,
              }}>
                {FONT_SIZES.map((size, idx) => (
                  <button
                    key={size.label}
                    onClick={() => changeFontSize(idx)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      border: idx === fontIndex ? '2px solid var(--accent-warm)' : '1px solid var(--border)',
                      background: idx === fontIndex ? 'var(--card)' : 'none',
                      cursor: 'pointer',
                      color: idx === fontIndex ? 'var(--accent-warm)' : 'var(--text-muted)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.8rem',
                      fontWeight: idx === fontIndex ? '700' : '400',
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '5px 8px',
              cursor: 'pointer',
              color: 'var(--text-soft)',
            }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Article */}
      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 20px 120px',
      }}>
        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-warm)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  padding: '3px 8px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
          fontWeight: '700',
          lineHeight: '1.25',
          color: 'var(--text)',
          marginBottom: '16px',
        }}>
          {title}
        </h1>

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <time style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-ui)',
            fontStyle: 'italic',
          }}>
            {formatDate(pubDate)}
          </time>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-ui)',
          }}>
            Upaninews
          </span>
        </div>

        {/* Content */}
        {bodyText ? (
          <div
            className="prose-vintage"
            style={{
              fontSize: currentFont.value,
              lineHeight: currentFont.lineHeight,
            }}
            dangerouslySetInnerHTML={{ __html: bodyText }}
          />
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: 'var(--text-muted)',
          }}>
            <p style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              El contenido completo está en el artículo original.
            </p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: 'var(--accent-warm)',
                color: 'var(--bg)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
              }}
            >
              Leer en Upaninews →
            </a>
          </div>
        )}

        {/* Footer ornament */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          color: 'var(--accent-warm)',
          fontSize: '1.2rem',
          letterSpacing: '0.3em',
        }}>
          ❦
        </div>

        {/* Source link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
              textDecoration: 'none',
              fontStyle: 'italic',
            }}
          >
            Ver en upaninews.com ↗
          </a>
        </div>
      </main>
    </div>
  )
}
