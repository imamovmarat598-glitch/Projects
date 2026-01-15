# API Documentation
## GPS Camera App

**Версия:** 1.0
**Дата:** 14 января 2026
**Автор:** Engineering Team

---

## Обзор

Этот документ описывает все API и интеграции, используемые в GPS Camera App. Документация включает нативные API устройств, сторонние сервисы и будущее Backend API (Phase 3).

---

## 1. Нативные API устройств

### 1.1 Camera API

#### react-native-vision-camera

**Документация:** https://react-native-vision-camera.com/

**Основные методы:**

```typescript
// Получить доступные камеры
const devices = Camera.getAvailableCameraDevices();

// Сделать фото
const photo = await camera.current.takePhoto({
  qualityPrioritization: 'quality',
  flash: 'auto',
  enableShutterSound: true,
});

// Параметры фото
interface Photo {
  path: string;              // Путь к временному файлу
  width: number;
  height: number;
  isRawPhoto: boolean;
  orientation: Orientation;
  isMirrored: boolean;
  thumbnail?: Record<string, any>;
}
```

**Разрешения:**

Android (AndroidManifest.xml):
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

iOS (Info.plist):
```xml
<key>NSCameraUsageDescription</key>
<string>Требуется для съемки фотографий с GPS координатами</string>
```

---

### 1.2 Geolocation API

#### @react-native-community/geolocation
#### react-native-geolocation-service

**Документация:**
- https://github.com/react-native-geolocation/react-native-geolocation
- https://github.com/Agontuk/react-native-geolocation-service

**Основные методы:**

```typescript
// Получить текущую позицию
Geolocation.getCurrentPosition(
  (position) => {
    const {latitude, longitude, altitude, accuracy} = position.coords;
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 10000,
  }
);

// Отслеживать позицию
const watchId = Geolocation.watchPosition(
  (position) => {
    // Обновление позиции
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    distanceFilter: 10, // минимальное расстояние в метрах для обновления
    interval: 5000,     // интервал обновления (Android)
    fastestInterval: 2000,
  }
);

// Остановить отслеживание
Geolocation.clearWatch(watchId);

// Интерфейсы
interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface GeolocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;    // 1
  POSITION_UNAVAILABLE: number; // 2
  TIMEOUT: number;              // 3
}
```

**Разрешения:**

Android:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

iOS:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Требуется для привязки GPS координат к фотографиям</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Требуется для фоновой записи GPS трека (опционально)</string>
```

---

### 1.3 File System API

#### react-native-fs

**Документация:** https://github.com/itinance/react-native-fs

**Основные методы:**

```typescript
import RNFS from 'react-native-fs';

// Пути к директориям
const DocumentDirectory = RNFS.DocumentDirectoryPath;
const CacheDirectory = RNFS.CachesDirectoryPath;

// Создать директорию
await RNFS.mkdir(`${DocumentDirectory}/photos`);

// Скопировать файл
await RNFS.copyFile(sourcePath, destinationPath);

// Переместить файл
await RNFS.moveFile(sourcePath, destinationPath);

// Прочитать директорию
const files = await RNFS.readDir(DocumentDirectory);

// Получить информацию о файле
const stat = await RNFS.stat(filePath);
console.log(stat.size); // размер в байтах

// Удалить файл
await RNFS.unlink(filePath);

// Записать файл
await RNFS.writeFile(filePath, content, 'utf8');

// Прочитать файл
const content = await RNFS.readFile(filePath, 'utf8');

// Проверить существование
const exists = await RNFS.exists(filePath);
```

**Разрешения:**

Android:
```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
                 android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

---

### 1.4 Image Processing API

#### react-native-image-resizer

**Документация:** https://github.com/bamlab/react-native-image-resizer

```typescript
import ImageResizer from '@bam.tech/react-native-image-resizer';

// Изменить размер изображения
const resizedImage = await ImageResizer.createResizedImage(
  imageUri,      // URI исходного изображения
  400,           // новая ширина
  400,           // новая высота
  'JPEG',        // формат
  80,            // качество (0-100)
  0,             // rotation (degrees)
  outputPath,    // путь для сохранения
  true,          // keep metadata
);

// Результат
interface ResizedImage {
  uri: string;
  path: string;
  name: string;
  size: number;
  width: number;
  height: number;
}
```

---

### 1.5 EXIF Metadata API

