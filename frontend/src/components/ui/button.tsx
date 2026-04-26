'use client'

import * as React from 'react'
import { ReactNode } from 'react'
import { cn } from '@/shared/utils'
import { buttonStyles } from '@/config/design'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost' | 'danger'
  gradient?: 'none' | 'light' | 'dark' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      gradient = 'none',
      size = 'md',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyle = buttonStyles[variant]

    const sizes = {
      sm: 'px-4 py-1.5 text-xs md:text-sm',
      md: 'px-6 py-2.5 text-sm md:text-base',
      lg: 'px-8 py-4 text-base md:text-lg',
    }

    const sizeClass = variant === 'text' ? '' : sizes[size]

    let finalStyles = `${variantStyle.className} ${variantStyle.hover}`

    if (gradient !== 'none') {
      if (gradient === 'text') {
        finalStyles =
          'bg-gradient-primary [-webkit-background-clip:text] [background-clip:text] [-webkit-text-fill-color:transparent] hover:opacity-80 font-medium'
      } else if (gradient === 'light') {
        if (variant === 'outline') {
          return (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                baseStyles,
                'rounded-full font-medium text-slate-900 shadow-lg transition-all hover:opacity-90 hover:shadow-xl',
                sizeClass,
                className
              )}
              style={{
                background:
                  'linear-gradient(white, white) padding-box, radial-gradient(circle at 0% 0%, #FDB44B 0%, #FB923C 15%, #FF6B35 28%, #F97316 38%, #3B82F6 55%, #2563EB 70%, #1E40AF 85%) border-box',
                border: '3px solid transparent',
                borderRadius: '9999px',
              }}
              ref={ref}
              {...props}
            >
              {children}
            </motion.button>
          )
        } else {
          finalStyles =
            'rounded-full bg-gradient-primary text-white shadow-lg hover:opacity-90 hover:shadow-xl'
        }
      } else if (gradient === 'dark') {
        finalStyles =
          'rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg hover:from-slate-900 hover:to-black hover:shadow-xl'
      }
    }

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, finalStyles, sizeClass, className)}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'

export { Button }

