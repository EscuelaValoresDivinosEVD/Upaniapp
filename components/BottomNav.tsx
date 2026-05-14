'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import CategoryDrawer from './CategoryDrawer'
import SearchDrawer from './SearchDrawer'

export default function BottomNav() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const isHome = pathname === '/'

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingTop: '8px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
        }}
      >
        {/* Home */}
        <Link
          href="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px 16px',
            color: isHome ? 'var(--accent-warm)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
            transition: 'color 0.2s',
          }}
        >
          <HomeIcon active={isHome} />
          <span>Inicio</span>
        </Link>

        {/* Buscar */}
        <button
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
          }}
        >
          <SearchIcon />
          <span>Buscar</span>
        </button>

        {/* Categorías */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px 16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
          }}
        >
          <MenuIcon />
          <span>Categorías</span>
        </button>

        {/* Tienda */}
        <a
          href="https://upaninews.com/tienda/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px 16px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
            transition: 'color 0.2s',
          }}
        >
          <ShopIcon />
          <span>Tienda</span>
        </a>
      </nav>

      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}
