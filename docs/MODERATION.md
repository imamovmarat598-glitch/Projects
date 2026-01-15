# Moderation System Documentation
## GPS Camera App — Personal Telegram Monitoring Tool

**Версия:** 2.0
**Дата:** 15 января 2026
**Статус:** Утверждено
**Аудитория:** Owner Only (Single User)

---

## 1. Обзор системы мониторинга

### 1.1 Назначение

Личная система мониторинга GPS Camera App предназначена для **персонального контроля** всех загружаемых фотографий владельцем приложения. Доступ только у одного человека — владельца.

**Цели:**
- ✅ Выявления подозрительных location-based паттернов (возможные точки сбыта)
- ✅ Мониторинг активности пользователей по координатам
- ✅ Обнаружение регулярных загрузок в одной локации (возможные закладки)
- ✅ Отслеживание "маршрутов" между точками (возможная доставка)
- ✅ Сбор данных для предоставления правоохранительным органам по запросу

**ВАЖНО:**
- Никаких модераторов-команды — только вы лично
- Никакой детекции NSFW — фокус только на GPS паттернах
- Утечка данных невозможна — используете только вы

### 1.2 Ключевые особенности

- **Автоматический роутинг** — каждое фото отправляется в ваш личный Telegram по региону
- **Детальные метаданные** — IP, город, device, GPS координаты, адрес, timestamp
- **Location pattern detection** — выявление подозрительных GPS паттернов
- **Rate limiting alerts** — уведомления о частых загрузках
- **Региональные каналы** — разделение по географии (удобно для анализа)
- **Real-time мониторинг** — вы видите загрузки мгновенно
- **Thumbnail preview** — не грузим 10MB в Telegram, только preview

### 1.3 Принципы работы

```
User uploads photo
       ↓
Backend API receives photo
       ↓
Save full photo to Cloudflare R2
Generate thumbnail (640x480, ~100KB)
Save metadata to PostgreSQL
       ↓
Extract metadata (IP, device, GPS, etc.)
       ↓
Geocoding: GPS → readable address
       ↓
Location pattern analysis:
  - Same location check (radius 50m)
  - Frequency check (uploads/hour)
  - Time pattern (night uploads?)
  - Route detection (city-to-city)
       ↓
Determine region from GPS coordinates
       ↓
Send to YOUR Telegram channel:
  - Thumbnail (not full 10MB)
  - Metadata with address
  - Pattern alerts if suspicious
       ↓
YOU review in real-time
       ↓
Manual action if needed:
  - Flag device ID
  - Block IP temporarily
  - Export data for authorities
```

---

## 2. Архитектура Telegram Bot

### 2.1 Технический стек

**Backend:**
- **NestJS** — основной backend framework
- **node-telegram-bot-api** — Telegram Bot SDK
- **PostgreSQL + PostGIS** — хранилище метаданных + spatial queries
- **Google Geocoding API / Nominatim** — преобразование координат в адреса
- **Sharp / Jimp** — генерация thumbnails на сервере
- **Bull Queue** — асинхронная обработка отправки в Telegram

**Telegram:**
- **Private channels** — только ваши личные каналы по регионам
- **Single owner** — доступ только у вас
- **Bot commands** — для поиска по device/IP, экспорта данных

### 2.2 Структура каналов (Simplified)

**Ваши личные каналы (Private Telegram Channels):**

1. **#moscow** — Москва и МО
   - GPS: 55.142° - 56.577° N, 36.803° - 39.185° E

2. **#spb** — Санкт-Петербург и ЛО
   - GPS: 59.444° - 60.5° N, 29.5° - 31.0° E

3. **#russia_other** — Остальная Россия
   - Все регионы РФ кроме Москвы и СПб

4. **#foreign** — За границей
   - Все страны кроме России

5. **#suspicious** — Подозрительные паттерны
   - Location patterns detected (частые загрузки в одной точке)
   - Rate limiting violations (слишком много загрузок)
   - Night activity (загрузки ночью 00:00-06:00)
   - Route patterns (город-город, возможная доставка)
   - Flagged devices/IPs

**Всего:** 5 каналов (минимализм для удобства личного мониторинга)

### 2.3 Region Mapping

**Определение региона по GPS координатам:**

