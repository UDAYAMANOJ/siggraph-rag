import { ReactNode } from 'react'
import { sectionStyles, containerStyles } from '@/config/design'
import { cn } from '@/shared/utils'

interface SectionProps {
  children: ReactNode
  variant?: keyof typeof sectionStyles
  container?: keyof typeof containerStyles
  className?: string
  fullHeight?: boolean
}

export function Section({
  children,
  variant = 'white',
  container = 'default',
  className,
  fullHeight = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        sectionStyles[variant],
        fullHeight ? 'min-h-screen py-32' : 'py-20',
        className
      )}
    >
      <div className={containerStyles[container]}>
        {children}
      </div>
    </section>
  )
}

