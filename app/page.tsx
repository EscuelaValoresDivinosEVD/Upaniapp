import { fetchFeed } from '@/lib/rss'
import ArticleCard from '@/components/ArticleCard'
import ThemeToggleHeader from '@/components/ThemeToggleHeader'

export default async function HomePage() {
  let items = await fetchFeed()

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
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.35rem',
            fontWeight: '700',
            color: 'var(--text)',
            letterSpacing: '0.02em',
            margin: 0,
          }}>
            Upaninews
          </h1>
          <p style={{
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            margin: '1px 0 0',
            fontFamily: 'var(--font-ui)',
          }}>
            Consciencia & Cultura
          </p>
        </div>
        <ThemeToggleHeader />
      </header>

      {/* Decorative rule */}
      <div style={{
        textAlign: 'center',
        padding: '16px 0 4px',
        color: 'var(--accent-warm)',
        fontSize: '0.9rem',
        letterSpacing: '0.4em',
      }}>
        ✦ ✦ ✦
      </div>

      {/* Feed */}
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
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              No se pudieron cargar las entradas.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