```typescript
interface Region {
  id: string;
  name: string;
  channel: string;
  boundaries: {
    latMin: number;
    latMax: number;
    lonMin: number;
    lonMax: number;
  };
}

const REGIONS: Region[] = [
  {
    id: 'moscow',
    name: 'Москва и МО',
    channel: '@gps_camera_moscow',
    boundaries: {
      latMin: 55.142,
      latMax: 56.577,
      lonMin: 36.803,
      lonMax: 39.185
    }
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург и ЛО',
    channel: '@gps_camera_spb',
    boundaries: {
      latMin: 59.444,
      latMax: 60.5,
      lonMin: 29.5,
      lonMax: 31.0
    }
  },
  // ... другие регионы
];

function determineRegion(lat: number, lon: number): string {
  // 1. Проверка специфических регионов (Moscow, SPb, etc.)
  for (const region of REGIONS) {
    if (
      lat >= region.boundaries.latMin &&
      lat <= region.boundaries.latMax &&
      lon >= region.boundaries.lonMin &&
      lon <= region.boundaries.lonMax
    ) {
      return region.channel;
    }
  }

  // 2. Определение страны по координатам (использовать геокодинг API)
  const country = await geocodeCountry(lat, lon);

  // 3. Роутинг по стране
  if (country === 'RU') {
    return determineRussiaRegion(lat, lon); // Более детальная логика
  } else if (EUROPE_COUNTRIES.includes(country)) {
    return '@gps_camera_foreign_europe';
  } else if (ASIA_COUNTRIES.includes(country)) {
    return '@gps_camera_foreign_asia';
  } else if (AMERICAS_COUNTRIES.includes(country)) {
    return '@gps_camera_foreign_americas';
  } else {
    return '@gps_camera_foreign_other';
  }
}
```

---

## 3. Формат сообщений в Telegram

### 3.1 Стандартное сообщение (нормальная загрузка)

```
📷 NEW UPLOAD

📍 Location:
  Lat: 55.7558, Lon: 37.6173
  Accuracy: ±8m, Altitude: 150m
  Address: Красная площадь, Москва, Россия

🕐 Time:
  Taken: 2026-01-15 10:25:30 UTC
  Uploaded: 2026-01-15 10:30:00 UTC
  Duration: 2.3s

📱 Device:
  Model: iPhone 15 Pro
  OS: iOS 17.2
  App: v1.0.0
  Device ID: FP-abc123def456

🌐 Network:
  IP: 192.168.1.1
  Location: Moscow, RU
  ISP: МТС

📊 Photo:
  Size: 3.3 MB
  Resolution: 4032x3024
  Format: JPEG

🔗 Links:
  Public: https://gps.cm/abc123
  R2: [Internal link]
  Deletion: 2026-01-16 10:30:00 UTC (24h)

🛡️ Security:
  NSFW: ✅ Clean (confidence: 98%)
  Rate limit: 3/10 (IP), 5/20 (Device)
  Status: ✅ Normal

[Photo attachment]
```

**Кнопки (inline keyboard):**
```
[🔍 View Full Metadata] [🚫 Block Device] [🚫 Block IP]
[📊 User History] [⚠️ Report] [✅ Mark Safe]
```

### 3.2 Suspicious Activity Alert

```
🚨 SUSPICIOUS UPLOAD

⚠️ Reason: Rate limit exceeded
⚠️ Severity: HIGH

📍 Location:
  Lat: 55.7558, Lon: 37.6173
  Address: Красная площадь, Москва, Россия

📱 Device:
  Device ID: FP-abc123def456
  Recent uploads: 15 in last hour (limit: 10)

🌐 Network:
  IP: 192.168.1.1
  Location: Moscow, RU
  Previous violations: 2

📊 Pattern Analysis:
  Same location: 12/15 uploads
  Radius: 50m
  Uploads/hour: 15 (average: 2)
  Suspicious: YES

🔗 Links:
  Public: https://gps.cm/abc123
  User history: [Internal link]

⚡ Action: Manual review required

[Photo attachment]
```

**Кнопки:**
```
[🚫 Block Immediately] [⏸️ Temporary Ban] [✅ False Positive]
[📊 View Full Pattern] [📞 Contact Authorities]
```

### 3.3 NSFW Detection Alert

```
🔞 NSFW CONTENT DETECTED

⚠️ Severity: CRITICAL
⚠️ Action: Upload blocked automatically

🔍 Detection:
  Confidence: 96%
  Category: Explicit nudity
  AI Service: AWS Rekognition

📍 Location:
  Lat: 55.7558, Lon: 37.6173
  Address: Красная площадь, Москва, Россия

📱 Device:
  Device ID: FP-abc123def456
  Previous violations: 0
  Account created: 2026-01-10

🌐 Network:
  IP: 192.168.1.1
  Location: Moscow, RU

⚡ Actions taken:
  ✅ Upload blocked
  ✅ Device ID added to watchlist
  ✅ IP logged
  ⏳ Awaiting manual review

[Blurred photo preview]
```

