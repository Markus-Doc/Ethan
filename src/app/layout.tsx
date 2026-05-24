import type { Metadata } from 'next'
import SmoothScroll from '@/components/UI/SmoothScroll'
import { Cormorant_Garamond, EB_Garamond, Libre_Baskerville } from 'next/font/google'
import '@/styles/tokens.css'
import '@/styles/book.css'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--loaded-cormorant',
  display: 'optional',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--loaded-eb-garamond',
  display: 'optional',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--loaded-libre-baskerville',
  display: 'optional',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E3A2E',
}

export const metadata: Metadata = {
  title: 'Walker Book Works — Bespoke Book Repair, Binding & Workshops',
  description:
    'Handcrafted book repair, custom binding, and bookbinding workshops by Ethan Walker in Australia. Every book deserves a life well-bound.',
  keywords: ['book repair', 'book binding', 'bookbinding workshops', 'Australia', 'Walker Book Works'],
  openGraph: {
    title: 'Walker Book Works',
    description: 'Binding. Repair. Craft.',
    url: 'https://walkerbookworks.com.au',
    siteName: 'Walker Book Works',
    locale: 'en_AU',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      className={`${cormorant.variable} ${ebGaramond.variable} ${libreBaskerville.variable}`}
    >
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  )
}
