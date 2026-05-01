/**
 * Design System Configuration
 * Centralized design tokens for colors, typography, spacing, etc.
 */

export const brandColors = {
  primary: {
    DEFAULT: '#0096C7',
    dark: '#0077A3',
    light: '#48CAE4',
  },
  secondary: {
    DEFAULT: '#1689A8',
    dark: '#116a82',
    light: '#48CAE4',
  },
  accent: {
    teal: '#6BABA6',
    dark: '#1A1A1A',
  },
  yellow: {
    soft: '#FDB44B',
    DEFAULT: '#FBBF24',
  },
  orange: {
    warm: '#FB923C',
    vibrant: '#FF6B35',
    DEFAULT: '#F97316',
  },
  blue: {
    deep: '#3B82F6',
    medium: '#2563EB',
    rich: '#1E40AF',
    DEFAULT: '#3B82F6',
  },
} as const

export const primaryGradient = {
  css: 'radial-gradient(circle at 0% 0%, #FDB44B 0%, #FB923C 15%, #FF6B35 28%, #F97316 38%, #3B82F6 55%, #2563EB 70%, #1E40AF 85%)',
  tailwind: 'bg-gradient-radial from-[#FDB44B] via-[#FB923C] via-[#FF6B35] via-[#F97316] via-[#3B82F6] via-[#2563EB] to-[#1E40AF]',
} as const

export const cardStyles = {
  base: {
    className: 'rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all',
    hover: 'hover:border-slate-300 hover:shadow-md',
  },
  light: {
    className: 'rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8 transition-all',
    hover: 'hover:border-slate-300 hover:shadow-sm',
  },
  glass: {
    className: 'rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 md:p-8 transition-all',
    hover: 'hover:bg-white/20',
  },
  feature: {
    className: 'flex flex-col items-center space-y-3 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all',
    hover: 'hover:shadow-md hover:border-slate-300',
  },
  listItem: {
    className: 'flex items-start gap-4 md:gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 transition-all',
    hover: 'hover:border-slate-300 hover:shadow-sm',
  },
} as const

export const buttonStyles = {
  primary: {
    className: 'rounded-full bg-slate-900 text-white px-8 py-4 font-medium shadow-lg transition-all',
    hover: 'hover:bg-slate-800 hover:shadow-xl',
  },
  secondary: {
    className: 'rounded-full bg-white text-slate-900 px-8 py-4 font-medium shadow-lg transition-all',
    hover: 'hover:bg-slate-50 hover:shadow-xl',
  },
  outline: {
    className: 'rounded-full border-2 border-slate-900 text-slate-900 px-8 py-4 font-medium transition-all',
    hover: 'hover:bg-slate-900 hover:text-white',
  },
  text: {
    className: 'bg-transparent text-slate-900 font-medium transition-all',
    hover: 'hover:underline',
  },
  ghost: {
    className: 'rounded-full bg-transparent text-slate-700 px-8 py-4 font-medium transition-all',
    hover: 'hover:bg-slate-100/50',
  },
  danger: {
    className: 'rounded-full bg-red-600 text-white px-8 py-4 font-medium shadow-lg transition-all',
    hover: 'hover:bg-red-700 hover:shadow-xl',
  },
} as const

export const sectionStyles = {
  light: 'bg-slate-50',
  white: 'bg-white',
  dark: 'bg-slate-900',
  gradient: 'bg-gradient-primary',
} as const

export const containerStyles = {
  default: 'container mx-auto px-6',
  narrow: 'mx-auto max-w-4xl',
  wide: 'mx-auto max-w-5xl',
  full: 'mx-auto max-w-7xl',
} as const

export const neutralColors = {
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const

export const semanticColors = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const



export const typography = {
  cssVariables: {
    heading: 'var(--font-primary-heading)',
    body: 'var(--font-primary-body)',
  },
  tailwindClasses: {
    heading: 'font-heading',
    body: 'font-body',
  },
  fontFamily: {
    heading: 'Pixelify Sans',
    body: 'IBM Plex Mono',
  },
} as const

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  none: 'none',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const

export const colors = {
  primary: {
    text: 'text-[#0077A3]',
    bg: 'bg-[#0077A3]',
    border: 'border-[#0077A3]',
    hover: {
      text: 'hover:text-[#0077A3]',
      bg: 'hover:bg-[#0077A3]',
      border: 'hover:border-[#0077A3]',
    },
    focus: {
      border: 'focus:border-[#0077A3]',
      ring: 'focus:ring-1 focus:ring-[#0077A3]',
    },
  },
  secondary: {
    text: 'text-[#1689A8]',
    bg: 'bg-[#1689A8]',
    border: 'border-[#1689A8]',
    hover: {
      text: 'hover:text-[#1689A8]',
      bg: 'hover:bg-[#116a82]',
      border: 'hover:border-[#1689A8]',
    },
  },
} as const

export const getColor = {
  primary: brandColors.primary.dark,
  secondary: brandColors.secondary.DEFAULT,
  secondaryDark: brandColors.secondary.dark,
  accentTeal: brandColors.accent.teal,
  accentDark: brandColors.accent.dark,
} as const

