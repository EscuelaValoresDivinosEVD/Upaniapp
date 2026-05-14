import ThemeToggleHeader from '@/components/ThemeToggleHeader'
import PushNotificationToggle from '@/components/PushNotificationToggle'
import FeedList from '@/components/FeedList'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PushNotificationToggle />
          <ThemeToggleHeader />
        </div>
      </header>

      <div style={{
        textAlign: 'center',
        padding: '16px 0 4px',
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
      }}>
        <FeedList />
      </main>
    </div>
  )
}
