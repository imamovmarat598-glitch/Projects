# Technical Design Document (TDD)
## GPS Camera App

**Версия:** 1.0
**Дата:** 14 января 2026
**Автор:** Engineering Team

---

## 1. Архитектура приложения

### 1.1 Общая архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│         (React Native Components + Navigation)               │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────┐
│                      State Management                        │
│                  (Redux + Redux Toolkit)                     │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────┐
│                     Business Logic Layer                     │
│            (Services, Hooks, Utilities)                      │
└─────────────┬──────────────┬──────────────┬─────────────────┘
              │              │              │
    ┌─────────┴────┐  ┌─────┴──────┐  ┌───┴──────────┐
    │ GPS Service  │  │  Camera    │  │  Storage     │
    │              │  │  Service   │  │  Service     │
    └─────────┬────┘  └─────┬──────┘  └───┬──────────┘
              │              │              │
┌─────────────┴──────────────┴──────────────┴─────────────────┐
│                      Native Layer                            │
│   (React Native Modules + Native APIs)                       │
└─────────────────────────────────────────────────────────────┘
              │              │              │
    ┌─────────┴────┐  ┌─────┴──────┐  ┌───┴──────────┐
    │ Device GPS   │  │  Device    │  │  File        │
    │              │  │  Camera    │  │  System      │
    └──────────────┘  └────────────┘  └──────────────┘
```

### 1.2 Технологический стек

**Frontend Framework:**
- **React Native 0.73+** — кроссплатформенная разработка
- **TypeScript 5.0+** — типобезопасность
- **React 18+** — UI библиотека

**State Management:**
- **Redux Toolkit** — глобальное состояние
- **Redux Persist** — сохранение состояния
- **React Query (TanStack Query)** — кеширование асинхронных данных

**Navigation:**
- **React Navigation 6+** — навигация между экранами
- **Bottom Tabs** — основная навигация
- **Stack Navigator** — вложенная навигация

**UI Components:**
- **React Native Paper** — Material Design компоненты (Android)
- **React Native Elements** — кроссплатформенные компоненты
- **Custom Components** — специфичные для приложения

**Maps:**
- **react-native-maps** — интеграция карт
- **Google Maps** (Android) / **Apple Maps** (iOS)
- **Mapbox** — альтернатива с офлайн картами (Phase 3)

**Camera:**
- **react-native-vision-camera** — современная библиотека камеры
- Высокая производительность и гибкость
- Поддержка EXIF metadata

**Location Services:**
- **@react-native-community/geolocation** — базовая геолокация
- **react-native-geolocation-service** — расширенный GPS с высокой точностью

**Storage:**
- **AsyncStorage** — ключ-значение хранилище для настроек
- **React Native MMKV** — быстрое key-value хранилище
- **SQLite (react-native-sqlite-storage)** — реляционная БД для метаданных
- **React Native FS** — работа с файловой системой

**Image Processing:**
- **react-native-image-resizer** — оптимизация размера
- **react-native-image-crop-picker** — дополнительная обработка
- **react-native-exif** — чтение/запись EXIF данных

**Utilities:**
- **date-fns** — работа с датами
- **axios** — HTTP клиент (для будущих API)
- **react-native-permissions** — управление разрешениями
- **react-native-uuid** — генерация уникальных ID

---

## 2. Структура проекта

```
gps-camera-app/
├── android/                    # Android native code
├── ios/                        # iOS native code
├── src/
│   ├── assets/                # Изображения, иконки, шрифты
│   │   ├── icons/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/            # Переиспользуемые компоненты
│   │   ├── common/           # Общие компоненты
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   └── LoadingSpinner/
│   │   ├── camera/           # Компоненты камеры
│   │   │   ├── CameraView/
│   │   │   ├── GPSIndicator/
│   │   │   └── CaptureButton/
│   │   ├── gallery/          # Компоненты галереи
│   │   │   ├── PhotoGrid/
│   │   │   ├── PhotoDetail/
│   │   │   └── MetadataPanel/
│   │   └── map/              # Компоненты карты
│   │       ├── MapView/
│   │       ├── PhotoMarker/
│   │       └── ClusterMarker/
│   ├── screens/              # Экраны приложения
│   │   ├── CameraScreen/
│   │   ├── GalleryScreen/
│   │   ├── MapScreen/
│   │   ├── PhotoDetailScreen/
│   │   └── SettingsScreen/
│   ├── navigation/           # Настройка навигации
│   │   ├── AppNavigator.tsx
│   │   ├── TabNavigator.tsx
│   │   └── types.ts
│   ├── store/                # Redux store
│   │   ├── slices/
│   │   │   ├── photosSlice.ts
│   │   │   ├── settingsSlice.ts
│   │   │   └── mapSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── services/             # Бизнес-логика
│   │   ├── gps/
│   │   │   ├── GPSService.ts
│   │   │   └── types.ts
│   │   ├── camera/
│   │   │   ├── CameraService.ts
│   │   │   └── types.ts
│   │   ├── storage/
│   │   │   ├── PhotoStorage.ts
│   │   │   ├── MetadataStorage.ts
│   │   │   └── types.ts
│   │   └── export/
│   │       ├── ExportService.ts
│   │       └── formatters/
│   │           ├── kml.ts
│   │           ├── gpx.ts
│   │           └── csv.ts
│   ├── hooks/                # Custom React hooks
│   │   ├── useGPS.ts
│   │   ├── useCamera.ts
│   │   ├── usePhotos.ts
│   │   └── usePermissions.ts
│   ├── utils/                # Утилиты
│   │   ├── constants.ts
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── types/                # TypeScript типы
│   │   ├── photo.ts
│   │   ├── gps.ts
│   │   └── navigation.ts
│   ├── database/             # SQLite схемы и миграции
│   │   ├── schema.ts
│   │   ├── migrations/
│   │   └── queries.ts
│   ├── theme/                # Стили и темы
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   └── App.tsx               # Entry point
├── __tests__/                # Тесты
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Модель данных

