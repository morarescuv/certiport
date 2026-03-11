import type { Metadata } from 'next'
import { Onest } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const onest = Onest({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-onest"
});

export const metadata: Metadata = {
  title: 'CertPrep - Master Your Certiport Exams',
  description: 'Gamified learning platform to help you pass Certiport certification exams with practice tests, XP rewards, and community support.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${onest.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