**Кнопки:**
```
[🔍 View Unblurred] [🚫 Permanent Ban] [✅ False Positive]
[📞 Report to Authorities] [📝 Add Note]
```

---

## 4. Bot Commands (для администраторов)

### 4.1 Информационные команды

**`/stats [period]`**
- Статистика загрузок за период
- Пример: `/stats today`, `/stats week`, `/stats month`
- Возвращает: количество загрузок, топ регионов, топ устройств

**`/search [query]`**
- Поиск по метаданным
- Примеры:
  - `/search device:FP-abc123def456` — все загрузки с этого устройства
  - `/search ip:192.168.1.1` — все загрузки с этого IP
  - `/search location:Moscow` — все загрузки из Москвы
  - `/search date:2026-01-15` — все загрузки за дату

**`/history [device_id]`**
- История загрузок конкретного устройства
- Пример: `/history FP-abc123def456`
- Возвращает: последние 20 загрузок, паттерны, статистика

**`/pattern [device_id]`**
- Анализ паттернов активности
- Пример: `/pattern FP-abc123def456`
- Возвращает: частота загрузок, радиус активности, подозрительность

### 4.2 Управляющие команды

**`/block device [device_id] [reason]`**
- Блокировка device ID
- Пример: `/block device FP-abc123def456 Repeated NSFW uploads`
- Все будущие загрузки с этого устройства блокируются

**`/block ip [ip_address] [duration] [reason]`**
- Блокировка IP адреса
- Пример: `/block ip 192.168.1.1 24h Rate limit abuse`
- Duration: 1h, 24h, 7d, permanent

**`/unblock device [device_id]`**
- Разблокировка device ID
- Пример: `/unblock device FP-abc123def456`

**`/unblock ip [ip_address]`**
- Разблокировка IP адреса

**`/flag [upload_id] [severity] [note]`**
- Пометить загрузку для расследования
- Severity: low, medium, high, critical
- Пример: `/flag 550e8400 high Possible drug trafficking pattern`

### 4.3 Отчетные команды

**`/report daily`**
- Ежедневный отчет
- Автоматически отправляется каждый день в 9:00 UTC

**`/report suspicious`**
- Отчет по подозрительным активностям за последние 24 часа

**`/export [device_id] [format]`**
- Экспорт данных для правоохранительных органов
- Format: json, csv, pdf
- Пример: `/export FP-abc123def456 pdf`

---

## 5. NSFW Detection

### 5.1 Используемые сервисы

**Основной:** AWS Rekognition
- Content Moderation API
- Detection categories: Explicit Nudity, Suggestive, Violence, Visually Disturbing
- Confidence threshold: 80%

**Резервный:** Google Cloud Vision API
- Safe Search Detection
- Likelihood levels: VERY_UNLIKELY to VERY_LIKELY
- Используется если AWS недоступен

### 5.2 Процесс детекции

```typescript
async function checkNSFW(photoUrl: string): Promise<NSFWResult> {
  try {
    // 1. AWS Rekognition
    const awsResult = await rekognition.detectModerationLabels({
      Image: { R2Object: { Bucket: 'gps-camera', Key: photoUrl } }
    }).promise();

    const isNSFW = awsResult.ModerationLabels?.some(
      label => label.Confidence >= 80 &&
      ['Explicit Nudity', 'Violence', 'Drugs'].includes(label.ParentName)
    );

    return {
      isNSFW,
      confidence: Math.max(...awsResult.ModerationLabels.map(l => l.Confidence)),
      service: 'AWS Rekognition',
      labels: awsResult.ModerationLabels
    };

  } catch (error) {
    // 2. Fallback to Google Vision
    const visionResult = await visionClient.safeSearchDetection(photoUrl);
    const safeSearch = visionResult[0].safeSearchAnnotation;

    const isNSFW =
      safeSearch.adult === 'VERY_LIKELY' ||
      safeSearch.violence === 'VERY_LIKELY' ||
      safeSearch.racy === 'LIKELY';

    return {
      isNSFW,
      service: 'Google Vision',
      safeSearch
    };
  }
}
```

### 5.3 Действия при детекции

