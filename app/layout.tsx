import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WATCHER — Crypto Intelligence Agent',
  description: 'Autonomous crypto intelligence agent monitoring Base Network tokens in real-time.',
  openGraph: {
    title: 'WATCHER — Crypto Intelligence Agent',
    description: 'Real-time spike detection and volume monitoring for Base Network tokens.',
    images: [{ url: '/banner.png', width: 1500, height: 500 }],
  },
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
