'use client'

import Link from 'next/link'
import PushNotificationToggle from './PushNotificationToggle'
import { useTheme } from './ThemeProvider'
import { useState } from 'react'

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
        <section style={{ marginBottom: '32px' }}>
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

        {/* Contacto */}
        <section style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            margin: '0 0 10px 4px',
          }}>
            Soporte
          </p>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <Link
              href="/contacto"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(206,158,240,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: 'var(--text)', fontWeight: '500' }}>
                    Contáctanos
                  </p>
                  <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Reportes, sugerencias y aportes
                  </p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Admin — hidden, tap logo 5x to reveal */}
        <AdminSection />

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

function AdminSection() {
  const [taps, setTaps] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [secret, setSecret] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null)
  const [sending, setSending] = useState(false)

  const handleLogoTap = () => {
    const next = taps + 1
    setTaps(next)
    if (next >= 5) {
      setRevealed(true)
      setTaps(0)
    }
  }

  const unlock = () => {
    if (secret.trim()) setUnlocked(true)
  }

  const send = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true)
    setStatus(null)
    try {
      const res = await fetch('/api/test-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), url: url.trim() || '/' }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus({ ok: true, msg: `Enviada a ${data.sent} suscriptor${data.sent !== 1 ? 'es' : ''}` })
        setTitle('')
        setBody('')
        setUrl('')
      } else {
        setStatus({ ok: false, msg: res.status === 401 ? 'Contraseña incorrecta' : 'Error al enviar' })
      }
    } catch {
      setStatus({ ok: false, msg: 'Error de conexión' })
    } finally {
      setSending(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.88rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <section style={{ marginTop: '8px' }}>
      {/* Decorative logo — tap 5x to reveal admin panel */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0 8px' }}>
        <button
          onClick={handleLogoTap}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', opacity: 0.25, lineHeight: 0 }}
          aria-label=""
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 906 601.67"
            width="36" height="24" style={{ color: 'var(--text-muted)', display: 'block' }}>
            <defs>
              <style>{`.as1{fill:currentColor}.as2{fill:none;stroke:currentColor;stroke-linecap:round;stroke-miterlimit:10;stroke-width:18px}`}</style>
            </defs>
            <circle className="as1" cx="453.5" cy="32.36" r="22.3"/>
            <ellipse className="as2" cx="453.5" cy="300.84" rx="69.23" ry="192.29"/>
            <line className="as2" x1="624.03" y1="389.74" x2="283.1" y2="389.74"/>
            <line className="as2" x1="261.21" y1="300.84" x2="644.21" y2="300.84"/>
            <line className="as2" x1="283.1" y1="211.66" x2="621.82" y2="211.66"/>
            <circle className="as2" cx="453.5" cy="300.84" r="192.29"/>
            <ellipse className="as2" cx="599.94" cy="300.84" rx="146.44" ry="192.29"/>
            <ellipse className="as2" cx="638.55" cy="300.84" rx="185.05" ry="242.99"/>
            <ellipse className="as2" cx="675.75" cy="300.84" rx="222.25" ry="291.84"/>
            <ellipse className="as2" cx="307.06" cy="300.84" rx="146.44" ry="192.29"/>
            <ellipse className="as2" cx="268.45" cy="300.84" rx="185.05" ry="242.99"/>
            <ellipse className="as2" cx="231.25" cy="300.84" rx="222.25" ry="291.84"/>
          </svg>
        </button>
      </div>

      {revealed && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: '12px', overflow: 'hidden', marginTop: '8px',
        }}>
          {!unlocked ? (
            <div style={{ padding: '16px 18px' }}>
              <p style={{ margin: '0 0 10px', fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Contraseña de administrador
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={secret}
                  onChange={e => setSecret(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && unlock()}
                  style={inputStyle}
                />
                <button
                  onClick={unlock}
                  style={{
                    padding: '10px 16px', borderRadius: '8px',
                    background: 'var(--accent-warm)', color: '#fff',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontSize: '0.88rem',
                    fontWeight: '600', whiteSpace: 'nowrap' as const,
                  }}
                >
                  Entrar
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)' }}>
                Enviar notificación push
              </p>
              <input
                type="text"
                placeholder="Título *"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="Mensaje *"
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' as const }}
              />
              <input
                type="text"
                placeholder="URL (opcional, ej: /)"
                value={url}
                onChange={e => setUrl(e.target.value)}
                style={inputStyle}
              />
              {status && (
                <p style={{
                  margin: 0, fontFamily: 'var(--font-ui)', fontSize: '0.83rem',
                  color: status.ok ? '#6abf6a' : '#e07070',
                  padding: '8px 12px', borderRadius: '8px',
                  background: status.ok ? 'rgba(106,191,106,0.1)' : 'rgba(224,112,112,0.1)',
                }}>
                  {status.msg}
                </p>
              )}
              <button
                onClick={send}
                disabled={sending || !title.trim() || !body.trim()}
                style={{
                  padding: '12px', borderRadius: '8px',
                  background: sending || !title.trim() || !body.trim() ? 'var(--border)' : 'var(--accent-warm)',
                  color: '#fff', border: 'none',
                  cursor: sending || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: '600',
                  transition: 'background 0.2s',
                }}
              >
                {sending ? 'Enviando…' : 'Enviar a todos los suscriptores'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
