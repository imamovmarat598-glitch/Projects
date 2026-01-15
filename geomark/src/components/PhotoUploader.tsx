'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, MapPin, Clock, Camera, X, Check, Loader2 } from 'lucide-react'
import { extractExif, getImageDimensions } from '@/lib/exif'
import { reverseGeocode } from '@/lib/geocoding'
import { formatFileSize, formatCoordinates, generateShortId, getExpirationDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { PhotoInsert } from '@/types/database'

interface UploadedPhoto {
  file: File
  preview: string
  latitude: number | null
  longitude: number | null
  altitude: number | null
  accuracy: number | null
  takenAt: Date | null
  deviceModel: string | null
  address: string | null
  city: string | null
  country: string | null
  width: number
  height: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  shortId?: string
  error?: string
}

type AutoDelete = '1h' | '24h' | '7d' | 'never'

export default function PhotoUploader() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [autoDelete, setAutoDelete] = useState<AutoDelete>('24h')
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newPhotos: UploadedPhoto[] = []

    for (const file of acceptedFiles) {
      const preview = URL.createObjectURL(file)
      const exif = await extractExif(file)
      const dimensions = await getImageDimensions(file)

      let geocoding = { address: null, city: null, country: null }
      if (exif.latitude && exif.longitude) {
        geocoding = await reverseGeocode(exif.latitude, exif.longitude)
      }

      newPhotos.push({
        file,
        preview,
        latitude: exif.latitude,
        longitude: exif.longitude,
        altitude: exif.altitude,
        accuracy: exif.accuracy,
        takenAt: exif.takenAt,
        deviceModel: exif.deviceModel,
        address: geocoding.address,
        city: geocoding.city,
        country: geocoding.country,
        width: dimensions.width,
        height: dimensions.height,
        status: 'pending',
      })
    }

    setPhotos((prev) => [...prev, ...newPhotos])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const uploadPhotos = async () => {
    setIsUploading(true)

    for (let i = 0; i < photos.length; i++) {
      if (photos[i].status !== 'pending') continue

      setPhotos((prev) => {
        const newPhotos = [...prev]
        newPhotos[i].status = 'uploading'
        return newPhotos
      })

      try {
        const photo = photos[i]
        const shortId = generateShortId()
        const filename = `${shortId}_${Date.now()}.${photo.file.name.split('.').pop()}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filename, photo.file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        // Save to database
        const expiresAt = getExpirationDate(autoDelete)
        const photoData: PhotoInsert = {
          short_id: shortId,
          filename,
          original_filename: photo.file.name,
          file_size: photo.file.size,
          mime_type: photo.file.type,
          width: photo.width,
          height: photo.height,
          latitude: photo.latitude,
          longitude: photo.longitude,
          altitude: photo.altitude,
          accuracy: photo.accuracy,
          address: photo.address,
          city: photo.city,
          country: photo.country,
          taken_at: photo.takenAt?.toISOString() ?? null,
          device_model: photo.deviceModel,
          is_public: true,
          expires_at: expiresAt?.toISOString() ?? null,
          auto_delete: autoDelete,
        }

        const { error: dbError } = await supabase.from('photos').insert(photoData)

        if (dbError) throw dbError

        setPhotos((prev) => {
          const newPhotos = [...prev]
          newPhotos[i].status = 'success'
          newPhotos[i].shortId = shortId
          return newPhotos
        })
      } catch (error) {
        console.error('Upload error:', error)
        setPhotos((prev) => {
          const newPhotos = [...prev]
          newPhotos[i].status = 'error'
          newPhotos[i].error = error instanceof Error ? error.message : 'Upload failed'
          return newPhotos
        })
      }
    }

    setIsUploading(false)
  }

  const pendingCount = photos.filter((p) => p.status === 'pending').length
  const successCount = photos.filter((p) => p.status === 'success').length

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">
          {isDragActive ? 'Отпустите файлы здесь...' : 'Перетащите фото сюда или нажмите для выбора'}
        </p>
        <p className="text-sm text-gray-500 mt-2">JPG, PNG, HEIC до 50MB</p>
      </div>

      {/* Auto-delete options */}
      {photos.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Автоудаление фото:
          </label>
          <div className="flex gap-2">
            {(['1h', '24h', '7d', 'never'] as AutoDelete[]).map((option) => (
              <button
                key={option}
                onClick={() => setAutoDelete(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  autoDelete === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {option === '1h' && 'Через 1 час'}
                {option === '24h' && 'Через 24 часа'}
                {option === '7d' && 'Через 7 дней'}
                {option === 'never' && 'Не удалять'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Photo list */}
      {photos.length > 0 && (
        <div className="mt-6 space-y-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Preview */}
              <div className="w-24 h-24 flex-shrink-0 relative">
                <img
                  src={photo.preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {photo.status === 'pending' && (
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{photo.file.name}</h3>
                  <span className="text-sm text-gray-500">{formatFileSize(photo.file.size)}</span>
                </div>

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  {photo.latitude && photo.longitude ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-green-500" />
                      <span>{formatCoordinates(photo.latitude, photo.longitude)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-red-500">Нет GPS данных</span>
                    </div>
                  )}

                  {photo.address && (
                    <div className="text-gray-500 truncate" title={photo.address}>
                      {photo.city ? `${photo.city}, ${photo.country}` : photo.address}
                    </div>
                  )}

                  {photo.takenAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{photo.takenAt.toLocaleString('ru-RU')}</span>
                    </div>
                  )}

                  {photo.deviceModel && (
                    <div className="flex items-center gap-1">
                      <Camera className="w-4 h-4" />
                      <span>{photo.deviceModel}</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                {photo.status === 'success' && photo.shortId && (
                  <div className="mt-2 flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <a
                      href={`/p/${photo.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {window.location.origin}/p/{photo.shortId}
                    </a>
                  </div>
                )}

                {photo.status === 'error' && (
                  <div className="mt-2 text-red-600 text-sm">{photo.error}</div>
                )}
              </div>

              {/* Status indicator */}
              <div className="flex-shrink-0 flex items-center">
                {photo.status === 'uploading' && (
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                )}
                {photo.status === 'success' && (
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                )}
                {photo.status === 'error' && (
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {pendingCount > 0 && (
        <div className="mt-6">
          <button
            onClick={uploadPhotos}
            disabled={isUploading}
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Загрузить {pendingCount} {pendingCount === 1 ? 'фото' : 'фото'}
              </>
            )}
          </button>
        </div>
      )}

      {/* Success summary */}
      {successCount > 0 && pendingCount === 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Успешно загружено {successCount} {successCount === 1 ? 'фото' : 'фото'}
          </p>
        </div>
      )}
    </div>
  )
}
