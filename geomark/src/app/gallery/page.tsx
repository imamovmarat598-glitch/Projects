import { supabase } from '@/lib/supabase'
import PhotoGallery from '@/components/PhotoGallery'
import type { Photo } from '@/types/database'

export const metadata = {
  title: 'Галерея - GeoMark',
  description: 'Просмотр загруженных фотографий с GPS-координатами',
}

export const revalidate = 60 // Revalidate every 60 seconds

async function getPhotos(): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching photos:', error)
    return []
  }

  return data || []
}

export default async function GalleryPage() {
  const photos = await getPhotos()

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Галерея</h1>
          <p className="mt-2 text-gray-600">
            {photos.length > 0
              ? `${photos.length} фото с GPS-координатами`
              : 'Нет загруженных фотографий'}
          </p>
        </div>

        <PhotoGallery photos={photos} />
      </div>
    </div>
  )
}
