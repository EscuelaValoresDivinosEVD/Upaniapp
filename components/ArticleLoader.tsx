'use client'

import { useEffect, useState } from 'react'
import { fetchFeedClient, type RssItem } from '@/lib/rss-client'
import { getSaved } from '@/lib/saved'
import ReaderClient from './ReaderClient'

export default function ArticleLoader({ slug }: { slug: string }) {
  const [item, setItem] = useState<RssItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedClient().then((items) => {
      let found: RssItem | null = items.find((i) => i.slug === slug) ?? null
      if (!found) {
        const saved = getSaved().find((a) => a.slug === slug)
        if (saved) found = { ...saved, guid: saved.slug, creator: '' }
      }
      setItem(found)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 907 601.67" style={{ width: '100px', height: 'auto', animation: 'pulse 1.8s ease-in-out infinite' }}>
          <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }`}</style>
          <circle fill="#E8895A" cx="453.5" cy="32.36" r="22.3"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="453.5" cy="300.84" rx="69.23" ry="192.29"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="624.03" y1="389.74" x2="283.1" y2="389.74"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="261.21" y1="300.84" x2="644.21" y2="300.84"/>
          <line stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" x1="283.1" y1="211.66" x2="621.82" y2="211.66"/>
          <circle fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="453.5" cy="300.84" r="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="599.94" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="638.55" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="675.75" cy="300.84" rx="222.25" ry="291.84"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="307.06" cy="300.84" rx="146.44" ry="192.29"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="268.45" cy="300.84" rx="185.05" ry="242.99"/>
          <ellipse fill="none" stroke="#E8895A" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="18" cx="231.25" cy="300.84" rx="222.25" ry="291.84"/>
        </svg>
      </div>
    )
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)' }}>Entrada no encontrada</p>
        <a href="/" style={{ color: 'var(--accent-warm)', fontFamily: 'var(--font-ui)' }}>← Volver al inicio</a>
      </div>
    )
  }

  return (
    <ReaderClient
      slug={item.slug}
      title={item.title}
      pubDate={item.pubDate}
      categories={item.categories}
      content={item.content}
      description={item.description}
      image={item.image}
      sourceUrl={item.link}
    />
  )
}
