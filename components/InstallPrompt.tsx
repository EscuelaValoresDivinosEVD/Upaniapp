'use client'

import { useEffect, useState } from 'react'

type Mode = 'native' | 'ios' | null

export default function InstallPrompt() {
  const [mode, setMode] = useState<Mode>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (localStorage.getItem('upani-install-dismissed')) return
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((navigator as any).standalone === true) return

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios/i.test(navigator.userAgent)

    if (isIos && isSafari) {
      const timer = setTimeout(() => setMode('ios'), 2500)
      return () => clearTimeout(timer)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setMode('native'), 2500)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    localStorage.setItem('upani-install-dismissed', '1')
    setMode(null)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') localStorage.setItem('upani-install-dismissed', '1')
    setMode(null)
  }

  if (!mode) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          background: 'rgba(0,0,0,0.4)',
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--border)',
          padding: '20px 24px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 28px)',
          animation: 'slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        `}</style>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', marginTop: '-8px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
        </div>

        {/* Icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            background: 'var(--accent-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AddToHomeIcon />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: 'var(--text)', margin: 0 }}>
              Guarda Upaninews
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
              {mode === 'native'
                ? 'Accede rápido desde tu pantalla de inicio'
                : 'Añádela a tu pantalla de inicio'}
            </p>
          </div>
        </div>

        {mode === 'native' ? (
          /* Android / Chrome — direct install */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.84rem',
              color: 'var(--text-soft)',
              margin: 0,
              lineHeight: '1.5',
            }}>
              Una vez instalada, activa las <span style={{ color: 'var(--orange)', fontWeight: '600' }}>notificaciones</span> para recibir los nuevos artículos de Upaninews.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={dismiss}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Ahora no
              </button>
              <button
                onClick={install}
                style={{
                  flex: 2,
                  padding: '12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: 'var(--accent-warm)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                }}
              >
                Instalar app
              </button>
            </div>
          </div>
        ) : (
          /* iOS Safari — manual steps */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { n: '1', text: 'Toca el botón Compartir', icon: <ShareIcon /> },
                { n: '2', text: 'Elige "Añadir a pantalla de inicio"', icon: <AddIcon /> },
                { n: '3', text: 'Toca "Añadir" en la esquina superior derecha', icon: <CheckIcon /> },
                { n: '4', text: 'Activa las notificaciones para recibir nuevos artículos', icon: <BellIcon /> },
              ].map(({ n, text, icon }) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--orange)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    flexShrink: 0,
                  }}>
                    {n}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: 'var(--text-soft)', lineHeight: '1.35' }}>
                      {text}
                    </span>
                    <span style={{ color: 'var(--accent-warm)', flexShrink: 0 }}>{icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={dismiss}
              style={{
                width: '100%',
                padding: '13px',
                border: 'none',
                borderRadius: '10px',
                background: 'var(--accent-warm)',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Entendido
            </button>
          </>
        )}
      </div>
    </>
  )
}

function AddToHomeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="8" x2="12" y2="14" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}
