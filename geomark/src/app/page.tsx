import Link from 'next/link'
import { MapPin, Upload, Share2, Shield, Clock, Map } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Фото с GPS-координатами
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Загружайте фотографии, автоматически получайте координаты из EXIF,
              смотрите на карте и делитесь короткими ссылками
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Загрузить фото
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors border border-blue-500"
              >
                <Map className="w-5 h-5" />
                Смотреть галерею
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Возможности
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="GPS из EXIF"
              description="Автоматическое извлечение GPS-координат из метаданных фотографии"
            />
            <FeatureCard
              icon={Share2}
              title="Короткие ссылки"
              description="Делитесь фото через компактные ссылки с интерактивной картой"
            />
            <FeatureCard
              icon={Shield}
              title="Без регистрации"
              description="Полностью анонимное использование, никаких аккаунтов"
            />
            <FeatureCard
              icon={Clock}
              title="Автоудаление"
              description="Выберите срок хранения: 1 час, 24 часа, 7 дней или навсегда"
            />
            <FeatureCard
              icon={Map}
              title="Интерактивная карта"
              description="Все ваши фото на одной карте с кластеризацией"
            />
            <FeatureCard
              icon={Upload}
              title="Drag & Drop"
              description="Просто перетащите фото в браузер для загрузки"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Как это работает
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number={1}
              title="Загрузите фото"
              description="Перетащите фото с GPS-данными или выберите файлы"
            />
            <StepCard
              number={2}
              title="Получите координаты"
              description="Система автоматически извлечёт GPS из EXIF-метаданных"
            />
            <StepCard
              number={3}
              title="Поделитесь ссылкой"
              description="Получите короткую ссылку для просмотра фото на карте"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы начать?
          </h2>
          <p className="text-blue-100 mb-8">
            Загрузите первое фото прямо сейчас — это бесплатно и без регистрации
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Загрузить фото
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">GeoMark</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} GeoMark. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
