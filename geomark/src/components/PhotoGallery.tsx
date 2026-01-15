'use client'

import { useState } from 'react'
import { MapPin, Clock, Eye, ExternalLink } from 'lucide-react'
import type { Photo } from '@/types/database'
import { formatDate, formatCoordinates, formatFileSize } from '@/lib/utils'

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Нет загруженных фото</p>
      </div>
    )
  }

  return (
    <>
      {/* Gallery grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.filename}`}
              alt={photo.original_filename}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium truncate">{photo.original_filename}</p>
                {photo.latitude && photo.longitude && (
                  <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {photo.city || formatCoordinates(photo.latitude, photo.longitude)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* GPS indicator */}
            <div className="absolute top-2 right-2">
              {photo.latitude && photo.longitude ? (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center shadow">
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-2/3 bg-gray-900 flex items-center justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${selectedPhoto.filename}`}
                  alt={selectedPhoto.original_filename}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              {/* Info */}
              <div className="md:w-1/3 p-6 overflow-y-auto max-h-[60vh]">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedPhoto.original_filename}
                </h2>

                <div className="space-y-4">
                  {/* GPS */}
                  {selectedPhoto.latitude && selectedPhoto.longitude && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Координаты</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span className="text-sm">
                          {formatCoordinates(selectedPhoto.latitude, selectedPhoto.longitude)}
                        </span>
                      </div>
                      {selectedPhoto.accuracy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Точность: ±{selectedPhoto.accuracy.toFixed(0)}м
                        </p>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  {selectedPhoto.address && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Адрес</h3>
                      <p className="text-sm text-gray-700">{selectedPhoto.address}</p>
                    </div>
                  )}

                  {/* Date */}
                  {selectedPhoto.taken_at && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Дата съёмки</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{formatDate(selectedPhoto.taken_at)}</span>
                      </div>
                    </div>
                  )}

                  {/* File info */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Информация</h3>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Размер: {formatFileSize(selectedPhoto.file_size)}</p>
                      {selectedPhoto.width && selectedPhoto.height && (
                        <p>
                          Разрешение: {selectedPhoto.width}×{selectedPhoto.height}
                        </p>
                      )}
                      {selectedPhoto.device_model && <p>Устройство: {selectedPhoto.device_model}</p>}
                    </div>
                  </div>

                  {/* Views */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{selectedPhoto.view_count} просмотров</span>
                  </div>

                  {/* Public link */}
                  <div className="pt-4 border-t">
                    <a
                      href={`/p/${selectedPhoto.short_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Открыть публичную ссылку</span>
                    </a>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="mt-6 w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
