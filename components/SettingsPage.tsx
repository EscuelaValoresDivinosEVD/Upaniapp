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

        {/* Instalar la app */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            margin: '0 0 10px 4px',
          }}>
            Instalar la app
          </p>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {/* iOS */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-soft)', flexShrink: 0 }}>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>
                  iPhone / iPad
                </span>
              </div>
              <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  <>Abre esta página en <strong style={{ color: 'var(--text)' }}>Safari</strong></>,
                  <>Toca el ícono de compartir <ShareIcon /> en la barra inferior</>,
                  <>Desplázate y toca <strong style={{ color: 'var(--text)' }}>"Añadir a pantalla de inicio"</strong></>,
                  <>Toca <strong style={{ color: 'var(--accent-warm)' }}>Añadir</strong> para confirmar</>,
                ].map((step, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Android */}
            <div style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--text-soft)', flexShrink: 0 }}>
                  <path d="M17.523 0.976l-1.401 2.43a7.304 7.304 0 0 0-8.244 0L6.477.976A9.528 9.528 0 0 0 2 9h20a9.528 9.528 0 0 0-4.477-8.024zM8 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm9 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM2 10v6a2 2 0 0 0 2 2h.5v3.5a1.5 1.5 0 0 0 3 0V18h5v3.5a1.5 1.5 0 0 0 3 0V18H16a2 2 0 0 0 2-2v-6H2zm-1.5 1a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3A1.5 1.5 0 0 1 .5 11zm23 0a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-3 0v-3a1.5 1.5 0 0 1 1.5-1.5z"/>
                </svg>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>
                  Android
                </span>
              </div>
              <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  <>Abre esta página en <strong style={{ color: 'var(--text)' }}>Chrome</strong></>,
                  <>Toca el menú <strong style={{ color: 'var(--text)' }}>⋮</strong> en la esquina superior derecha</>,
                  <>Toca <strong style={{ color: 'var(--text)' }}>"Añadir a pantalla de inicio"</strong> o <strong style={{ color: 'var(--text)' }}>"Instalar app"</strong></>,
                  <>Toca <strong style={{ color: 'var(--accent-warm)' }}>Instalar</strong> para confirmar</>,
                ].map((step, i) => (
                  <li key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

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
                  {theme === 'dark' ? 'Activado' : 'Desactivado'} · se adapta automáticamente al sistema
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

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px', color: 'var(--accent-warm)' }}>
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
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
