'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Upload, Image, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const pathname = usePathname()

  const navigation = [
    { href: '/upload', label: 'Загрузить', icon: Upload },
    { href: '/gallery', label: 'Галерея', icon: Image },
    { href: '/map', label: 'Карта', icon: Map },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GeoMark</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
