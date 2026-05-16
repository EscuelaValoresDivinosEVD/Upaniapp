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

export default function NotificationBell() {
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
      // user dismissed permission prompt
    } finally {
      setBusy(false)
    }
  }

  if (state === 'loading' || state === 'unsupported' || state === 'denied') return null

  const active = state === 'subscribed'

  return (
    <button
      onClick={toggle}
      disabled={busy}
      title={active ? 'Desactivar notificaciones' : 'Activar notificaciones'}
      style={{
        background: 'none',
        border: 'none',
        cursor: busy ? 'wait' : 'pointer',
        padding: '6px',
        color: active ? 'var(--accent-warm)' : 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: busy ? 0.5 : 1,
        transition: 'color 0.2s',
        position: 'relative',
      }}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? 2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>
  )
}
