'use client'

import { useSyncExternalStore, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
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

// Use useSyncExternalStore to detect client-side mounting
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export default function PhotoMap({
  photos,
  center = [55.7558, 37.6173], // Moscow default
  zoom = 10,
  onPhotoClick,
}: PhotoMapProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

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
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Спутник (Google)">
          <TileLayer
            attribution='&copy; Google'
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Роскосмос (Геопортал)">
          <TileLayer
            attribution='&copy; <a href="https://gptl.ru" target="_blank">Геопортал Роскосмоса</a>'
            url="https://gptl.ru/tile/{z}/{x}/{y}"
            maxZoom={18}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

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

              <div className="mt-2 pt-2 border-t border-gray-200 flex gap-2">
                <a
                  href={`https://gptl.ru/?lat=${photo.latitude}&lon=${photo.longitude}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 text-center"
                >
                  🛰️ Геопортал
                </a>
                <a
                  href={`https://dgearth.ru/?lat=${photo.latitude}&lon=${photo.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 text-center"
                >
                  🌍 Цифровая Земля
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
