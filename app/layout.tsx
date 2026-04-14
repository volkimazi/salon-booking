import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Burcu Bozkır Beauty | Randevu Al',
  description: 'Kalıcı makyaj, kaş ve kirpik laminasyon hizmetleri. Metropark AVM, Sefaköy İstanbul.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}