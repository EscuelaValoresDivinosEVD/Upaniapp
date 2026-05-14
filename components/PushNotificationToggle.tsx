'use client'

import { useEffect, useState } from 'react'

type State = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'

function urlBase64ToUint8Array(base64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  const buf = new ArrayBuffer(raw.length)
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
  return buf
}

export default function PushNotificationToggle() {
  const [state, setState] = useState<State>('loading')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setState('denied')
      return
    }
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      setState(sub ? 'subscribed' : 'unsubscribed')
    })
  }, [])

  async function toggle() {
    if (busy) return
    setBusy(true)
    try {
      if (state === 'subscribed') {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await fetch('/api/subscribe', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub),
          })
          await sub.unsubscribe()
        }
        setState('unsubscribed')
      } else {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),
        })
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub),
        })
        setState('subscribed')
      }
    } catch {
      // User dismissed permission prompt or error occurred
    } finally {
      setBusy(false)
    }
  }

  if (state === 'unsupported' || state === 'denied' || state === 'loading') return null

  const isOn = state === 'subscribed'

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={isOn ? 'Desactivar notificaciones' : 'Activar notificaciones de nuevas entradas'}
      style={{
        background: 'none',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '6px 10px',
        cursor: busy ? 'wait' : 'pointer',
        color: isOn ? 'var(--accent-warm)' : 'var(--text-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-ui)',
        opacity: busy ? 0.6 : 1,
        transition: 'color 0.2s',
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={isOn ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {isOn ? 'On' : 'Off'}
    </button>
  )
}
