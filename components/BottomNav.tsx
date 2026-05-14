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
  const isSaved = pathname === '/saved'

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
          paddingTop: '10px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
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

        {/* Guardados */}
        <Link
          href="/saved"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px 16px',
            color: isSaved ? 'var(--accent-warm)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
            transition: 'color 0.2s',
          }}
        >
          <BookmarkIcon active={isSaved} />
          <span>Guardados</span>
        </Link>

        {/* Kiosko */}
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
          <KioskoIcon />
          <span>Kiosko</span>
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

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--accent-warm)' : 'none'} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function KioskoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Roof / awning */}
      <path d="M2 8h20" />
      <path d="M4 8V6a1 1 0 011-1h14a1 1 0 011 1v2" />
      {/* Stand body */}
      <rect x="5" y="8" width="14" height="10" rx="1" />
      {/* Newspapers on display */}
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="14.5" x2="16" y2="14.5" />
      {/* Legs */}
      <line x1="7" y1="18" x2="7" y2="21" />
      <line x1="17" y1="18" x2="17" y2="21" />
      <line x1="5" y1="21" x2="19" y2="21" />
    </svg>
  )
}
