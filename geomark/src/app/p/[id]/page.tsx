import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MapPin, Clock, Camera, Download, Share2, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatCoordinates, formatFileSize } from '@/lib/utils'
import PublicPhotoMap from './PublicPhotoMap'

interface Props {
  params: Promise<{ id: string }>
}

async function getPhoto(shortId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('short_id', shortId)
    .eq('is_public', true)
    .single()

  if (error || !data) {
    return null
  }

  // Check if expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Increment view count
  await supabase
    .from('photos')
    .update({ view_count: data.view_count + 1 })
    .eq('id', data.id)

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const photo = await getPhoto(id)

  if (!photo) {
    return {
      title: 'Фото не найдено - GeoMark',
    }
  }

  const title = photo.city
    ? `Фото из ${photo.city} - GeoMark`
    : 'Фото с GPS - GeoMark'

  const description = photo.address || 'Фото с GPS-координатами на карте'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.filename}`,
          width: photo.width || 1200,
          height: photo.height || 630,
        },
      ],
    },
  }
}

export default async function PublicPhotoPage({ params }: Props) {
  const { id } = await params
  const photo = await getPhoto(id)

  if (!photo) {
    notFound()
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.filename}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Photo */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <img
              src={imageUrl}
              alt={photo.original_filename}
              className="w-full h-auto max-h-[70vh] object-contain bg-gray-900"
            />
          </div>

          {/* Info & Map */}
          <div className="space-y-6">
            {/* Photo info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-4">
                {photo.original_filename}
              </h1>

              <div className="space-y-4">
                {/* GPS */}
                {photo.latitude && photo.longitude && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Координаты
                    </h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-500" />
                      <span className="text-gray-900">
                        {formatCoordinates(photo.latitude, photo.longitude)}
                      </span>
                    </div>
                    {photo.accuracy && (
                      <p className="text-sm text-gray-500 mt-1 ml-7">
                        Точность: ±{photo.accuracy.toFixed(0)}м
                      </p>
                    )}
                  </div>
                )}

                {/* Address */}
                {photo.address && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Адрес
                    </h3>
                    <p className="text-gray-900">{photo.address}</p>
                  </div>
                )}

                {/* Date */}
                {photo.taken_at && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Дата съёмки
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(photo.taken_at)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Device */}
                {photo.device_model && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Устройство
                    </h3>
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{photo.device_model}</span>
                    </div>
                  </div>
                )}

                {/* File info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Размер: {formatFileSize(photo.file_size)}</span>
                    {photo.width && photo.height && (
                      <span>
                        {photo.width}×{photo.height}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <Eye className="w-4 h-4" />
                    <span>{photo.view_count + 1} просмотров</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <a
                    href={imageUrl}
                    download={photo.original_filename}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Скачать
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Копировать ссылку
                  </button>
                </div>
              </div>
            </div>

            {/* Map */}
            {photo.latitude && photo.longitude && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <PublicPhotoMap
                  latitude={photo.latitude}
                  longitude={photo.longitude}
                />
              </div>
            )}

            {/* Expiration notice */}
            {photo.expires_at && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                Это фото будет автоматически удалено{' '}
                {formatDate(photo.expires_at)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