#### react-native-exif

**Документация:** https://github.com/dwicao/react-native-exif

```typescript
import RNExif from 'react-native-exif';

// Прочитать EXIF данные
const exif = await RNExif.getExif(imageUri);

// Записать EXIF данные
await RNExif.saveAttributes(imageUri, {
  GPSLatitude: 55.7558,
  GPSLongitude: 37.6173,
  GPSAltitude: 150,
  GPSTimeStamp: new Date().toISOString(),
  DateTime: new Date().toISOString(),
  Make: 'GPS Camera App',
  Model: 'v1.0.0',
});

// Доступные EXIF теги
interface ExifData {
  GPSLatitude?: number;
  GPSLongitude?: number;
  GPSAltitude?: number;
  GPSTimeStamp?: string;
  DateTime?: string;
  DateTimeOriginal?: string;
  Make?: string;
  Model?: string;
  Orientation?: number;
  ImageWidth?: number;
  ImageHeight?: number;
  [key: string]: any;
}
```

---

## 2. Maps API

### 2.1 react-native-maps

**Документация:** https://github.com/react-native-maps/react-native-maps

**Основные компоненты:**

```typescript
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// MapView
<MapView
  provider={PROVIDER_GOOGLE}
  style={styles.map}
  initialRegion={{
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
  mapType="standard" // standard | satellite | hybrid | terrain
  showsUserLocation={true}
  showsMyLocationButton={true}
  onRegionChangeComplete={(region) => {}}
>
  {/* Маркеры */}
  <Marker
    coordinate={{ latitude: 55.7558, longitude: 37.6173 }}
    title="Фото 1"
    description="14.01.2026"
    onPress={() => {}}
  >
    {/* Кастомный маркер */}
    <Image source={photoThumbnail} style={{width: 50, height: 50}} />
  </Marker>
</MapView>

// Методы MapView
const mapRef = useRef<MapView>(null);

// Анимированный переход к региону
mapRef.current?.animateToRegion({
  latitude: 55.7558,
  longitude: 37.6173,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}, 1000);

// Поместить все маркеры в видимую область
mapRef.current?.fitToCoordinates(
  coordinates,
  {
    edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    animated: true,
  }
);
```

**API Keys:**

Android (AndroidManifest.xml):
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
```

iOS (AppDelegate.m):
```objc
#import <GoogleMaps/GoogleMaps.h>

[GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
```

---

### 2.2 Clustering (react-native-map-clustering)

**Документация:** https://github.com/venits/react-native-map-clustering

```typescript
import MapView, { Marker } from 'react-native-map-clustering';

<MapView
  clusterColor="#2196F3"
  clusterTextColor="#FFFFFF"
  clusterFontFamily="Roboto-Bold"
  radius={50}  // радиус кластеризации в пикселях
  extent={512} // размер тайла для группировки
  minZoom={0}
  maxZoom={20}
  minPoints={2} // минимум точек для создания кластера
  onClusterPress={(cluster) => {
    // Обработка клика на кластер
  }}
>
  {markers.map(marker => (
    <Marker key={marker.id} coordinate={marker.coordinate} />
  ))}
</MapView>
```

---

## 3. Storage API

### 3.1 SQLite (react-native-sqlite-storage)

**Документация:** https://github.com/andpor/react-native-sqlite-storage

```typescript
import SQLite from 'react-native-sqlite-storage';

// Открыть/создать базу данных
const db = await SQLite.openDatabase({
  name: 'gps_camera.db',
  location: 'default',
});

// Выполнить запрос
const [results] = await db.executeSql(
  'SELECT * FROM photos WHERE timestamp > ? ORDER BY timestamp DESC',
  [Date.now() - 86400000] // фото за последние 24 часа
);

// Обработать результаты
const rows = results.rows.raw(); // массив объектов
const count = results.rows.length;

// Транзакция
await db.transaction(async (tx) => {
  await tx.executeSql('INSERT INTO photos (...) VALUES (...)', []);
  await tx.executeSql('INSERT INTO tags (...) VALUES (...)', []);
});

// Закрыть БД
await db.close();
```

---

### 3.2 AsyncStorage

**Документация:** https://react-native-async-storage.github.io/async-storage/

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Сохранить данные
await AsyncStorage.setItem('settings', JSON.stringify(settings));

// Получить данные
const value = await AsyncStorage.getItem('settings');
const settings = JSON.parse(value);

// Удалить данные
await AsyncStorage.removeItem('settings');

// Множественные операции
await AsyncStorage.multiSet([
  ['key1', 'value1'],
  ['key2', 'value2'],
]);

const values = await AsyncStorage.multiGet(['key1', 'key2']);

// Очистить все
await AsyncStorage.clear();

// Получить все ключи
const keys = await AsyncStorage.getAllKeys();
```

---

### 3.3 MMKV (react-native-mmkv)

**Документация:** https://github.com/mrousavy/react-native-mmkv

Более быстрая альтернатива AsyncStorage.

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Сохранить
storage.set('user.name', 'John Doe');
storage.set('user.age', 30);
storage.set('is-premium', true);

// Получить
const name = storage.getString('user.name');
const age = storage.getNumber('user.age');
const isPremium = storage.getBoolean('is-premium');

// Удалить
storage.delete('user.name');

// Проверить существование
const exists = storage.contains('user.name');

// Получить все ключи
const keys = storage.getAllKeys();

// Очистить
storage.clearAll();

// Encryption
const encryptedStorage = new MMKV({
  id: 'secure-storage',
  encryptionKey: 'some-encryption-key',
});
```

---

## 4. Permissions API

### 4.1 react-native-permissions

**Документация:** https://github.com/zoontek/react-native-permissions

```typescript
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Проверить разрешение
const result = await check(PERMISSIONS.ANDROID.CAMERA);

// Результаты проверки
switch (result) {
  case RESULTS.UNAVAILABLE:
    // Функция недоступна на устройстве
    break;
  case RESULTS.DENIED:
    // Разрешение не было запрошено / отклонено, но можно запросить снова
    break;
  case RESULTS.LIMITED:
    // Разрешение предоставлено с ограничениями (iOS 14+)
    break;
  case RESULTS.GRANTED:
    // Разрешение предоставлено
    break;
  case RESULTS.BLOCKED:
    // Разрешение отклонено и заблокировано, нужно открыть настройки
    break;
}

// Запросить разрешение
const result = await request(PERMISSIONS.ANDROID.CAMERA);

// Множественные разрешения
import { checkMultiple, requestMultiple } from 'react-native-permissions';

const statuses = await checkMultiple([
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
]);

const results = await requestMultiple([
  PERMISSIONS.ANDROID.CAMERA,
  PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
]);

// Открыть настройки приложения
import { openSettings } from 'react-native-permissions';
await openSettings();

// Платформозависимые разрешения
const CAMERA_PERMISSION = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
});
```

---

## 5. Share API

### 5.1 React Native Share

```typescript
import Share from 'react-native-share';

// Поделиться файлом
await Share.open({
  url: `file://${filePath}`,
  type: 'application/zip',
  title: 'Экспорт GPS фото',
  message: 'Мои геопривязанные фотографии',
  subject: 'GPS Camera Export',
  filename: 'photos_export.zip',
});

// Поделиться текстом
await Share.open({
  message: 'Попробуйте GPS Camera App!',
  url: 'https://gps-camera.app',
});

// Специфичные платформы
await Share.shareSingle({
  social: Share.Social.EMAIL,
  url: `file://${filePath}`,
  subject: 'GPS Photos Export',
});

