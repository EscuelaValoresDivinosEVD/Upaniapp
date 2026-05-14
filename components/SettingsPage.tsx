'use client'

import Link from 'next/link'
import PushNotificationToggle from './PushNotificationToggle'
import { useTheme } from './ThemeProvider'

export default function SettingsPage() {
  const { theme, toggle } = useTheme()

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
          Configuración
        </h1>
      </header>

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px 120px' }}>

        {/* Notificaciones */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            marginBottom: '10px', margin: '0 0 10px 4px',
          }}>
            Notificaciones
          </p>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <NotifRow />
          </div>
        </section>

        {/* Apariencia */}
        <section>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            margin: '0 0 10px 4px',
          }}>
            Apariencia
          </p>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 18px',
            }}>
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: 'var(--text)' }}>
                  Modo oscuro
                </p>
                <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? 'Activado' : 'Desactivado'}
                </p>
              </div>
              <button
                onClick={toggle}
                style={{
                  width: '48px', height: '28px', borderRadius: '14px',
                  background: theme === 'dark' ? 'var(--orange)' : 'var(--border)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: theme === 'dark' ? '23px' : '3px',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

function NotifRow() {
  return (
    <div style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: 'var(--text)' }}>
            Nuevos artículos
          </p>
          <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Recibe una notificación cada vez que se publique un nuevo artículo en Upaninews
          </p>
        </div>
        <div style={{ flexShrink: 0, paddingTop: '2px' }}>
          <PushNotificationToggle />
        </div>
      </div>
    </div>
  )
}
