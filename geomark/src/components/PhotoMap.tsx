'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Photo } from '@/types/database'
import { formatDate, formatCoordinates } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

interface PhotoMapProps {
  photos: Photo[]
  center?: [number, number]
  zoom?: number
  onPhotoClick?: (photo: Photo) => void
}

export default function PhotoMap({
  photos,
  center = [55.7558, 37.6173], // Moscow default
  zoom = 10,
  onPhotoClick,
}: PhotoMapProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Загрузка карты...</span>
      </div>
    )
  }

  // Filter photos with valid coordinates
  const photosWithCoords = photos.filter((p) => p.latitude && p.longitude)

  // Calculate bounds if we have photos
  const bounds =
    photosWithCoords.length > 0
      ? L.latLngBounds(photosWithCoords.map((p) => [p.latitude!, p.longitude!]))
      : null

  return (
    <MapContainer
      center={bounds ? bounds.getCenter() : center}
      zoom={bounds ? undefined : zoom}
      bounds={bounds || undefined}
      className="w-full h-[500px] rounded-lg shadow-md"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {photosWithCoords.map((photo) => (
        <Marker
          key={photo.id}
          position={[photo.latitude!, photo.longitude!]}
          eventHandlers={{
            click: () => onPhotoClick?.(photo),
          }}
        >
          <Popup>
            <div className="max-w-xs">
              <a href={`/p/${photo.short_id}`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.filename}`}
                  alt={photo.original_filename}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              </a>
              <p className="text-sm font-medium truncate">{photo.original_filename}</p>
              <p className="text-xs text-gray-500">
                {formatCoordinates(photo.latitude!, photo.longitude!)}
              </p>
              {photo.address && (
                <p className="text-xs text-gray-600 truncate mt-1">{photo.address}</p>
              )}
              {photo.taken_at && (
                <p className="text-xs text-gray-500 mt-1">{formatDate(photo.taken_at)}</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
