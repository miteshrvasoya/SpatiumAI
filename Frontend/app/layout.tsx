import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space-grotesk' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'SpatiumAI - Design Intelligence for Architecture Professionals',
  description: 'AI-powered architectural validation engine evaluating designs against building codes, vastu principles, and spatial logic in real time.',
  generator: 'v0.app',
  openGraph: {
    title: 'SpatiumAI - Design Intelligence for Architecture Professionals',
    description: 'AI-powered architectural validation engine evaluating designs against building codes, vastu principles, and spatial logic in real time.',
    url: 'https://spatiumai.com',
    siteName: 'SpatiumAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SpatiumAI Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpatiumAI - Design Intelligence for Architecture Professionals',
    description: 'AI-powered architectural validation engine evaluating designs against building codes, vastu principles, and spatial logic in real time.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-bg-base`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
