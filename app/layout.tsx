import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Stability Manifesto',
  description: 'A New Discipline For A Complex World — Stability Engineering for Hyper-Complex Adaptive Systems by Ashish Warudkar',
  keywords: ['Stability Engineering', 'HCAS', 'AI Systems', 'GUDIYA', 'Manhattan Project 2.0'],
  openGraph: {
    title: 'The Stability Manifesto',
    description: 'Intelligence builds the future. Stability protects it.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}