'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, Map, FileJson, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Photo } from '@/types/database'

export default function ExportPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState<string | null>(null)
  const [exported, setExported] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('is_public', true)
        .not('latitude', 'is', null)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching photos:', error)
      } else {
        setPhotos((data as Photo[]) || [])
      }
      setLoading(false)
    }

    fetchPhotos()
  }, [])

  const exportCSV = () => {
    setExporting('csv')
    const headers = ['id', 'filename', 'latitude', 'longitude', 'altitude', 'address', 'city', 'country', 'taken_at', 'created_at']
    const csvContent = [
      headers.join(','),
      ...photos.map(p => [
        p.id,
        `"${p.original_filename}"`,
        p.latitude,
        p.longitude,
        p.altitude || '',
        `"${p.address || ''}"`,
        `"${p.city || ''}"`,
        `"${p.country || ''}"`,
        p.taken_at || '',
        p.created_at
      ].join(','))
    ].join('\n')

    downloadFile(csvContent, 'geomark-photos.csv', 'text/csv')
    setExporting(null)
    setExported('csv')
    setTimeout(() => setExported(null), 3000)
  }

  const exportKML = () => {
    setExporting('kml')
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoMark Photos</name>
    <description>Exported from GeoMark</description>
    ${photos.map(p => `
    <Placemark>
      <name>${escapeXml(p.original_filename)}</name>
      <description>${escapeXml(p.address || '')}</description>
      <Point>
        <coordinates>${p.longitude},${p.latitude},${p.altitude || 0}</coordinates>
      </Point>
      <TimeStamp>
        <when>${p.taken_at || p.created_at}</when>
      </TimeStamp>
    </Placemark>`).join('')}
  </Document>
</kml>`

    downloadFile(kmlContent, 'geomark-photos.kml', 'application/vnd.google-earth.kml+xml')
    setExporting(null)
    setExported('kml')
    setTimeout(() => setExported(null), 3000)
  }

  const exportGPX = () => {
    setExporting('gpx')
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GeoMark" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>GeoMark Photos</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  ${photos.map(p => `
  <wpt lat="${p.latitude}" lon="${p.longitude}">
    <ele>${p.altitude || 0}</ele>
    <time>${p.taken_at || p.created_at}</time>
    <name>${escapeXml(p.original_filename)}</name>
    <desc>${escapeXml(p.address || '')}</desc>
  </wpt>`).join('')}
</gpx>`

    downloadFile(gpxContent, 'geomark-photos.gpx', 'application/gpx+xml')
    setExporting(null)
    setExported('gpx')
    setTimeout(() => setExported(null), 3000)
  }

  const exportJSON = () => {
    setExporting('json')
    const jsonContent = JSON.stringify(photos.map(p => ({
      id: p.id,
      short_id: p.short_id,
      filename: p.original_filename,
      coordinates: {
        latitude: p.latitude,
        longitude: p.longitude,
        altitude: p.altitude
      },
      location: {
        address: p.address,
        city: p.city,
        country: p.country
      },
      taken_at: p.taken_at,
      created_at: p.created_at,
      url: `${window.location.origin}/p/${p.short_id}`
    })), null, 2)

    downloadFile(jsonContent, 'geomark-photos.json', 'application/json')
    setExporting(null)
    setExported('json')
    setTimeout(() => setExported(null), 3000)
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const photosWithGPS = photos.filter(p => p.latitude && p.longitude)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Экспорт данных
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Скачайте ваши геоданные
          </h1>
          <p className="text-xl text-gray-600">
            {loading ? (
              'Загрузка...'
            ) : photosWithGPS.length > 0 ? (
              `${photosWithGPS.length} фото с GPS-координатами готовы к экспорту`
            ) : (
              'Нет фото с GPS-координатами для экспорта'
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : photosWithGPS.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Download className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Загрузите фото с GPS-координатами для экспорта</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <ExportCard
              icon={FileText}
              title="CSV"
              description="Табличный формат для Excel, Google Sheets"
              format="csv"
              onClick={exportCSV}
              loading={exporting === 'csv'}
              success={exported === 'csv'}
            />
            <ExportCard
              icon={Map}
              title="KML"
              description="Для Google Earth и Google Maps"
              format="kml"
              onClick={exportKML}
              loading={exporting === 'kml'}
              success={exported === 'kml'}
            />
            <ExportCard
              icon={Map}
              title="GPX"
              description="Универсальный GPS формат для навигаторов"
              format="gpx"
              onClick={exportGPX}
              loading={exporting === 'gpx'}
              success={exported === 'gpx'}
            />
            <ExportCard
              icon={FileJson}
              title="JSON"
              description="Для разработчиков и API интеграций"
              format="json"
              onClick={exportJSON}
              loading={exporting === 'json'}
              success={exported === 'json'}
            />
          </div>
        )}

        {/* Info */}
        <div className="mt-12 p-6 bg-indigo-50 rounded-2xl">
          <h3 className="font-bold text-indigo-900 mb-2">Что включено в экспорт?</h3>
          <ul className="text-indigo-700 space-y-1 text-sm">
            <li>• GPS-координаты (широта, долгота, высота)</li>
            <li>• Адрес и город (если определены)</li>
            <li>• Дата и время съёмки</li>
            <li>• Ссылки на фотографии</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function ExportCard({
  icon: Icon,
  title,
  description,
  format,
  onClick,
  loading,
  success
}: {
  icon: typeof Download
  title: string
  description: string
  format: string
  onClick: () => void
  loading: boolean
  success: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left disabled:opacity-50"
    >
      <div className="flex items-start justify-between">
        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-indigo-200 group-hover:to-purple-200 transition-colors">
          <Icon className="w-7 h-7 text-indigo-600" />
        </div>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        ) : success ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Download className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-3 text-xs text-indigo-600 font-medium uppercase tracking-wide">
        .{format}
      </div>
    </button>
  )
}
