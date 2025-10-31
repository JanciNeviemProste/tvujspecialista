import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Najděte ověřeného specialistu | tvujspecialista.cz',
  description: 'Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body>
        {children}
      </body>
    </html>
  )
}
