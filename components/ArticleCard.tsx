'use client'

import Link from 'next/link'
import { RssItem, formatDate } from '@/lib/rss'
import { sectionCats } from '@/lib/categories'

interface Props {
  item: RssItem
  index?: number
  /** 'row' is the compact horizontal strip used for efemérides. */
  variant?: 'feature' | 'row'
}

export default function ArticleCard({ item, index = 0, variant = 'feature' }: Props) {
  const delay = Math.min(index * 60, 400)
  const cats = sectionCats(item.categories)

  if (variant === 'row') {
    // No category label here: efemérides are filed under their own month, so it
    // would just restate the date sitting right below it.
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
            display: 'flex',
            alignItems: 'stretch',
            gap: '11px',
            padding: '9px',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {item.image && (
            <div style={{
              width: '62px',
              height: '62px',
              flexShrink: 0,
              borderRadius: '6px',
              overflow: 'hidden',
            }}>
              <img
                src={item.image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>
          )}
          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '4px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.84rem',
              fontWeight: '700',
              lineHeight: '1.28',
              color: 'var(--text)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {item.title}
            </h3>
            <time style={{
              fontSize: '0.63rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
              fontStyle: 'italic',
            }}>
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
