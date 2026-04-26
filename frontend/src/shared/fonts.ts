import { Pixelify_Sans, IBM_Plex_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// Standard Google Fonts as fallback/default
// const pixelifySans = Pixelify_Sans({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-primary-heading',
//   weight: ['400', '500', '600', '700'],
// })

const mondwestBold = localFont({
  src: '../../fonts/MONDWEST-Bold.otf',
  variable: '--font-mondwest-bold',
})

const mondwestRegular = localFont({
  src: '../../fonts/MONDWEST-Regular.otf',
  variable: '--font-mondwest-regular',
})

// const ibmPlexMono = IBM_Plex_Mono({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-primary-body',
//   weight: ['300', '400', '500', '600', '700'],
// })

export const fontHeading = mondwestBold
export const fontBody = mondwestRegular
export const fontVariables = `${mondwestBold.variable} ${mondwestRegular.variable}`

