import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import type React from 'react'

import { QueryProvider } from '@/components/providers/query-provider'

import './globals.css'

// Mona Sans (GitHub) as the global sans font — variable weight 200–900.
const monaSans = localFont({
  src: './fonts/MonaSans.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '200 900',
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  weight: ['400'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Signalor - Effortless Custom Contract Billing',
  description:
    'Streamline your billing process with seamless automation for every custom contract, tailored by Signalor.',
  generator: 'v0.app',
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={`${monaSans.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
