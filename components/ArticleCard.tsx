'use client'

import Link from 'next/link'
import { RssItem, formatDate } from '@/lib/rss'

interface Props {
  item: RssItem
  index?: number
  compact?: boolean
}

const MONTHS = new Set(['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'])

function sectionCats(categories: string[]): string[] {
  const filtered = categories.filter((c) => {
    const lower = c.toLowerCase()
    if (MONTHS.has(lower)) return false
    if (/^\d{1,2}-/.test(lower)) return false
    return true
  })
  return filtered.length > 0 ? filtered : categories
}

export default function ArticleCard({ item, index = 0, compact = false }: Props) {
  const delay = Math.min(index * 60, 400)
  const cats = sectionCats(item.categories)

  if (compact) {
    return (
      <Link
        href={`/article/${item.slug}`}
        style={{ display: 'block', textDecoration: 'none', animationDelay: `${delay}ms`, height: '100%' }}
        className="animate-fade-in"
      >
        <article
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {item.image && (
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>
          )}
          <div style={{ padding: '10px 11px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
              {cats[0] && (
                <span style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--orange)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  {cats[0]}
                </span>
              )}
              {cats[0] && item.creator && (
                <span style={{ fontSize: '0.6rem', color: 'var(--border)', fontFamily: 'var(--font-ui)' }}>·</span>
              )}
              {item.creator && (
                <span style={{
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontStyle: 'italic',
                }}>
                  {item.creator}
                </span>
              )}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.88rem',
              fontWeight: '700',
              lineHeight: '1.3',
              color: 'var(--text)',
              margin: 0,
              flex: 1,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.title}
            </h3>
            <time style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' }}>
              {formatDate(item.pubDate)}
            </time>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={`/article/${item.slug}`}
      style={{ display: 'block', textDecoration: 'none', animationDelay: `${delay}ms` }}
      className="animate-fade-in"
    >
      <article
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,31,14,0.12)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {item.image && (
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-parchment-darker)' }}>
            <img
              src={item.image}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        )}

        <div style={{ padding: '16px 18px 18px' }}>
          {(cats.length > 0 || item.creator) && (
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {cats.slice(0, 2).map((cat, i) => (
                <span
                  key={cat}
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: i === 0 ? 'var(--accent-warm)' : 'var(--orange)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {i > 0 && <span style={{ color: 'var(--border)', marginRight: '6px' }}>·</span>}
                  {cat}
                </span>
              ))}
              {cats.length > 0 && item.creator && (
                <span style={{ color: 'var(--border)', fontSize: '0.68rem' }}>·</span>
              )}
              {item.creator && (
                <span style={{
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontStyle: 'italic',
                }}>
                  {item.creator}
                </span>
              )}
            </div>
          )}

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: '700',
            lineHeight: '1.35',
            color: 'var(--text)',
            margin: '0 0 10px',
          }}>
            {item.title}
          </h2>

          {item.description && (
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: '1.65',
                color: 'var(--text-soft)',
                margin: '0 0 14px',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{
                __html: item.description.replace(/<[^>]*>/g, '').slice(0, 200) + '…',
              }}
            />
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border)',
            paddingTop: '12px',
          }}>
            <time style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
              fontStyle: 'italic',
            }}>
              {formatDate(item.pubDate)}
            </time>
            <span style={{
              fontSize: '0.78rem',
              color: 'var(--orange)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.03em',
            }}>
              Leer →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