### 3.1 Структура базы данных (SQLite)

#### Таблица: photos
```sql
CREATE TABLE photos (
    id TEXT PRIMARY KEY,              -- UUID
    uri TEXT NOT NULL,                -- Путь к файлу
    thumbnail_uri TEXT,               -- Путь к миниатюре
    latitude REAL NOT NULL,           -- Широта
    longitude REAL NOT NULL,          -- Долгота
    altitude REAL,                    -- Высота над уровнем моря
    accuracy REAL,                    -- Точность GPS (метры)
    timestamp INTEGER NOT NULL,       -- Unix timestamp
    created_at INTEGER NOT NULL,      -- Время создания записи
    updated_at INTEGER NOT NULL,      -- Время обновления
    note TEXT,                        -- Текстовая заметка
    category TEXT,                    -- Категория (Work, Travel, etc.)
    address TEXT,                     -- Читаемый адрес (опционально)
    is_deleted INTEGER DEFAULT 0,    -- Soft delete
    file_size INTEGER,                -- Размер файла в байтах
    width INTEGER,                    -- Ширина изображения
    height INTEGER                    -- Высота изображения
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_photos_timestamp ON photos(timestamp DESC);
CREATE INDEX idx_photos_location ON photos(latitude, longitude);
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_deleted ON photos(is_deleted);
```

#### Таблица: tags
```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,        -- Название метки
    color TEXT DEFAULT '#2196F3',     -- Цвет для UI
    created_at INTEGER NOT NULL
);

CREATE INDEX idx_tags_name ON tags(name);
```

#### Таблица: photo_tags (связь многие-ко-многим)
```sql
CREATE TABLE photo_tags (
    photo_id TEXT NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (photo_id, tag_id),
    FOREIGN KEY (photo_id) REFERENCES photos(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX idx_photo_tags_photo ON photo_tags(photo_id);
CREATE INDEX idx_photo_tags_tag ON photo_tags(tag_id);
```

#### Таблица: settings
```sql
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at INTEGER NOT NULL
);
```

### 3.2 TypeScript интерфейсы

```typescript
// types/photo.ts

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export interface PhotoMetadata {
  id: string;
  uri: string;
  thumbnailUri?: string;
  coordinates: GPSCoordinates;
  timestamp: number;
  createdAt: number;
  updatedAt: number;
  note?: string;
  category?: PhotoCategory;
  tags: Tag[];
  address?: string;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export enum PhotoCategory {
  WORK = 'work',
  TRAVEL = 'travel',
  FAMILY = 'family',
  OTHER = 'other',
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt: number;
}

export interface PhotoFilter {
  dateFrom?: number;
  dateTo?: number;
  categories?: PhotoCategory[];
  tags?: number[];
  searchQuery?: string;
  boundingBox?: {
    northEast: GPSCoordinates;
    southWest: GPSCoordinates;
  };
}

export interface ExportFormat {
  type: 'kml' | 'gpx' | 'csv' | 'zip';
  includePhotos: boolean;
  includeMetadata: boolean;
}
```

