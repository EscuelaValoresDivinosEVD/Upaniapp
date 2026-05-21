'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, CATEGORY_GROUPS } from '@/lib/categories'

interface Props {
  open: boolean
  onClose: () => void
}

const SWIPE_THRESHOLD = 70

export default function CategoryDrawer({ open, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [dragY, setDragY] = useState(0)
  const dragStartRef = useRef(0)
  const draggingRef = useRef(false)
  const dragYRef = useRef(0)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])

  // Lock body scroll (iOS-safe)
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`
    } else {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (top) window.scrollTo(0, -parseInt(top))
      setDragY(0)
      dragYRef.current = 0
      draggingRef.current = false
    }
    return () => {
      const top = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (top) window.scrollTo(0, -parseInt(top))
    }
  }, [open])

  // Swipe down to close
  useEffect(() => {
    const el = drawerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      dragStartRef.current = e.touches[0].clientY
      draggingRef.current = true
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return
      const delta = e.touches[0].clientY - dragStartRef.current
      if (delta > 0) {
        e.preventDefault()
        dragYRef.current = delta
        setDragY(delta)
      }
    }

    const onTouchEnd = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const d = dragYRef.current
      dragYRef.current = 0
      setDragY(0)
      if (d >= SWIPE_THRESHOLD) onCloseRef.current()
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const drawerTransform = !open
    ? 'translateY(100%)'
    : dragY > 0 ? `translateY(${dragY}px)` : 'translateY(0)'

  const drawerTransition = dragY > 0
    ? 'none'
    : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)'

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer — no scroll, fits all content */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          zIndex: 70,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--border)',
          overflow: 'hidden',
          transform: drawerTransform,
          transition: drawerTransition,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 72px)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 18px 10px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>
            Categorías
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '10px 16px 0' }}>
          {/* Todas las entradas */}
          <Link href="/" onClick={onClose} style={{
            display: 'block', padding: '7px 12px', borderRadius: '8px',
            background: 'var(--card)', color: 'var(--accent-warm)',
            textDecoration: 'none', fontFamily: 'var(--font-display)',
            fontSize: '0.88rem', fontWeight: '600', marginBottom: '10px',
          }}>
            ✦ Todas las entradas
          </Link>

          {CATEGORY_GROUPS.map((group) => (
            <div key={group} style={{ marginBottom: '10px' }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '0.62rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--text-muted)', margin: '0 0 6px 2px',
              }}>
                {group}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CATEGORIES.filter((c) => c.group === group).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-soft)',
                      textDecoration: 'none',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-ui)',
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
