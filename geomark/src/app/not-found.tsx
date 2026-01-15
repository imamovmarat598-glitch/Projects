import Link from 'next/link'
import { MapPin, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Страница не найдена
        </h1>
        <p className="text-gray-600 mb-6">
          Возможно, фото было удалено или ссылка недействительна
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          На главную
        </Link>
      </div>
    </div>
  )
}
