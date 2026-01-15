import PhotoUploader from '@/components/PhotoUploader'

export const metadata = {
  title: 'Загрузить фото - GeoMark',
  description: 'Загрузите фотографии с GPS-координатами',
}

export default function UploadPage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Загрузить фото</h1>
          <p className="mt-2 text-gray-600">
            Перетащите фотографии или нажмите для выбора файлов
          </p>
        </div>

        <PhotoUploader />
      </div>
    </div>
  )
}
