import { clsx } from 'clsx'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export default function Badge({ children, className = '' }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-2xl px-3 py-1 text-xs bg-gray-100 text-gray-700',
      className
    )}>
      {children}
    </span>
  )
}