```typescript
// types/gps.ts

export enum GPSAccuracy {
  HIGH = 'high',      // < 10 метров
  MEDIUM = 'medium',  // 10-50 метров
  LOW = 'low',        // > 50 метров
}

export interface GPSStatus {
  isAvailable: boolean;
  isEnabled: boolean;
  accuracy: GPSAccuracy;
  currentLocation?: GPSCoordinates;
  lastUpdate?: number;
}

export interface GPSServiceConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  distanceFilter: number;
}
```

---

## 4. API и сервисы

### 4.1 GPSService

```typescript
// services/gps/GPSService.ts

class GPSService {
  private watchId: number | null = null;
  private currentLocation: GPSCoordinates | null = null;
  private listeners: Array<(location: GPSCoordinates) => void> = [];

  /**
   * Инициализация GPS сервиса
   */
  async initialize(config: GPSServiceConfig): Promise<void> {
    // Проверка и запрос разрешений
    await this.checkPermissions();
    // Запуск отслеживания позиции
    this.startWatching(config);
  }

  /**
   * Получить текущую позицию
   */
  async getCurrentLocation(): Promise<GPSCoordinates> {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(this.formatPosition(position));
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    });
  }

  /**
   * Начать отслеживание позиции
   */
  private startWatching(config: GPSServiceConfig): void {
    this.watchId = Geolocation.watchPosition(
      (position) => {
        this.currentLocation = this.formatPosition(position);
        this.notifyListeners(this.currentLocation);
      },
      (error) => console.error('GPS error:', error),
      config
    );
  }

  /**
   * Остановить отслеживание
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Подписаться на обновления GPS
   */
  subscribe(callback: (location: GPSCoordinates) => void): () => void {
    this.listeners.push(callback);
    // Возвращаем функцию отписки
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Получить качество GPS сигнала
   */
  getAccuracyLevel(accuracy?: number): GPSAccuracy {
    if (!accuracy) return GPSAccuracy.LOW;
    if (accuracy < 10) return GPSAccuracy.HIGH;
    if (accuracy < 50) return GPSAccuracy.MEDIUM;
    return GPSAccuracy.LOW;
  }

  private formatPosition(position: GeolocationPosition): GPSCoordinates {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude ?? undefined,
      accuracy: position.coords.accuracy,
    };
  }

  private notifyListeners(location: GPSCoordinates): void {
    this.listeners.forEach(callback => callback(location));
  }

  private async checkPermissions(): Promise<void> {
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (status !== RESULTS.GRANTED) {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result !== RESULTS.GRANTED) {
        throw new Error('GPS permission denied');
      }
    }
  }
}

export default new GPSService();
```

### 4.2 CameraService

```typescript
// services/camera/CameraService.ts

class CameraService {
  private camera: Camera | null = null;

  /**
   * Захват фото с GPS метаданными
   */
  async capturePhoto(location: GPSCoordinates): Promise<PhotoMetadata> {
    if (!this.camera) {
      throw new Error('Camera not initialized');
    }

    // Снять фото
    const photo = await this.camera.takePhoto({
      qualityPrioritization: 'quality',
      flash: 'auto',
      enableShutterSound: true,
    });

    // Создать ID и пути
    const id = uuid.v4();
    const timestamp = Date.now();
    const fileName = `photo_${timestamp}.jpg`;
    const photoPath = `${RNFS.DocumentDirectoryPath}/photos/${fileName}`;
    const thumbnailPath = `${RNFS.DocumentDirectoryPath}/thumbnails/${fileName}`;

    // Скопировать файл
    await RNFS.moveFile(photo.path, photoPath);

    // Создать миниатюру
    await this.createThumbnail(photoPath, thumbnailPath);

    // Записать GPS в EXIF
    await this.writeEXIF(photoPath, location, timestamp);

    // Получить размеры
    const { width, height } = await Image.getSize(photoPath);
    const fileSize = await RNFS.stat(photoPath).then(stat => stat.size);

    // Вернуть метаданные
    return {
      id,
      uri: photoPath,
      thumbnailUri: thumbnailPath,
      coordinates: location,
      timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      tags: [],
      fileSize,
      dimensions: { width, height },
    };
  }

  /**
   * Создать миниатюру
   */
  private async createThumbnail(
    sourcePath: string,
    targetPath: string
  ): Promise<void> {
    await ImageResizer.createResizedImage(
      sourcePath,
      400,
      400,
      'JPEG',
      80,
      0,
      targetPath
    );
  }

  /**
   * Записать EXIF метаданные
   */
  private async writeEXIF(
    photoPath: string,
    location: GPSCoordinates,
    timestamp: number
  ): Promise<void> {
    const exifData = {
      GPSLatitude: location.latitude,
      GPSLongitude: location.longitude,
      GPSAltitude: location.altitude,
      GPSTimeStamp: new Date(timestamp).toISOString(),
      DateTime: new Date(timestamp).toISOString(),
    };

    await RNExif.saveAttributes(photoPath, exifData);
  }

  /**
   * Установить ссылку на камеру
   */
  setCamera(camera: Camera): void {
    this.camera = camera;
  }
}

export default new CameraService();
```