// Email
await Share.shareSingle({
  social: Share.Social.EMAIL,
  recipients: ['user@example.com'],
  subject: 'My GPS Photos',
  message: 'Check out my photos with GPS data!',
});
```

---

## 6. Export Formats API

### 6.1 KML (Keyhole Markup Language)

Формат для Google Earth.

```typescript
// Генерация KML
function generateKML(photos: PhotoMetadata[]): string {
  const placemarks = photos.map(photo => `
    <Placemark>
      <name>${photo.note || 'Photo'}</name>
      <description>
        <![CDATA[
          <img src="${photo.uri}" width="200"/>
          <br/>Date: ${new Date(photo.timestamp).toLocaleString()}
          <br/>Accuracy: ${photo.coordinates.accuracy}m
        ]]>
      </description>
      <Point>
        <coordinates>
          ${photo.coordinates.longitude},${photo.coordinates.latitude},${photo.coordinates.altitude || 0}
        </coordinates>
      </Point>
    </Placemark>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GPS Camera Photos</name>
    <description>Exported from GPS Camera App</description>
    ${placemarks}
  </Document>
</kml>`;
}
```

### 6.2 GPX (GPS Exchange Format)

Формат для GPS навигации.

```typescript
// Генерация GPX
function generateGPX(photos: PhotoMetadata[]): string {
  const waypoints = photos.map(photo => `
    <wpt lat="${photo.coordinates.latitude}" lon="${photo.coordinates.longitude}">
      <ele>${photo.coordinates.altitude || 0}</ele>
      <time>${new Date(photo.timestamp).toISOString()}</time>
      <name>${photo.note || 'Photo'}</name>
      <desc>${photo.category || ''}</desc>
    </wpt>
  `).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
     creator="GPS Camera App"
     xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>GPS Camera Photos</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  ${waypoints}
</gpx>`;
}
```

### 6.3 CSV (Comma-Separated Values)

```typescript
// Генерация CSV
function generateCSV(photos: PhotoMetadata[]): string {
  const header = 'ID,Latitude,Longitude,Altitude,Accuracy,Timestamp,Date,Note,Category,Tags\n';

  const rows = photos.map(photo => {
    const date = new Date(photo.timestamp).toISOString();
    const tags = photo.tags.map(t => t.name).join(';');

    return [
      photo.id,
      photo.coordinates.latitude,
      photo.coordinates.longitude,
      photo.coordinates.altitude || '',
      photo.coordinates.accuracy || '',
      photo.timestamp,
      date,
      `"${photo.note || ''}"`,
      photo.category || '',
      `"${tags}"`,
    ].join(',');
  }).join('\n');

  return header + rows;
}
```

---

## 7. Backend API (Phase 3)

**Base URL:** `https://api.gps-camera.app/v1`

### 7.1 Authentication

#### POST /auth/register
Регистрация нового пользователя.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-14T12:00:00Z"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Вход в систему.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "user": {...},
  "token": "jwt-token"
}
```

#### POST /auth/refresh
Обновление токена.

**Headers:**
```
Authorization: Bearer <old-token>
```

**Response:**
```json
{
  "token": "new-jwt-token"
}
```

---

### 7.2 Photos API

#### GET /photos
Получить список фотографий пользователя.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (number): Количество записей (default: 50)
- `offset` (number): Смещение (default: 0)
- `from` (timestamp): Фильтр по дате от
- `to` (timestamp): Фильтр по дате до
- `category` (string): Фильтр по категории

**Response:**
```json
{
  "photos": [
    {
      "id": "photo-uuid",
      "userId": "user-uuid",
      "url": "https://storage.gps-camera.app/photos/...",
      "thumbnailUrl": "https://storage.gps-camera.app/thumbnails/...",
      "coordinates": {
        "latitude": 55.7558,
        "longitude": 37.6173,
        "altitude": 150,
        "accuracy": 8
      },
      "timestamp": 1705238400000,
      "note": "Beautiful sunset",
      "category": "travel",
      "tags": ["nature", "moscow"],
      "createdAt": "2026-01-14T12:00:00Z",
      "updatedAt": "2026-01-14T12:00:00Z"
    }
  ],
  "total": 123,
  "limit": 50,
  "offset": 0
}
```

#### POST /photos
Загрузить новое фото.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body:**
```
photo: <binary file>
metadata: {
  "coordinates": {...},
  "timestamp": 1705238400000,
  "note": "...",
  "category": "travel",
  "tags": ["nature"]
}
```

**Response:**
```json
{
  "photo": {...}
}
```

#### PATCH /photos/:id
Обновить метаданные фото.

**Request:**
```json
{
  "note": "Updated note",
  "category": "work",
  "tags": ["new-tag"]
}
```

**Response:**
```json
{
  "photo": {...}
}
```

#### DELETE /photos/:id
Удалить фото.

**Response:**
```json
{
  "success": true
}
```

---

### 7.3 Sync API

#### POST /sync/push
Отправить изменения на сервер.

**Request:**
```json
{
  "photos": [
    {
      "id": "local-uuid",
      "action": "create",
      "data": {...}
    },
    {
      "id": "photo-uuid",
      "action": "update",
      "data": {...}
    },
    {
      "id": "photo-uuid",
      "action": "delete"
    }
  ],
  "lastSyncAt": 1705238400000
}
```

**Response:**
```json
{
  "conflicts": [],
  "processed": 3,
  "failed": 0
}
```

#### GET /sync/pull
Получить изменения с сервера.

**Query Parameters:**
- `since` (timestamp): Получить изменения с указанной даты

**Response:**
```json
{
  "photos": [
    {
      "id": "photo-uuid",
      "action": "create" | "update" | "delete",
      "data": {...},
      "updatedAt": "2026-01-14T12:00:00Z"
    }
  ],
  "serverTime": 1705238400000
}
```

---

## 8. In-App Purchase API

### 8.1 react-native-iap

**Документация:** https://github.com/dooboolab/react-native-iap

```typescript
import * as RNIap from 'react-native-iap';

// Product IDs
const productIds = ['premium_monthly', 'premium_yearly'];

// Инициализация
await RNIap.initConnection();

// Получить продукты
const products = await RNIap.getProducts({ skus: productIds });

// Подписаться
const purchase = await RNIap.requestSubscription({
  sku: 'premium_monthly',
  ...(Platform.OS === 'android' && {
    subscriptionOffers: [{ sku: 'premium_monthly', offerToken: 'token' }]
  })
});

// Проверить активные подписки
const subscriptions = await RNIap.getAvailablePurchases();

// Восстановить покупки
await RNIap.getAvailablePurchases();

// Завершить транзакцию (важно!)
await RNIap.finishTransaction({ purchase });

// Слушатель покупок
const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
  (purchase) => {
    console.log('Purchase updated:', purchase);
  }
);

