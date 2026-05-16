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
  const isSettings = pathname === '/settings'
  const isKiosko = pathname === '/kiosko'

  const itemStyle = (active: boolean) => ({
    display: 'flex' as const,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    gap: '4px',
    padding: '2px 0',
    minWidth: '48px',
    color: active ? 'var(--accent-warm)' : 'rgba(232,137,90,0.5)',
    textDecoration: 'none',
    fontSize: '10px',
    fontFamily: 'var(--font-ui)',
    letterSpacing: '0.04em',
    transition: 'color 0.2s',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  })

  return (
    <>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
        padding: '10px 16px',
        paddingBottom: 'max(calc(env(safe-area-inset-bottom) + 10px), 20px)',
      }}>
        <Link href="/" style={itemStyle(isHome)}>
          <HomeIcon active={isHome} />
          <span>Inicio</span>
        </Link>

        <button onClick={() => setSearchOpen(true)} style={itemStyle(false)}>
          <SearchIcon />
          <span>Buscar</span>
        </button>

        <Link href="/kiosko" style={itemStyle(isKiosko)}>
          <KioskoIcon active={isKiosko} />
          <span>Kiosko</span>
        </Link>

        <button onClick={() => setDrawerOpen(true)} style={itemStyle(false)}>
          <MenuIcon />
          <span>Categorías</span>
        </button>

        <Link href="/saved" style={itemStyle(isSaved)}>
          <BookmarkIcon active={isSaved} />
          <span>Guardados</span>
        </Link>

        <Link href="/settings" style={itemStyle(isSettings)}>
          <SettingsIcon active={isSettings} />
          <span>Ajustes</span>
        </Link>
      </nav>

      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? 'var(--accent-warm)' : 'none'} stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function KioskoIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 8h20" />
      <path d="M4 8V6a1 1 0 011-1h14a1 1 0 011 1v2" />
      <rect x="5" y="8" width="14" height="10" rx="1" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="14.5" x2="16" y2="14.5" />
      <line x1="7" y1="18" x2="7" y2="21" />
      <line x1="17" y1="18" x2="17" y2="21" />
      <line x1="5" y1="21" x2="19" y2="21" />
    </svg>
  )
}
