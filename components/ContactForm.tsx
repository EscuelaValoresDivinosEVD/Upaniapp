'use client'

import { useState } from 'react'
import Link from 'next/link'

type Category = 'problema' | 'sugerencia' | 'aportes'

const CATEGORIES: { value: Category; label: string; desc: string; icon: string }[] = [
  { value: 'problema', label: 'Reporte de problema', desc: 'Algo no funciona como debería', icon: '⚠' },
  { value: 'sugerencia', label: 'Sugerencia', desc: 'Una idea para mejorar la app', icon: '💡' },
  { value: 'aportes', label: 'Aportes', desc: 'Contenido, colaboración o recursos', icon: '✦' },
]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState<Category | null>(null)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const isValid = name.trim() && email.trim() && category && message.trim()
  const MAX = 1000

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || status === 'sending') return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), category, message: message.trim() }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus('sent')
      } else {
        setErrorMsg(data.error ?? 'Error al enviar. Intenta de nuevo.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Error de conexión. Verifica tu internet.')
      setStatus('error')
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontFamily: 'var(--font-ui)',
    fontSize: '0.92rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  if (status === 'sent') {
    return (
      <div style={{
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(206,158,240,0.15)',
          border: '2px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
        }}>
          ✓
        </div>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--text)',
            margin: '0 0 8px',
          }}>
            ¡Mensaje enviado!
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: '280px',
            lineHeight: '1.5',
          }}>
            Gracias por escribirnos. Te responderemos a <strong style={{ color: 'var(--text)' }}>{email}</strong> a la brevedad.
          </p>
        </div>
        <Link
          href="/settings"
          style={{
            marginTop: '8px',
            padding: '12px 28px',
            background: 'var(--accent-warm)',
            color: '#fff',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: '600',
          }}
        >
          Volver a Ajustes
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px 120px' }}>

      {/* Name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.78rem',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          Nombre
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          maxLength={80}
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.78rem',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          Correo electrónico
        </label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          style={inputBase}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* Category */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.78rem',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          Categoría
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${category === cat.value ? 'var(--accent)' : 'var(--border)'}`,
                background: category === cat.value ? 'rgba(206,158,240,0.1)' : 'var(--card)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: '1.1rem', flexShrink: 0, width: '24px', textAlign: 'center' }}>
                {cat.icon}
              </span>
              <div>
                <p style={{
                  margin: 0,
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.92rem',
                  fontWeight: category === cat.value ? '700' : '500',
                  color: category === cat.value ? 'var(--text)' : 'var(--text-soft)',
                }}>
                  {cat.label}
                </p>
                <p style={{
                  margin: '2px 0 0',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}>
                  {cat.desc}
                </p>
              </div>
              {category === cat.value && (
                <svg style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--accent)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <label style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.78rem',
            fontWeight: '600',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Mensaje
          </label>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.72rem',
            color: message.length > MAX * 0.9 ? 'var(--orange)' : 'var(--text-muted)',
          }}>
            {message.length}/{MAX}
          </span>
        </div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value.slice(0, MAX))}
          placeholder="Escribe tu mensaje aquí…"
          required
          rows={5}
          style={{ ...inputBase, resize: 'vertical', minHeight: '120px', lineHeight: '1.55' }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* Error */}
      {status === 'error' && errorMsg && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(224,112,112,0.1)',
          border: '1px solid rgba(224,112,112,0.3)',
          marginBottom: '16px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          color: '#e07070',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || status === 'sending'}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          background: !isValid || status === 'sending' ? 'var(--border)' : 'var(--accent-warm)',
          color: !isValid || status === 'sending' ? 'var(--text-muted)' : '#fff',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: !isValid || status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s, color 0.2s',
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {status === 'sending' ? (
          <>
            <span style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }} />
            Enviando…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Enviar mensaje
          </>
        )}
      </button>

      <p style={{
        textAlign: 'center',
        marginTop: '16px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        lineHeight: '1.5',
      }}>
        Tu correo solo se usa para responderte. No lo compartimos con nadie.
      </p>
    </form>
  )
}
