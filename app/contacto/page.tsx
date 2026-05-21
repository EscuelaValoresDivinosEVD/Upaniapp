import Link from 'next/link'
import ContactForm from '@/components/ContactForm'

export const metadata = { title: 'Contacto · Upaninews' }

export default function ContactPage() {
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
        padding: '0 20px',
        height: '52px',
        gap: '14px',
      }}>
        <Link href="/settings" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-ui)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Ajustes
        </Link>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: '700',
          color: 'var(--text)',
          margin: 0,
        }}>
          Contacto
        </h1>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '28px 16px 0' }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
          margin: '0 0 28px',
        }}>
          ¿Tienes algo que compartir con nosotros? Completa el formulario y te responderemos pronto.
        </p>
      </div>

      <ContactForm />
    </div>
  )
}
