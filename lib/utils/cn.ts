/**
 * cn — className utility
 * Combines clsx with a simple truthy filter.
 * Usage: cn('base', isActive && 'active', variant === 'x' && 'x-class')
 */
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
