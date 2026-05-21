'use client'

import { useState, useEffect } from 'react'
import { isSaved, saveArticle, unsaveArticle, type SavedArticle } from '@/lib/saved'

interface Props {
  article: SavedArticle
}

export default function SaveButton({ article }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(isSaved(article.slug))
  }, [article.slug])

  function toggle() {
    if (saved) {
      unsaveArticle(article.slug)
      setSaved(false)
    } else {
      saveArticle(article)
      setSaved(true)
    }
  }

  return (
    <button
      onClick={toggle}
      title={saved ? 'Quitar de guardados' : 'Guardar artículo'}
      style={{
        background: saved ? 'var(--accent-warm)' : 'none',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '5px 10px',
        cursor: 'pointer',
        color: saved ? '#fff' : 'var(--text-soft)',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'background 0.2s, color 0.2s',
      }}
    >
      <BookmarkIcon filled={saved} />
      <span style={{ letterSpacing: '0.02em' }}>{saved ? 'Guardado' : 'Guardar'}</span>
    </button>
  )
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#fff' : 'none'} stroke={filled ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  )
}
