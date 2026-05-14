import { slugToCategoryName } from '@/lib/categories'
import ThemeToggleHeader from '@/components/ThemeToggleHeader'
import PushNotificationToggle from '@/components/PushNotificationToggle'
import FeedList from '@/components/FeedList'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return { title: `${slugToCategoryName(slug)} — Upaninews` }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const categoryName = slugToCategoryName(slug)

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text)',
            margin: 0,
          }}>
            {categoryName}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PushNotificationToggle />
          <ThemeToggleHeader />
        </div>
      </header>

      <div style={{ textAlign: 'center', padding: '14px 0 4px', color: 'var(--accent-warm)', fontSize: '0.9rem', letterSpacing: '0.4em' }}>
        ✦ ✦ ✦
      </div>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '12px 16px 100px' }}>
        <FeedList categorySlug={slug} />
      </main>
    </div>
  )
}
