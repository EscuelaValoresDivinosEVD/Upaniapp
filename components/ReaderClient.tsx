'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { formatDate } from '@/lib/rss'
import SaveButton from './SaveButton'

interface Props {
  slug: string
  title: string
  pubDate: string
  categories: string[]
  content: string
  description: string
  image?: string
  sourceUrl: string
}

const FONT_SIZES = [
  { label: 'S', value: '0.95rem', lineHeight: '1.85' },
  { label: 'M', value: '1.05rem', lineHeight: '1.9' },
  { label: 'L', value: '1.2rem', lineHeight: '1.95' },
  { label: 'XL', value: '1.35rem', lineHeight: '2.0' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'hi', label: 'हिंदी' },
]

function stripHtml(html: string): string {
  return html
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function chunkText(text: string, maxLen = 450): string[] {
  const paragraphs = text.split('\n').filter((p) => p.trim())
  const chunks: string[] = []
  let current = ''
  for (const para of paragraphs) {
    if (current.length + para.length + 1 > maxLen) {
      if (current) chunks.push(current.trim())
      if (para.length > maxLen) {
        // split long paragraph at sentence boundaries
        let rem = para
        while (rem.length > maxLen) {
          let cut = rem.lastIndexOf('. ', maxLen)
          if (cut < 10) cut = rem.lastIndexOf(' ', maxLen)
          if (cut < 10) cut = maxLen
          chunks.push(rem.slice(0, cut + 1).trim())
          rem = rem.slice(cut + 1).trim()
        }
        current = rem
      } else {
        current = para
      }
    } else {
      current = current ? current + '\n' + para : para
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

async function translateChunk(text: string, targetLang: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${targetLang}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Translation request failed')
  const data = await res.json()
  if (data.responseStatus !== 200 && data.responseStatus !== '200') {
    throw new Error(data.responseDetails || 'Translation failed')
  }
  return data.responseData?.translatedText || text
}

async function translateText(html: string, targetLang: string): Promise<string> {
  const plain = stripHtml(html)
  const chunks = chunkText(plain)
  const results: string[] = []
  for (const chunk of chunks) {
    const translated = await translateChunk(chunk, targetLang)
    results.push(translated)
  }
  return results.join('\n\n')
}

export default function ReaderClient({ slug, title, pubDate, categories, content, description, image, sourceUrl }: Props) {
  const [fontIndex, setFontIndex] = useState(1)
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translated, setTranslated] = useState<string | null>(null)
  const [activeLang, setActiveLang] = useState<string | null>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const stored = localStorage.getItem('upani-font-size')
    if (stored) {
      const idx = FONT_SIZES.findIndex(f => f.value === stored)
      if (idx >= 0) setFontIndex(idx)
    }
  }, [])

  const changeFontSize = (idx: number) => {
    setFontIndex(idx)
    localStorage.setItem('upani-font-size', FONT_SIZES[idx].value)
  }

  const handleTranslate = async (langCode: string) => {
    if (langCode === activeLang) { setShowLangPicker(false); return }
    setShowLangPicker(false)
    setTranslating(true)
    try {
      const result = await translateText(bodyText, langCode)
      setTranslated(result)
      setActiveLang(langCode)
    } catch {
      setTranslated(null)
      setActiveLang(null)
    } finally {
      setTranslating(false)
    }
  }

  const resetTranslation = () => {
    setTranslated(null)
    setActiveLang(null)
    setShowLangPicker(false)
  }

  const currentFont = FONT_SIZES[fontIndex]
  const bodyText = content || description

  const articleData = { slug, title, pubDate, categories, content, description, image, link: sourceUrl, savedAt: 0 }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '52px',
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-ui)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Save button */}
          <SaveButton article={articleData} />

          {/* Translate button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              style={{
                background: activeLang || showLangPicker ? 'var(--card)' : 'none',
                border: activeLang ? '1px solid var(--accent-warm)' : '1px solid var(--border)',
                borderRadius: '6px',
                padding: '5px 8px',
                cursor: 'pointer',
                color: activeLang ? 'var(--accent-warm)' : 'var(--text-soft)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Traducir artículo"
            >
              <TranslateIcon />
              {activeLang && (
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em' }}>
                  {LANGUAGES.find(l => l.code === activeLang)?.label}
                </span>
              )}
            </button>

            {showLangPicker && (
              <div style={{
                position: 'absolute',
                top: '38px',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '6px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                minWidth: '140px',
                zIndex: 100,
              }}>
                {activeLang && (
                  <button
                    onClick={resetTranslation}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.82rem',
                      borderRadius: '6px',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '4px',
                    }}
                  >
                    ← Original
                  </button>
                )}
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleTranslate(lang.code)}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: activeLang === lang.code ? 'var(--card)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: activeLang === lang.code ? 'var(--accent-warm)' : 'var(--text)',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.85rem',
                      borderRadius: '6px',
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font size − / + */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => changeFontSize(Math.max(0, fontIndex - 1))}
              disabled={fontIndex === 0}
              style={{
                background: 'none',
                border: 'none',
                borderRight: '1px solid var(--border)',
                padding: '5px 10px',
                cursor: fontIndex === 0 ? 'default' : 'pointer',
                color: fontIndex === 0 ? 'var(--border)' : 'var(--text-soft)',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                lineHeight: 1,
              }}
              title="Texto más pequeño"
            >
              A−
            </button>
            <button
              onClick={() => changeFontSize(Math.min(FONT_SIZES.length - 1, fontIndex + 1))}
              disabled={fontIndex === FONT_SIZES.length - 1}
              style={{
                background: 'none',
                border: 'none',
                padding: '5px 10px',
                cursor: fontIndex === FONT_SIZES.length - 1 ? 'default' : 'pointer',
                color: fontIndex === FONT_SIZES.length - 1 ? 'var(--border)' : 'var(--text-soft)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                lineHeight: 1,
              }}
              title="Texto más grande"
            >
              A+
            </button>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '5px 8px',
              cursor: 'pointer',
              color: 'var(--text-soft)',
            }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Article */}
      <main style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '32px 20px 120px',
      }}>
        {/* Categories */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}`}
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-warm)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  padding: '3px 8px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
          fontWeight: '700',
          lineHeight: '1.25',
          color: 'var(--text)',
          marginBottom: '16px',
        }}>
          {title}
        </h1>

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <time style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-ui)',
            fontStyle: 'italic',
          }}>
            {formatDate(pubDate)}
          </time>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-ui)',
          }}>
            Upaninews
          </span>
          {activeLang && (
            <>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--accent-warm)',
                fontFamily: 'var(--font-ui)',
              }}>
                {LANGUAGES.find(l => l.code === activeLang)?.label}
              </span>
            </>
          )}
        </div>

        {/* Content */}
        {bodyText ? (
          translating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '48px 0', color: 'var(--text-muted)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warm)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 1.8s ease-in-out infinite' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
              </svg>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem' }}>Traduciendo...</span>
            </div>
          ) : translated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 14px',
                marginBottom: '24px',
                background: 'rgba(232,137,90,0.08)',
                border: '1px solid rgba(232,137,90,0.25)',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-ui)',
                fontStyle: 'italic',
                lineHeight: '1.5',
              }}>
                <span style={{ color: 'var(--accent-warm)', fontStyle: 'normal', fontWeight: '700', flexShrink: 0 }}>✦</span>
                <span>Traducido con inteligencia artificial. El texto puede contener imprecisiones.</span>
              </div>
              <div
                className="prose-vintage"
                style={{ fontSize: currentFont.value, lineHeight: currentFont.lineHeight }}
              >
                {translated.split('\n\n').map((para, i) =>
                  para.trim() ? <p key={i} style={{ marginBottom: '1.2em' }}>{para.trim()}</p> : null
                )}
              </div>
            </>
          ) : (
            <div
              className="prose-vintage"
              style={{
                fontSize: currentFont.value,
                lineHeight: currentFont.lineHeight,
              }}
              dangerouslySetInnerHTML={{ __html: bodyText }}
            />
          )
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '48px 0',
            color: 'var(--text-muted)',
          }}>
            <p style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
              El contenido completo está en el artículo original.
            </p>
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: 'var(--accent-warm)',
                color: 'var(--bg)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
              }}
            >
              Leer en Upaninews →
            </a>
          </div>
        )}

        {/* Footer ornament */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          color: 'var(--accent-warm)',
          fontSize: '1.2rem',
          letterSpacing: '0.3em',
        }}>
          ❦
        </div>

        {/* Source link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid var(--border)',
        }}>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-ui)',
              textDecoration: 'none',
              fontStyle: 'italic',
            }}
          >
            Ver en upaninews.com ↗
          </a>
        </div>
      </main>
    </div>
  )
}

function TranslateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  )
}
