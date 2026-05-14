'use client'

import { useState, useEffect, useRef } from 'react'

export default function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!sessionStorage.getItem('upani-splash-shown')) {
      sessionStorage.setItem('upani-splash-shown', '1')
      setVisible(true)
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    // Fallback: hide after 6s if video doesn't play or is too long
    const timer = setTimeout(hide, 6000)
    return () => clearTimeout(timer)
  }, [visible])

  function hide() {
    setFading(true)
    setTimeout(() => setVisible(false), 500)
  }

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#561e57',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fading ? 'none' : 'all',
      }}
    >
      <video
        ref={videoRef}
        src="/Loading.webm"
        autoPlay
        muted
        playsInline
        onEnded={hide}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
