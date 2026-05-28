'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

export default function PWATracker() {
  useEffect(() => {
    // Track when app is opened already installed (standalone mode)
    // Works on both iOS and Android — once per session
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) {
      track('pwa_launched')
    }

    // Track the install event on Android/Chrome
    const onInstalled = () => track('pwa_installed')
    window.addEventListener('appinstalled', onInstalled)
    return () => window.removeEventListener('appinstalled', onInstalled)
  }, [])

  return null
}
