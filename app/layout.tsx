import type { Metadata, Viewport } from 'next'
import { Oswald, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import BottomNav from '@/components/BottomNav'
import ServiceWorkerSetup from '@/components/ServiceWorkerSetup'
import InstallPrompt from '@/components/InstallPrompt'
import SplashScreen from '@/components/SplashScreen'
import PWATracker from '@/components/PWATracker'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Upaninews',
  description: 'Revista digital de consciencia, espiritualidad y cultura',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
  openGraph: {
    title: 'Upaninews',
    description: 'Revista digital de consciencia, espiritualidad y cultura',
    images: [{ url: '/icons/icon-512.png', width: 512, height: 512, alt: 'Upaninews' }],
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'Upaninews',
    description: 'Revista digital de consciencia, espiritualidad y cultura',
    images: ['/icons/icon-512.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#561e57',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${oswald.variable} ${lora.variable}`}>
      <head>
        <style>{`
          :root {
            --font-display: var(--font-oswald), 'Arial Narrow', sans-serif;
            --font-reading: var(--font-lora), Georgia, serif;
            --font-ui: var(--font-oswald), 'Arial Narrow', sans-serif;
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider>
          <SplashScreen />
          <PWATracker />
          <ServiceWorkerSetup />
          {children}
          <BottomNav />
          <InstallPrompt />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
