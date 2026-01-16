# GeoMark Mobile App

GPS-камера для фотографий с геолокацией. Приложение для Android и iOS на React Native (Expo).

## Возможности

- **Камера с GPS** - фотографирование с автоматической записью координат
- **Галерея** - просмотр всех фото с информацией о местоположении
- **Карта** - визуализация всех фото на интерактивной карте
- **Экспорт** - выгрузка данных в форматах CSV, JSON, KML, GPX
- **Офлайн работа** - все данные хранятся локально на устройстве

## Технологии

- **Expo SDK 52** - платформа для React Native
- **expo-camera** - работа с камерой
- **expo-location** - получение GPS координат
- **expo-sqlite** - локальная база данных
- **expo-file-system** - работа с файлами
- **react-native-maps** - интерактивные карты
- **React Navigation** - навигация между экранами

## Структура проекта

```
GeoMarkApp/
├── App.tsx                 # Главный компонент
├── app.json               # Конфигурация Expo
├── src/
│   ├── screens/
│   │   ├── CameraScreen.tsx    # Экран камеры
│   │   ├── GalleryScreen.tsx   # Галерея фото
│   │   ├── MapScreen.tsx       # Карта с маркерами
│   │   └── SettingsScreen.tsx  # Настройки и экспорт
│   ├── hooks/
│   │   ├── useCamera.ts        # Хук для камеры
│   │   └── useLocation.ts      # Хук для GPS
│   ├── services/
│   │   └── PhotoStorage.ts     # Сервис хранения
│   ├── navigation/
│   │   └── AppNavigator.tsx    # Навигация
│   ├── theme/
│   │   └── colors.ts           # Цветовая схема
│   └── types/
│       └── photo.ts            # TypeScript типы
└── assets/                # Иконки и изображения
```

## Установка и запуск

### Требования

- Node.js 18+
- npm или yarn
- Expo Go (для тестирования на телефоне)
- Android Studio или Xcode (для сборки)

### Установка зависимостей

```bash
cd GeoMarkApp
npm install
```

### Запуск в режиме разработки

```bash
npx expo start
```

После запуска появится QR-код. Отсканируйте его:
- **Android**: приложением Expo Go
- **iOS**: камерой iPhone (откроется Expo Go)

### Сборка для Android

```bash
# Установка EAS CLI
npm install -g eas-cli

# Авторизация в Expo
eas login

# Сборка APK для тестирования
eas build --platform android --profile preview

# Сборка для Google Play
eas build --platform android --profile production
```

### Сборка для iOS

```bash
# Сборка для TestFlight
eas build --platform ios --profile production

# Или запуск на симуляторе
npx expo run:ios
```

## Тестирование на телефоне

### Способ 1: Expo Go (быстрый)

1. Установите **Expo Go** из App Store или Google Play
2. Запустите `npx expo start` в терминале
3. Отсканируйте QR-код приложением Expo Go

### Способ 2: Development Build (полноценный)

```bash
# Создание development build
eas build --profile development --platform android

# Запуск
npx expo start --dev-client
```

### Способ 3: APK файл (Android)

```bash
# Сборка APK
eas build --platform android --profile preview

# Скачайте APK по ссылке и установите на телефон
```

## Разрешения

Приложение запрашивает следующие разрешения:

| Разрешение | Назначение |
|------------|------------|
| Камера | Съемка фотографий |
| Геолокация | Запись GPS координат |
| Хранилище | Сохранение фото в галерею |

## Форматы экспорта

- **CSV** - таблица с координатами для Excel
- **JSON** - структурированные данные
- **KML** - для Google Earth
- **GPX** - для GPS-навигаторов

## Лицензия

MIT License