### 4.3 PhotoStorage

```typescript
// services/storage/PhotoStorage.ts

class PhotoStorage {
  private db: SQLite.Database | null = null;

  /**
   * Инициализация БД
   */
  async initialize(): Promise<void> {
    this.db = await SQLite.openDatabase({
      name: 'gps_camera.db',
      location: 'default',
    });

    await this.runMigrations();
  }

  /**
   * Сохранить фото
   */
  async savePhoto(photo: PhotoMetadata): Promise<void> {
    const query = `
      INSERT INTO photos (
        id, uri, thumbnail_uri, latitude, longitude, altitude, accuracy,
        timestamp, created_at, updated_at, note, category, file_size, width, height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.db!.executeSql(query, [
      photo.id,
      photo.uri,
      photo.thumbnailUri,
      photo.coordinates.latitude,
      photo.coordinates.longitude,
      photo.coordinates.altitude,
      photo.coordinates.accuracy,
      photo.timestamp,
      photo.createdAt,
      photo.updatedAt,
      photo.note,
      photo.category,
      photo.fileSize,
      photo.dimensions?.width,
      photo.dimensions?.height,
    ]);

    // Сохранить теги
    if (photo.tags.length > 0) {
      await this.savePhotoTags(photo.id, photo.tags);
    }
  }

  /**
   * Получить все фото с фильтрами
   */
  async getPhotos(filter?: PhotoFilter): Promise<PhotoMetadata[]> {
    let query = `
      SELECT p.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names
      FROM photos p
      LEFT JOIN photo_tags pt ON p.id = pt.photo_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.is_deleted = 0
    `;

    const params: any[] = [];

    // Применить фильтры
    if (filter?.dateFrom) {
      query += ' AND p.timestamp >= ?';
      params.push(filter.dateFrom);
    }

    if (filter?.dateTo) {
      query += ' AND p.timestamp <= ?';
      params.push(filter.dateTo);
    }

    if (filter?.categories && filter.categories.length > 0) {
      query += ` AND p.category IN (${filter.categories.map(() => '?').join(',')})`;
      params.push(...filter.categories);
    }

    query += ' GROUP BY p.id ORDER BY p.timestamp DESC';

    const [result] = await this.db!.executeSql(query, params);
    return this.mapResultToPhotos(result.rows.raw());
  }

  /**
   * Обновить фото
   */
  async updatePhoto(id: string, updates: Partial<PhotoMetadata>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.note !== undefined) {
      fields.push('note = ?');
      values.push(updates.note);
    }

    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }

    fields.push('updated_at = ?');
    values.push(Date.now());

    values.push(id);

    const query = `UPDATE photos SET ${fields.join(', ')} WHERE id = ?`;
    await this.db!.executeSql(query, values);

    // Обновить теги если нужно
    if (updates.tags) {
      await this.updatePhotoTags(id, updates.tags);
    }
  }

  /**
   * Удалить фото (soft delete)
   */
  async deletePhoto(id: string): Promise<void> {
    await this.db!.executeSql(
      'UPDATE photos SET is_deleted = 1, updated_at = ? WHERE id = ?',
      [Date.now(), id]
    );
  }

  // ... дополнительные методы
}

export default new PhotoStorage();
```

### 4.4 ExportService

```typescript
// services/export/ExportService.ts

class ExportService {
  /**
   * Экспортировать фото в выбранном формате
   */
  async exportPhotos(
    photos: PhotoMetadata[],
    format: ExportFormat
  ): Promise<string> {
    switch (format.type) {
      case 'kml':
        return this.exportToKML(photos);
      case 'gpx':
        return this.exportToGPX(photos);
      case 'csv':
        return this.exportToCSV(photos);
      case 'zip':
        return this.exportToZIP(photos, format);
      default:
        throw new Error(`Unsupported format: ${format.type}`);
    }
  }

