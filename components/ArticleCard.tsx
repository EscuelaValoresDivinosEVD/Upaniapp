'use client'

import Link from 'next/link'
import { RssItem, formatDate } from '@/lib/rss'

interface Props {
  item: RssItem
  index?: number
}

export default function ArticleCard({ item, index = 0 }: Props) {
  const delay = Math.min(index * 60, 400)

  return (
    <Link
      href={`/article/${item.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        animationDelay: `${delay}ms`,
      }}
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
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(45,31,14,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {item.image && (
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'var(--color-parchment-darker)' }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              loading="lazy"
            />
          </div>
        )}

        <div style={{ padding: '16px 18px 18px' }}>
          {/* Categories */}
          {item.categories.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
              {item.categories.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-warm)',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: '700',
              lineHeight: '1.35',
              color: 'var(--text)',
              margin: '0 0 10px',
            }}
          >
            {item.title}
          </h2>

          {/* Description */}
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

          {/* Date + Read more */}
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
              color: 'var(--accent-warm)',
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