**Если NSFW detected (confidence >= 80%):**
1. ✅ Блокировать загрузку (не сохранять в Cloudflare R2)
2. ✅ Отправить alert в `#suspicious` канал
3. ✅ Добавить device ID в watchlist
4. ✅ Логировать IP адрес
5. ✅ Увеличить счетчик нарушений для device/IP
6. ⏳ Ручная проверка администратором

**При повторных нарушениях:**
- 1-е нарушение: Warning, добавление в watchlist
- 2-е нарушение: Temporary ban (24 hours)
- 3-е нарушение: Permanent ban (device ID + IP)

---

## 6. Rate Limiting & Alerts

### 6.1 Лимиты

**IP-based:**
- 10 загрузок в час
- 50 загрузок в день
- 200 загрузок в неделю

**Device-based:**
- 20 загрузок в день
- 100 загрузок в неделю
- 300 загрузок в месяц

### 6.2 Suspicious Patterns

**Что считается подозрительным:**

1. **High frequency:**
   - 5+ загрузок в течение 10 минут
   - 15+ загрузок в час

2. **Same location:**
   - 10+ загрузок в радиусе 50 метров
   - Возможная точка закладки

3. **Time patterns:**
   - Загрузки только ночью (00:00-06:00)
   - Регулярные интервалы (каждые 30 минут)

4. **Geographic patterns:**
   - Загрузки из множества городов за короткий период
   - "Путь" между городами (возможная доставка)

5. **Device switching:**
   - Один IP, разные device ID
   - Возможное использование эмуляторов

### 6.3 Автоматические действия

**При превышении лимитов:**

```typescript
if (uploadsLastHour >= 10) {
  // Soft limit
  await sendAlert({
    channel: '#suspicious',
    severity: 'MEDIUM',
    reason: 'Rate limit warning',
    action: 'Monitor'
  });
}

if (uploadsLastHour >= 15) {
  // Hard limit
  await blockUploads({
    ip: uploadData.ip,
    duration: '1h',
    reason: 'Rate limit exceeded'
  });

  await sendAlert({
    channel: '#suspicious',
    severity: 'HIGH',
    reason: 'Rate limit exceeded - blocked',
    action: 'Manual review required'
  });
}
```

**Pattern detection:**

```typescript
async function detectSuspiciousPattern(deviceId: string): Promise<boolean> {
  const uploads = await getRecentUploads(deviceId, '24h');

  // Same location check
  const locations = uploads.map(u => ({ lat: u.gps.lat, lon: u.gps.lon }));
  const clustered = clusterLocations(locations, radiusMeters: 50);
  if (clustered.some(c => c.count >= 10)) {
    return true; // Suspicious: many uploads in same spot
  }

  // Time pattern check
  const nightUploads = uploads.filter(u => {
    const hour = new Date(u.timestamp).getUTCHours();
    return hour >= 0 && hour < 6;
  });
  if (nightUploads.length / uploads.length > 0.7) {
    return true; // Suspicious: mostly night uploads
  }

  // Frequency check
  const intervals = calculateIntervals(uploads);
  const regularInterval = intervals.every(i => Math.abs(i - 30) < 5); // ~30 min
  if (regularInterval && uploads.length > 10) {
    return true; // Suspicious: regular automated intervals
  }

  return false;
}
```

---

## 7. Data Retention для модерации

### 7.1 Что храним

**В Telegram:**
- Все сообщения в каналах (постоянно)
- История команд администраторов
- Alerts и уведомления

**В PostgreSQL:**
- Метаданные всех загрузок (90 дней)
- Блокировки (постоянно, до снятия)
- Флаги и заметки (постоянно)
- Статистика (анонимизированная, постоянно)

**В Cloudflare R2:**
- Фотографии удаляются согласно scheduled_deletion
- Flagged фото могут храниться дольше (для расследований)

### 7.2 Логи для правоохранительных органов

**Хранение:**
- Полные логи: 90 дней
- Анонимизированные логи: 1 год
- Flagged uploads: до окончания расследования

**Формат экспорта:**
- JSON (для автоматизированной обработки)
- CSV (для анализа в Excel)
- PDF (для отчетов)

**Включает:**
- Все метаданные
- История активности device/IP
- Паттерны и флаги
- Фотографии (если еще не удалены)

---

## 8. Admin Dashboard (будущее)

### 8.1 Планируемые функции (Phase 2+)

**Web-интерфейс для администраторов:**
- Real-time карта загрузок
- Графики статистики
- Поиск и фильтрация
- Управление блокировками
- Экспорт отчетов

