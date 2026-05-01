import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/config/site'
import { fontVariables } from '@/shared/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-body antialiased bg-gray-100 bg-[url('/light-grey-dots-background_78370-2583.avif')] bg-repeat">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}