  /**
   * Экспорт в KML (Google Earth)
   */
  private async exportToKML(photos: PhotoMetadata[]): Promise<string> {
    const kml = KMLFormatter.format(photos);
    const filePath = `${RNFS.DocumentDirectoryPath}/export_${Date.now()}.kml`;
    await RNFS.writeFile(filePath, kml, 'utf8');
    return filePath;
  }

  /**
   * Экспорт в GPX
   */
  private async exportToGPX(photos: PhotoMetadata[]): Promise<string> {
    const gpx = GPXFormatter.format(photos);
    const filePath = `${RNFS.DocumentDirectoryPath}/export_${Date.now()}.gpx`;
    await RNFS.writeFile(filePath, gpx, 'utf8');
    return filePath;
  }

  /**
   * Экспорт в CSV
   */
  private async exportToCSV(photos: PhotoMetadata[]): Promise<string> {
    const csv = CSVFormatter.format(photos);
    const filePath = `${RNFS.DocumentDirectoryPath}/export_${Date.now()}.csv`;
    await RNFS.writeFile(filePath, csv, 'utf8');
    return filePath;
  }

  /**
   * Экспорт в ZIP с фото и метаданными
   */
  private async exportToZIP(
    photos: PhotoMetadata[],
    format: ExportFormat
  ): Promise<string> {
    // Создать временную директорию
    const tempDir = `${RNFS.CachesDirectoryPath}/export_${Date.now()}`;
    await RNFS.mkdir(tempDir);

    // Скопировать фото если нужно
    if (format.includePhotos) {
      const photosDir = `${tempDir}/photos`;
      await RNFS.mkdir(photosDir);

      for (const photo of photos) {
        const fileName = photo.uri.split('/').pop()!;
        await RNFS.copyFile(photo.uri, `${photosDir}/${fileName}`);
      }
    }

    // Создать JSON с метаданными
    if (format.includeMetadata) {
      const metadata = JSON.stringify(photos, null, 2);
      await RNFS.writeFile(`${tempDir}/metadata.json`, metadata, 'utf8');
    }

    // Создать ZIP
    const zipPath = `${RNFS.DocumentDirectoryPath}/export_${Date.now()}.zip`;
    await zip(tempDir, zipPath);

    // Удалить временную директорию
    await RNFS.unlink(tempDir);

    return zipPath;
  }

  /**
   * Поделиться файлом
   */
  async shareFile(filePath: string): Promise<void> {
    await Share.open({
      url: `file://${filePath}`,
      type: this.getMimeType(filePath),
    });
  }

  private getMimeType(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      kml: 'application/vnd.google-earth.kml+xml',
      gpx: 'application/gpx+xml',
      csv: 'text/csv',
      zip: 'application/zip',
    };
    return mimeTypes[ext!] || 'application/octet-stream';
  }
}