**Визуализация паттернов:**
- Heatmap загрузок
- Timeline активности устройства
- Кластеризация подозрительных точек
- Графы связей (device → IP → location)

**Автоматизация:**
- Machine learning для детекции паттернов
- Автоматическая блокировка при критических паттернах
- Прогнозирование подозрительной активности

---

## 9. Безопасность модерационной системы

### 9.1 Доступ к Telegram каналам

**Кто имеет доступ:**
- Product Owner
- Tech Lead
- Designated moderators (2-3 человека)
- Security Officer

**Процедура добавления:**
1. Официальный запрос от руководства
2. Background check
3. NDA подписание
4. Training на работу с конфиденциальной информацией
5. Добавление в каналы

**Процедура удаления:**
- При увольнении — немедленно
- При смене должности — в течение 24 часов
- Регулярный аудит доступов (ежемесячно)

### 9.2 Логирование действий администраторов

**Все действия логируются:**
- Команды бота
- Блокировки/разблокировки
- Просмотр полных метаданных
- Экспорт данных
- Флаги и заметки

**Audit log включает:**
- Timestamp
- Администратор (Telegram username + ID)
- Действие
- Затронутые данные (device ID, IP, upload ID)
- Reason/note

**Retention:** 1 год (для compliance)

---

## 10. Compliance и правовые аспекты

### 10.1 Взаимодействие с правоохранительными органами

**Процедура предоставления данных:**
1. Получение официального запроса
2. Юридическая проверка
3. Сбор запрошенных данных через `/export` команду
4. Предоставление в требуемом формате
5. Логирование факта передачи

**Формат запроса:**
- Официальный бланк ведомства
- Указание device ID, IP, или upload ID
- Временной диапазон
- Цель запроса
- Подпись и печать

### 10.2 Ограничения использования данных

**Модераторы могут:**
- ✅ Просматривать загрузки для выявления нарушений
- ✅ Блокировать device/IP при нарушениях
- ✅ Флаговать подозрительный контент
- ✅ Экспортировать данные для правоохранительных органов

**Модераторы НЕ могут:**
- ❌ Использовать данные в личных целях
- ❌ Делиться данными вне команды
- ❌ Скачивать фото на личные устройства (только просмотр в Telegram)
- ❌ Модифицировать данные (кроме флагов/заметок)
- ❌ Удалять логи

---

## 11. Контакты и эскалация

### 11.1 Внутренние контакты

**Product Owner:**
- Telegram: @product_owner
- Email: po@gps-camera.app
- Эскалация: критические решения

**Tech Lead:**
- Telegram: @tech_lead
- Email: tech@gps-camera.app
- Эскалация: технические проблемы

**Security Officer:**
- Telegram: @security_officer
- Email: security@gps-camera.app
- Эскалация: security incidents

### 11.2 Процедура эскалации

**Severity levels:**

**LOW:**
- False positive NSFW
- Minor suspicious pattern
- Действие: Moderator decision

**MEDIUM:**
- Rate limit violations
- Repeated NSFW attempts
- Действие: Moderator review + notify Security Officer

**HIGH:**
- Clear illegal activity pattern
- Coordinated abuse
- Действие: Immediate escalation to Product Owner + Security Officer

**CRITICAL:**
- Confirmed drug trafficking
- Security breach
- Law enforcement inquiry
- Действие: Immediate escalation to Product Owner + Security Officer + Legal team

---

## 12. Метрики эффективности модерации

### 12.1 KPI

**Detection metrics:**
- ✅ NSFW detection accuracy > 95%
- ✅ False positive rate < 5%
- ✅ Time to detection < 1 minute

**Response metrics:**
- ✅ Time to moderator review < 1 hour (for flagged)
- ✅ Time to block (critical) < 5 minutes
- ✅ Time to law enforcement response < 24 hours

**Coverage metrics:**
- ✅ 100% uploads monitored
- ✅ 0% missed uploads
- ✅ All regions covered

### 12.2 Reporting

**Daily report (автоматический):**
- Total uploads
- NSFW detected
- Rate limit violations
- Blocks issued
- Top regions
- Suspicious patterns

**Weekly review (manual):**
- Trends analysis
- False positives review
- Pattern effectiveness
- Improvements needed

**Monthly audit:**
- Full compliance check
- Moderator actions review
- System performance
- Recommendations

---

**Статус:** ✅ Утверждено
**Дата вступления в силу:** [Дата запуска backend]
**Следующий review:** [Через 3 месяца после запуска]
