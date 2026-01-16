# GeoMark - Полная документация проекта

## Обзор

GeoMark - это комплексная платформа для создания и управления фотографиями с GPS-координатами. Проект включает:

1. **Веб-приложение** (Next.js 15 + Supabase) - https://geomark.ru
2. **Мобильное приложение** (React Native / Expo) - для Android и iOS

## Архитектура проекта

```
Projects/
├── geomark/           # Веб-приложение (Next.js)
├── GeoMarkApp/        # Мобильное приложение (Expo)
└── docs/              # Документация
```

---

# Часть 1: Веб-приложение

## Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 15 | Фреймворк React |
| TypeScript | 5.x | Типизация |
| Supabase | - | Backend (БД + Auth + Storage) |
| Tailwind CSS | 3.x | Стилизация |
| Vercel | - | Хостинг |

## Структура веб-приложения

```
geomark/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Главная страница
│   │   ├── layout.tsx         # Корневой layout
│   │   ├── globals.css        # Глобальные стили
│   │   ├── auth/              # Страницы авторизации
│   │   ├── dashboard/         # Личный кабинет
│   │   └── export/            # Экспорт данных
│   ├── components/            # React компоненты
│   └── lib/
│       └── supabase/          # Конфигурация Supabase
├── supabase/
│   └── migrations/            # SQL миграции
├── vercel.json               # Конфигурация Vercel
└── .env.local                # Переменные окружения
```

## Настройка Supabase

### Переменные окружения (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Для Telegram уведомлений
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### Таблицы базы данных

1. **profiles** - профили пользователей
2. **photos** - метаданные фотографий
3. **locations** - GPS координаты

### Row Level Security (RLS)

Все таблицы защищены политиками RLS:
- Пользователи видят только свои данные
- Анонимный доступ только для чтения публичных данных

## Деплой на Vercel

### Шаг 1: Подключение репозитория

1. Зайдите на vercel.com
2. Import Project → GitHub
3. Выберите репозиторий
4. **Root Directory**: `geomark`

### Шаг 2: Переменные окружения

Добавьте в Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

### Шаг 3: Настройка домена (Cloudflare)

1. В Vercel: Settings → Domains → Add `geomark.ru`
2. В Cloudflare DNS:
   - Type: CNAME
   - Name: @ (или www)
   - Target: cname.vercel-dns.com
   - Proxy: OFF (DNS only)

---

# Часть 2: Мобильное приложение

## Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| Expo | SDK 52 | Платформа React Native |
| React Native | 0.76 | Мобильный фреймворк |
| TypeScript | 5.x | Типизация |
| expo-camera | 16.x | Работа с камерой |
| expo-location | 18.x | GPS |
| expo-sqlite | 15.x | Локальная БД |
| react-native-maps | 1.x | Карты |

## Структура мобильного приложения

```
GeoMarkApp/
├── App.tsx                    # Точка входа
├── app.json                  # Конфигурация Expo
├── src/
│   ├── screens/
│   │   ├── CameraScreen.tsx  # Камера с GPS
│   │   ├── GalleryScreen.tsx # Галерея фото
│   │   ├── MapScreen.tsx     # Карта
│   │   └── SettingsScreen.tsx # Настройки
│   ├── hooks/
│   │   ├── useCamera.ts      # Логика камеры
│   │   └── useLocation.ts    # Логика GPS
│   ├── services/
│   │   └── PhotoStorage.ts   # SQLite хранилище
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Tab навигация
│   ├── theme/
│   │   └── colors.ts         # Цвета
│   └── types/
│       └── photo.ts          # TypeScript типы
```

## Экраны приложения

### 1. CameraScreen
- Предпросмотр камеры
- Индикатор GPS (цветной - точность)
- Кнопка съемки
- Отображение координат

### 2. GalleryScreen
- Сетка фотографий
- Дата и координаты каждого фото
- Pull-to-refresh

### 3. MapScreen
- Интерактивная карта (Google Maps / Apple Maps)
- Маркеры для каждого фото
- Popup с превью фото

### 4. SettingsScreen
- Статистика (количество фото)
- Настройки GPS (высокая точность)
- Экспорт в CSV/JSON/KML/GPX
- Удаление всех данных

## Запуск на телефоне

### Вариант A: Expo Go (рекомендуется для тестирования)

```bash
# 1. Установите Expo Go на телефон
# Android: Google Play Store
# iOS: App Store

# 2. Запустите проект
cd GeoMarkApp
npx expo start

# 3. Отсканируйте QR-код
# Android: через Expo Go
# iOS: через стандартную камеру
```

### Вариант B: Development Build

```bash
# 1. Установите EAS CLI
npm install -g eas-cli

# 2. Авторизуйтесь
eas login

# 3. Создайте development build
eas build --profile development --platform android
# или
eas build --profile development --platform ios

# 4. Установите build на телефон

# 5. Запустите с dev-client
npx expo start --dev-client
```

### Вариант C: Standalone APK (Android)

```bash
# Создайте eas.json если его нет
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}

# Соберите APK
eas build --platform android --profile preview

# Скачайте APK и установите на телефон
```

---

# Часть 3: Форматы экспорта

## CSV
```csv
id,latitude,longitude,altitude,timestamp,note,address
abc123,55.7558,37.6173,150,2024-01-15T10:30:00Z,"Заметка","Москва"
```

## JSON
```json
[
  {
    "id": "abc123",
    "uri": "file://...",
    "coordinates": {
      "latitude": 55.7558,
      "longitude": 37.6173,
      "altitude": 150
    },
    "timestamp": 1705312200000
  }
]
```

## KML (Google Earth)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoMark Photos</name>
    <Placemark>
      <name>Photo abc123</name>
      <Point>
        <coordinates>37.6173,55.7558,150</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>
```

## GPX (GPS навигаторы)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GeoMark">
  <wpt lat="55.7558" lon="37.6173">
    <ele>150</ele>
    <time>2024-01-15T10:30:00Z</time>
    <name>Photo abc123</name>
  </wpt>
</gpx>
```

---

# Часть 4: Troubleshooting

## Веб-приложение

### Ошибка подключения к Supabase
```
Проверьте:
1. NEXT_PUBLIC_SUPABASE_URL корректный
2. NEXT_PUBLIC_SUPABASE_ANON_KEY правильный
3. RLS политики настроены
```

### Vercel deploy failed
```
1. Проверьте Root Directory = geomark
2. Убедитесь что .env.local не в git
3. Добавьте переменные в Vercel Dashboard
```

## Мобильное приложение

### GPS не работает
```
1. Проверьте разрешения в настройках телефона
2. Включите GPS/Location Services
3. Выйдите на улицу (GPS плохо работает в помещении)
```

### Камера не открывается
```
1. Дайте разрешение на камеру
2. Перезапустите приложение
3. Проверьте что другие приложения не используют камеру
```

### expo-file-system ошибки
```
Новый API (SDK 52+):
- Используйте: import { Paths, File, Directory } from 'expo-file-system'
- НЕ используйте: FileSystem.documentDirectory (устарело)
```

---

# Контакты и ссылки

- **Веб-сайт**: https://geomark.ru
- **GitHub**: [ссылка на репозиторий]
- **Expo**: https://expo.dev

## Версии

- Веб-приложение: 1.0.0
- Мобильное приложение: 1.0.0
- Дата документации: Январь 2026