const purchaseErrorSubscription = RNIap.purchaseErrorListener(
  (error) => {
    console.error('Purchase error:', error);
  }
);

// Очистка
await RNIap.endConnection();
purchaseUpdateSubscription?.remove();
purchaseErrorSubscription?.remove();
```

**Product IDs (Configuration):**

iOS (App Store Connect):
- `com.gpscamera.premium.monthly`
- `com.gpscamera.premium.yearly`

Android (Google Play Console):
- `premium_monthly`
- `premium_yearly`

---

## 9. Analytics API

### 9.1 Firebase Analytics

```typescript
import analytics from '@react-native-firebase/analytics';

// Логировать событие
await analytics().logEvent('photo_captured', {
  gps_accuracy: 'high',
  category: 'travel',
});

// Установить user property
await analytics().setUserProperty('premium_user', 'true');

// Установить ID пользователя
await analytics().setUserId('user-123');

// Логировать screen view
await analytics().logScreenView({
  screen_name: 'CameraScreen',
  screen_class: 'CameraScreen',
});

// Предустановленные события
await analytics().logLogin({ method: 'email' });
await analytics().logSignUp({ method: 'email' });
await analytics().logPurchase({
  currency: 'RUB',
  value: 299,
  items: [{ item_id: 'premium_monthly' }],
});
```

---

## 10. Error Tracking API

### 10.1 Sentry

```typescript
import * as Sentry from '@sentry/react-native';

// Инициализация
Sentry.init({
  dsn: 'https://...@sentry.io/...',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
});

// Логировать ошибку
try {
  // код
} catch (error) {
  Sentry.captureException(error);
}

// Добавить breadcrumb
Sentry.addBreadcrumb({
  message: 'User captured photo',
  category: 'action',
  level: 'info',
});

// Установить пользователя
Sentry.setUser({
  id: 'user-123',
  email: 'user@example.com',
});

// Установить тег
Sentry.setTag('gps_enabled', 'true');

// Установить контекст
Sentry.setContext('photo', {
  id: 'photo-123',
  gps_accuracy: 8,
});
```

---

## 11. Push Notifications (Future)

### 11.1 Firebase Cloud Messaging

```typescript
import messaging from '@react-native-firebase/messaging';

// Запросить разрешение
const authStatus = await messaging().requestPermission();

// Получить FCM токен
const token = await messaging().getToken();

// Слушатель foreground сообщений
messaging().onMessage(async remoteMessage => {
  console.log('Notification:', remoteMessage);
});

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
});

// Обработка нажатия на уведомление
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('Notification opened:', remoteMessage);
});

// Проверить начальное уведомление
const initialNotification = await messaging().getInitialNotification();
```

---

## Заключение

Это полная документация всех API и интеграций, используемых в GPS Camera App. Документация будет обновляться по мере добавления новых функций и интеграций.

**Последнее обновление:** 14 января 2026
