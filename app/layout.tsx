import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Lora } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import BottomNav from '@/components/BottomNav'
import ServiceWorkerSetup from '@/components/ServiceWorkerSetup'
import InstallPrompt from '@/components/InstallPrompt'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0EAF8' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0812' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${lora.variable}`}>
      <head>
        <style>{`
          :root {
            --font-display: var(--font-playfair), Georgia, serif;
            --font-reading: var(--font-lora), Georgia, serif;
            --font-ui: var(--font-lora), Georgia, serif;
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider>
          <ServiceWorkerSetup />
          {children}
          <BottomNav />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
