'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import type { Photo } from '@/types/database'

// Dynamic import to avoid SSR issues with Leaflet
const PhotoMap = dynamic(() => import('@/components/PhotoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-200px)] bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Загрузка карты...</span>
    </div>
  ),
})

export default function MapPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .order('created_at', { ascending: false })
        .limit(500)

      if (error) {
        console.error('Error fetching photos:', error)
      } else {
        setPhotos((data as Photo[]) || [])
      }
      setLoading(false)
    }

    fetchPhotos()
  }, [])

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Карта</h1>
          <p className="mt-2 text-gray-600">
            {loading
              ? 'Загрузка...'
              : photos.length > 0
              ? `${photos.length} фото на карте`
              : 'Нет фото с GPS-координатами'}
          </p>
        </div>

        <PhotoMap photos={photos} />
      </div>
    </div>
  )
}
