'use client'

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(
  () => import('./MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Загрузка карты...</span>
      </div>
    )
  }
)

interface Props {
  latitude: number
  longitude: number
}

export default function PublicPhotoMap({ latitude, longitude }: Props) {
  return <MapWithNoSSR latitude={latitude} longitude={longitude} />
}
