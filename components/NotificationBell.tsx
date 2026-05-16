'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

type Notif = {
  id: string
  title: string
  body: string
  url: string
  time: number
  read: boolean
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('upani-notifs', 1)
    req.onupgradeneeded = (e) => {
      (e.target as IDBOpenDBRequest).result.createObjectStore('notifications', { keyPath: 'id' })
    }
    req.onsuccess = () => resolve((req as IDBOpenDBRequest).result)
    req.onerror = () => reject(req.error)
  })
}

async function getAllNotifs(): Promise<Notif[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notifications', 'readonly')
    const req = tx.objectStore('notifications').getAll()
    req.onsuccess = () => resolve((req.result as Notif[]).sort((a, b) => b.time - a.time))
    req.onerror = () => reject(req.error)
  })
}

async function markAllRead(notifs: Notif[]): Promise<void> {
  const unread = notifs.filter((n) => !n.read)
  if (!unread.length) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notifications', 'readwrite')
    const store = tx.objectStore('notifications')
    for (const n of unread) store.put({ ...n, read: true })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  return `hace ${days} día${days !== 1 ? 's' : ''}`
}

export default function NotificationBell() {
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [open, setOpen] = useState(false)
  const [supported, setSupported] = useState(false)

  const load = useCallback(async () => {
    try {
      const all = await getAllNotifs()
      setNotifs(all)
    } catch {
      // IndexedDB not available
    }
  }, [])

  useEffect(() => {
    if (!('indexedDB' in window)) return
    setSupported(true)
    load()
  }, [load])

  const openDrawer = async () => {
    setOpen(true)
    await load()
    await markAllRead(notifs)
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
    if ('clearAppBadge' in navigator) navigator.clearAppBadge()
  }

  const closeDrawer = () => setOpen(false)

  if (!supported) return null

  const unread = notifs.filter((n) => !n.read).length

  return (
    <>
      <button
        onClick={openDrawer}
        title="Notificaciones"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          color: unread > 0 ? 'var(--accent-warm)' : 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'color 0.2s',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24"
          fill={unread > 0 ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={unread > 0 ? 2 : 1.8}
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'var(--accent-warm)',
            color: '#fff',
            fontSize: '9px',
            fontFamily: 'var(--font-ui)',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={closeDrawer}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(0,0,0,0.4)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 61,
        width: 'min(360px, 100vw)',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: open ? '-8px 0 32px rgba(0,0,0,0.3)' : 'none',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: '700', color: 'var(--text)' }}>
            Notificaciones
          </span>
          <button onClick={closeDrawer} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', padding: '4px', display: 'flex',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {notifs.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '200px', gap: '12px',
              color: 'var(--text-muted)', fontFamily: 'var(--font-ui)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Sin notificaciones</span>
            </div>
          ) : (
            notifs.map((n) => (
              <Link
                key={n.id}
                href={n.url}
                onClick={closeDrawer}
                style={{
                  display: 'block',
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none',
                  background: n.read ? 'transparent' : 'rgba(232,137,90,0.07)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: n.read ? '500' : '700',
                    color: 'var(--text)', lineHeight: '1.3',
                  }}>
                    {n.title}
                  </span>
                  {!n.read && (
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--accent-warm)', flexShrink: 0, marginTop: '5px',
                    }} />
                  )}
                </div>
                {n.body && (
                  <p style={{
                    margin: '4px 0 0', fontFamily: 'var(--font-ui)', fontSize: '0.8rem',
                    color: 'var(--text-muted)', lineHeight: '1.4',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {n.body}
                  </p>
                )}
                <span style={{ display: 'block', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }}>
                  {timeAgo(n.time)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  )
}
