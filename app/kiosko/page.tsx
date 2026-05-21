import Link from 'next/link'
import { getKioskoProducts } from '@/lib/woo-client'

export const revalidate = 3600

export default async function KioskoPage() {
  const products = await getKioskoProducts()
  const noKeys = products.length === 0 && (!process.env.WC_CONSUMER_KEY || !process.env.WC_CONSUMER_SECRET)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 20px',
        height: '52px', gap: '14px',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-muted)', textDecoration: 'none',
          fontSize: '0.85rem', fontFamily: 'var(--font-ui)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          fontWeight: '700', color: 'var(--text)', margin: 0,
        }}>
          Kiosko
        </h1>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 16px 100px' }}>

        {noKeys ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '16px' }}>
              <path d="M2 8h20" /><path d="M4 8V6a1 1 0 011-1h14a1 1 0 011 1v2" />
              <rect x="5" y="8" width="14" height="10" rx="1" />
            </svg>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Configura las llaves de WooCommerce para ver los productos.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: '0.9rem',
          }}>
            No hay productos disponibles.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function ProductCard({ product: p }: { product: Awaited<ReturnType<typeof getKioskoProducts>>[0] }) {
  const cover = p.images[0]?.src
  const hasDiscount = p.sale_price && p.sale_price !== p.regular_price

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: '12px', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Cover image */}
      <div style={{ position: 'relative', paddingTop: '140%', background: 'var(--surface)' }}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={p.images[0]?.alt || p.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', opacity: 0.3,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{
          margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
          fontWeight: '600', color: 'var(--text)', lineHeight: '1.3',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {p.name}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-warm)' }}>
            {hasDiscount ? p.sale_price : p.price ? p.price : ''}
            {(p.sale_price || p.price) ? ' $' : 'Gratis'}
          </span>
          {hasDiscount && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              {p.regular_price} $
            </span>
          )}
        </div>

        <a
          href={p.permalink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 'auto',
            display: 'block', textAlign: 'center',
            padding: '9px', borderRadius: '8px',
            background: 'var(--accent-warm)', color: '#fff',
            textDecoration: 'none', fontFamily: 'var(--font-ui)',
            fontSize: '0.8rem', fontWeight: '700',
          }}
        >
          Comprar
        </a>
      </div>
    </div>
  )
}
