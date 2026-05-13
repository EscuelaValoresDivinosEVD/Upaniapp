import { fetchFeed } from '@/lib/rss'
import { slugToCategoryName, categoryNameToSlug } from '@/lib/categories'
import ArticleCard from '@/components/ArticleCard'
import ThemeToggleHeader from '@/components/ThemeToggleHeader'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const name = slugToCategoryName(slug)
  return {
    title: `${name} — Upaninews`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const categoryName = slugToCategoryName(slug)

  const allItems = await fetchFeed()
  const items = allItems.filter((item) =>
    item.categories.some((cat) => categoryNameToSlug(cat) === slug)
  )

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
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '56px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: 'var(--text)',
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              {categoryName}
            </h1>
            <p style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: '1px 0 0',
              fontFamily: 'var(--font-ui)',
            }}>
              {items.length} {items.length === 1 ? 'entrada' : 'entradas'}
            </p>
          </div>
        </div>
        <ThemeToggleHeader />
      </header>

      {/* Decorative */}
      <div style={{
        textAlign: 'center',
        padding: '14px 0 4px',
        color: 'var(--accent-warm)',
        fontSize: '0.9rem',
        letterSpacing: '0.4em',
      }}>
        ✦ ✦ ✦
      </div>

      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '12px 16px 100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {items.map((item, i) => (
          <ArticleCard key={item.guid || item.link} item={item} index={i} />
        ))}

        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: 'var(--text-muted)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '8px' }}>
              No hay entradas en esta categoría.
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Puede que esta categoría esté en la web pero no en el feed RSS actual.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                marginTop: '20px',
                padding: '10px 20px',
                background: 'var(--accent-warm)',
                color: 'var(--bg)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
              }}
            >
              Ver todas las entradas
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