export default new ExportService();
```

---

## 5. Безопасность

### 5.1 Хранение данных
- **Фото:** Приватная директория приложения (`DocumentDirectory`)
- **База данных:** Зашифрована с помощью SQLCipher (опционально для Premium)
- **Настройки:** AsyncStorage / MMKV с шифрованием

### 5.2 Разрешения

**Android (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
                 android:maxSdkVersion="28" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

**iOS (Info.plist):**
```xml
<key>NSCameraUsageDescription</key>
<string>Требуется для съемки фотографий</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Требуется для привязки координат к фотографиям</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Требуется для сохранения фотографий</string>
```

### 5.3 Конфиденциальность
- Никакие данные не передаются на внешние серверы без согласия
- Геолокация используется только локально
- Опциональная аутентификация (биометрия) для доступа к приложению
- Соответствие GDPR: пользователь может экспортировать и удалить все данные

---

## 6. Производительность и оптимизация

### 6.1 Оптимизация изображений
- Создание миниатюр для галереи (400x400px)
- Lazy loading в списках
- Image caching с помощью FastImage
- Сжатие JPEG с качеством 85%

### 6.2 Оптимизация БД
- Индексы на часто запрашиваемые поля
- Пагинация результатов (20-50 записей)
- Batch операции для массовых изменений
- Регулярная очистка soft-deleted записей

### 6.3 Оптимизация карты
- Кластеризация маркеров при > 50 точек
- Загрузка только видимых маркеров
- Debounce для обновлений при перемещении
- Кэширование тайлов карты

### 6.4 Батарея
- Адаптивная частота GPS обновлений
- Остановка GPS при сворачивании приложения
- Оптимизация фоновых процессов
- Energy profiling для iOS и Android

---

## 7. Тестирование

### 7.1 Unit тесты
- **Jest** для тестирования функций и утилит
- Покрытие: > 70%
- Тесты для сервисов, форматеров, валидаторов

### 7.2 Integration тесты
- **React Native Testing Library** для компонентов
- Тестирование user flows
- Мокирование нативных модулей

### 7.3 E2E тесты
- **Detox** для сквозного тестирования
- Основные пользовательские сценарии
- Тестирование на реальных устройствах

### 7.4 Manual тесты
- GPS в различных условиях (город, лес, помещение)
- Производительность на слабых устройствах
- Тестирование на различных версиях ОС

---

## 8. CI/CD

### 8.1 Continuous Integration
- **GitHub Actions** / **Bitrise**
- Автоматические тесты при каждом PR
- Линтинг TypeScript и ESLint
- Build проверка для обеих платформ

### 8.2 Continuous Deployment
- Автоматическая сборка для TestFlight (iOS)
- Автоматическая сборка для Google Play Internal Testing
- Beta тестирование перед релизом
- Автоматизация версионирования (semantic versioning)

---

## 9. Мониторинг и аналитика

### 9.1 Crash Reporting
- **Sentry** / **Firebase Crashlytics**
- Автоматическая отправка отчетов о крэшах
- Source maps для деобфускации

### 9.2 Analytics
- **Firebase Analytics** (базовые метрики)
- **Amplitude** / **Mixpanel** (продвинутая аналитика)
- Отслеживание: экраны, события, конверсия

### 9.3 Метрики
- Crash-free rate (цель: > 99%)
- App launch time
- Screen rendering time
- API response time

---

## 10. Масштабирование (Будущее)

### 10.1 Backend API
**При необходимости облачной синхронизации:**
- **NestJS** / **Express.js** для backend
- **PostgreSQL + PostGIS** для геоданных
- **Cloudflare R2** / **Cloudflare R2** для хранения фото
- **Redis** для кэширования
- RESTful API + WebSocket для real-time

### 10.2 Архитектура облачной синхронизации
```
Mobile App ←→ API Gateway ←→ Backend Services
                                ├─ Auth Service
                                ├─ Photo Service
                                ├─ Sync Service
                                └─ Storage Service
                                       ↓
                                  Cloud Storage
```

---

## 11. Зависимости

### 11.1 Package.json (основные зависимости)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-navigation/stack": "^6.3.20",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "redux-persist": "^6.0.0",
    "@tanstack/react-query": "^5.17.9",
    "react-native-maps": "^1.10.0",
    "react-native-vision-camera": "^3.7.0",
    "react-native-geolocation-service": "^5.3.1",
    "@react-native-community/geolocation": "^3.2.1",
    "react-native-sqlite-storage": "^6.0.1",
    "react-native-mmkv": "^2.11.0",
    "react-native-fs": "^2.20.0",
    "react-native-image-resizer": "^3.0.7",
    "react-native-exif": "^1.1.0",
    "react-native-permissions": "^4.0.3",
    "react-native-paper": "^5.11.6",
    "react-native-vector-icons": "^10.0.3",
    "date-fns": "^3.0.6",
    "react-native-uuid": "^2.0.1",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.47",
    "@types/react-native": "^0.72.8",
    "typescript": "^5.3.3",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.2",
    "detox": "^20.16.2",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "prettier": "^3.1.1"
  }
}
```

---

## 12. Ключевые решения

### 12.1 Почему React Native?
✅ Один код для iOS и Android
✅ Быстрая разработка MVP
✅ Большое сообщество и библиотеки
✅ Возможность написания нативных модулей при необходимости
✅ Hot Reload для быстрой итерации

### 12.2 Почему SQLite?
✅ Локальная БД без серверов
✅ Быстрые запросы для метаданных
✅ Поддержка индексов и сложных запросов
✅ Малый размер и производительность

### 12.3 Почему Redux Toolkit?
✅ Стандарт для React приложений
✅ Упрощенный Redux без boilerplate
✅ Отличная интеграция с TypeScript
✅ DevTools для отладки

---

**Документ подготовлен инженерной командой.**
**Последнее обновление:** 14 января 2026
