import Link from 'next/link'
import {
  MapPin, Upload, Share2, Shield, Clock, Map,
  Download, FileText, Globe, Zap, Camera,
  ChevronRight, Star, Users, Image as ImageIcon, Satellite
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero - Modern Gradient with Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Бесплатно и без регистрации</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Фото с{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                GPS-координатами
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              Загружайте фотографии, автоматически извлекайте координаты из EXIF,
              смотрите на интерактивной карте и делитесь короткими ссылками
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/upload"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-yellow-50 transition-all shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105"
              >
                <Upload className="w-5 h-5" />
                Загрузить фото
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/30"
              >
                <ImageIcon className="w-5 h-5" />
                Смотреть галерею
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>100% Бесплатно</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Без регистрации</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Веб-платформа</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500" />
      </section>

      {/* Features Grid - Modern Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Возможности
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Всё, что нужно для работы с геофото
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Мощные инструменты для загрузки, просмотра и обмена фотографиями с GPS-координатами
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={MapPin}
              title="Автоматический GPS"
              description="Извлечение координат из EXIF-метаданных без ручного ввода"
              color="indigo"
            />
            <FeatureCard
              icon={Share2}
              title="Короткие ссылки"
              description="Уникальные ссылки вида geomark.app/p/abc123 для каждого фото"
              color="purple"
            />
            <FeatureCard
              icon={Shield}
              title="Приватность"
              description="Без регистрации, без аккаунтов, полная анонимность"
              color="pink"
            />
            <FeatureCard
              icon={Clock}
              title="Автоудаление"
              description="Настройте срок хранения: 1 час, 24 часа, 7 дней или навсегда"
              color="orange"
            />
            <FeatureCard
              icon={Map}
              title="Интерактивная карта"
              description="Просмотр всех фото на карте с маркерами и кластеризацией"
              color="green"
            />
            <FeatureCard
              icon={Download}
              title="Экспорт данных"
              description="Скачивайте данные в форматах CSV, KML и GPX"
              color="blue"
            />
            <FeatureCard
              icon={Satellite}
              title="Спутниковые снимки"
              description="Интеграция с Геопорталом Роскосмоса и Google Earth"
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* How it Works - Timeline Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              Как это работает
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Три простых шага
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200" />

            <StepCard
              number={1}
              title="Загрузите фото"
              description="Перетащите фото в браузер или выберите файлы. Поддерживаются JPG, PNG, HEIC"
              icon={Upload}
              color="indigo"
            />
            <StepCard
              number={2}
              title="Получите данные"
              description="Система автоматически извлечёт GPS, адрес, дату и информацию об устройстве"
              icon={MapPin}
              color="purple"
            />
            <StepCard
              number={3}
              title="Поделитесь"
              description="Получите короткую ссылку или посмотрите фото на интерактивной карте"
              icon={Share2}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              Кому подходит
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Для профессионалов и путешественников
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <UseCaseCard
              icon={Camera}
              title="Фотографы"
              description="Организуйте фотографии по местам съёмки"
            />
            <UseCaseCard
              icon={Globe}
              title="Путешественники"
              description="Сохраняйте воспоминания с точными локациями"
            />
            <UseCaseCard
              icon={FileText}
              title="Инспекторы"
              description="Документируйте объекты с геопривязкой"
            />
            <UseCaseCard
              icon={Star}
              title="Блогеры"
              description="Делитесь местами с подписчиками"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Готовы начать?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Загрузите первое фото прямо сейчас — это бесплатно и без регистрации
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-yellow-50 transition-all shadow-xl"
            >
              <Upload className="w-5 h-5" />
              Загрузить фото
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl hover:bg-white/20 transition-all border border-white/30"
            >
              <Map className="w-5 h-5" />
              Открыть карту
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GeoMark</span>
            </div>

            <div className="flex gap-8">
              <Link href="/upload" className="hover:text-white transition-colors">Загрузить</Link>
              <Link href="/gallery" className="hover:text-white transition-colors">Галерея</Link>
              <Link href="/map" className="hover:text-white transition-colors">Карта</Link>
            </div>

            <p className="text-sm">
              &copy; {new Date().getFullYear()} GeoMark. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const colorClasses = {
  indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
  purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
  pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-200',
  orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
  green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
  blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: typeof MapPin
  title: string
  description: string
  color: keyof typeof colorClasses
}) {
  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${colorClasses[color]}`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
  icon: Icon,
  color,
}: {
  number: number
  title: string
  description: string
  icon: typeof MapPin
  color: keyof typeof colorClasses
}) {
  return (
    <div className="text-center relative">
      <div className={`w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br ${
        color === 'indigo' ? 'from-indigo-500 to-indigo-600' :
        color === 'purple' ? 'from-purple-500 to-purple-600' :
        'from-pink-500 to-pink-600'
      } shadow-xl`}>
        <Icon className="w-12 h-12 text-white" />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function UseCaseCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof MapPin
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-700" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
