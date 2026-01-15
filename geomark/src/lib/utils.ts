import { customAlphabet } from 'nanoid'

// Generate short ID for public links (6 characters, URL-safe)
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)

export function generateShortId(): string {
  return nanoid()
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getExpirationDate(autoDelete: '1h' | '24h' | '7d' | 'never'): Date | null {
  if (autoDelete === 'never') return null

  const now = new Date()
  switch (autoDelete) {
    case '1h':
      return new Date(now.getTime() + 60 * 60 * 1000)
    case '24h':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    case '7d':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    default:
      return null
  }
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
