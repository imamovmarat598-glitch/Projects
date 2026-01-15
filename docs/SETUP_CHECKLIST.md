# GeoMark — Setup Checklist перед разработкой
## Критические шаги для запуска проекта

**Дата:** 15 января 2026
**Статус:** ⚠️ ОБЯЗАТЕЛЬНО выполнить перед Week 1

---

## 🔴 КРИТИЧЕСКИЕ ДЕЙСТВИЯ (Week 0 — ДО начала разработки)

### 1. ✅ Регистрация домена (СРОЧНО!)

**Почему критично:** App Store и Google Play ТРЕБУЮТ действующий Privacy Policy URL для публикации.

#### Шаг 1: Выбрать и зарегистрировать домен

**Рекомендуемые домены:**
- **geomark.app** (основной вариант) — $12-15/год
- **geomark.io** (запасной) — $35/год
- **gps-camera.app** (альтернатива) — $12-15/год

**Где регистрировать:**
- [Namecheap](https://www.namecheap.com) — дешево, надёжно
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) — at-cost pricing
- [Google Domains](https://domains.google) (переходит в Squarespace)

**Действия:**
```bash
1. Перейти на Namecheap.com
2. Поиск "geomark.app"
3. Добавить в корзину
4. Оплатить (~$12/год)
5. Настроить DNS (см. ниже)
```

#### Шаг 2: Временное размещение Privacy Policy (GitHub Pages)

**Пока домен не готов, используем бесплатный GitHub Pages:**

```bash
# 1. Создать repo
cd ~/Projects
mkdir geomark-legal
cd geomark-legal
git init

# 2. Создать index.html с Privacy Policy
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>GeoMark Privacy Policy</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #00796B; }
    h2 { color: #004D40; margin-top: 32px; }
  </style>
</head>
<body>
  <h1>GeoMark — Privacy Policy</h1>
  <p><strong>Effective Date:</strong> January 15, 2026</p>

  <!-- Вставить содержимое из PRIVACY_POLICY.md -->

</body>
</html>
EOF

# 3. Создать gh-pages branch
git checkout -b gh-pages
git add index.html
git commit -m "Add Privacy Policy"
git push origin gh-pages

# 4. Включить GitHub Pages в Settings
# Repo → Settings → Pages → Source: gh-pages branch → Save
```

**Временный URL:** `https://yourusername.github.io/geomark-legal`

**После покупки домена:**
- Настроить CNAME: `privacy.geomark.app` → GitHub Pages
- Обновить App Store/Google Play URLs

---

### 2. ✅ Консультация с юристом (ОБЯЗАТЕЛЬНО!)

**Почему критично:** GDPR штрафы до €20M, ФЗ-152 штрафы до 500,000₽.

#### Что обсудить с юристом:

**1. Metadata Retention после удаления фото**

**Текущая проблема:**
```
Пользователь нажимает "Удалить фото" →
Фото удаляется, НО GPS + IP + device ID остаются 90 дней
```

**GDPR Article 17 (Right to erasure):** Пользователь имеет право на ПОЛНОЕ удаление данных.

**Вопросы юристу:**
- Можем ли мы хранить метаданные после удаления фото для "legitimate interests" (безопасность)?
- Нужно ли получать отдельное согласие на хранение метаданных?
- Как правильно сформулировать в Privacy Policy?

**Рекомендуемое решение (безопасное):**

**Вариант A:** Полное удаление (безопасный)
```
Пользователь выбирает "Удалить" → Удаляется ВСЁ (фото + метаданные)
```

**Вариант B:** Retention с согласием (рискованный)
```typescript
// При первом запуске приложения
const privacyConsent = await showDialog({
  title: 'Privacy Notice',
  message: `
    For security purposes, we retain photo metadata (GPS coordinates,
    IP address, device info) for 90 days after photo deletion to detect
    abuse patterns.

    Your actual photo is deleted immediately.

    Do you consent to metadata retention?
  `,
  buttons: ['I Agree', 'I Decline'],
});

if (!privacyConsent) {
  // User declines → full deletion (фото + метаданные)
  // Or don't allow app usage
}
```

**Действия:**
1. Найти юриста по GDPR/ФЗ-152 (можно онлайн консультацию)
2. Получить письменное мнение
3. Обновить SECURITY_PRIVACY.md на основе рекомендаций

**Стоимость:** $200-500 за консультацию (обязательная инвестиция!)

---

**2. GDPR Data Protection Officer (DPO)**

**Вопрос юристу:**
- Требуется ли DPO для нашего проекта?
- Если да, кого назначить (можно внешнего)?

**Факторы:**
- Обрабатываем "special categories of data" (геоданные)
- Масштаб: планируем > 10,000 пользователей
- Вероятно, **ДА, требуется DPO**

**Решение:**
- Внешний DPO-консультант (€100-300/месяц)
- Или сами, если < 250 сотрудников (смотреть GDPR Article 37)

---

**3. Liability за контент пользователей**

**Риск:** Пользователи загружают NSFW/illegal content через ваше приложение.

**Вопросы юристу:**
- Какая ответственность у платформы?
- Нужен ли DMCA agent? (для США)
- Как правильно написать ToS disclaimer?

**Рекомендуемый ToS текст:**
```
You are solely responsible for the content you upload.
We prohibit illegal, harmful, or offensive content.
We reserve the right to remove content and ban users who violate these terms.
```

---

### 3. ✅ Выбор окончательного названия

**Текущая проблема:** Документы используют разные названия:
- GeoMark
- GPS Camera App
- GeoMark — GPS Camera

**РЕШЕНИЕ (рекомендуемое):**

**Официальное название:**
- **App Store / Google Play:** "GeoMark: GPS Camera"
- **Package name (Android):** `app.geomark.camera`
- **Bundle ID (iOS):** `app.geomark.camera`
- **Domain:** `geomark.app`
- **Короткое имя:** "GeoMark"

**Tagline:** "GPS Camera with Location Tracking"

**Обновить в документах:**
- [ ] PRD.md (везде заменить на "GeoMark")
- [ ] DESIGN_SYSTEM.md
- [ ] WEBSITE_SPEC.md
- [ ] package.json, AndroidManifest.xml, Info.plist

---

### 4. ✅ Пересчёт бюджета (Cloudflare R2 + Geocoding)

**Текущая проблема:** Budget недооценён в 3-5 раз.

#### Реальные расчёты для 1,000 активных пользователей:

**Cloudflare R2 Storage:**
- 1 user × 10 photos/month × 3MB = 30MB/user/month
- 1,000 users × 30MB = 30GB/month
- Retention: average 3 months → 90GB total
- **Cost:** 90GB × $0.023/GB = **$2.07/month**

**R2 Bandwidth (egress):**
- Public links: 100 views/day × 3MB thumbnail (100KB) = 10MB/day = 3GB/month
- **Cost:** 3GB × $0.09/GB = **$0.27/month**

**Geocoding API:**
- Google Geocoding: $5 per 1000 requests
- 1,000 users × 10 uploads/month = 10,000 requests/month
- Cache hit rate 70% → 3,000 actual requests
- **Cost:** 3,000 / 1000 × $5 = **$15/month**

**Total Storage + Geocoding:** $17.34/month (vs старая оценка $5-15/month)

#### При росте до 10,000 users:

- Cloudflare R2 Storage: 900GB × $0.023 = $20.70/month
- R2 Bandwidth: 30GB × $0.09 = $2.70/month
- Geocoding: 30,000 requests (с кэшем) = $150/month
- **Total:** **$173.40/month**

#### Оптимизации:

1. **Агрессивное кэширование geocoding:**
   ```typescript
   // Cache by rounded coordinates (100m radius)
   const cacheKey = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
   // lat: 55.7558123 → 55.756
   // Все координаты в радиусе ~100m используют один cache
   ```
   **Savings:** $150 → $30-50/month (70-80% cache hit rate)

2. **Thumbnail для public links:**
   ```
   Full photo: 3MB
   Thumbnail: 100KB
   Savings: 30x меньше bandwidth
   ```

3. **CDN (Cloudflare):**
   ```
   Cloudflare R2: $0.015/GB (vs AWS S3 $0.023/GB)
   Bandwidth: FREE (vs AWS S3 $0.09/GB)
   Savings: ~50% на storage, 100% на bandwidth
   ```

**Обновлённый budget (с оптимизациями):**

| Service | 1K users | 10K users | 100K users |
|---------|----------|-----------|------------|
| Storage (R2) | $1.35 | $13.50 | $135 |
| Bandwidth (R2) | $0 | $0 | $0 |
| Geocoding | $5 | $50 | $500 |
| Backend Hosting | $20 | $40 | $100 |
| Database | $15 | $25 | $100 |
| **Total** | **$41/mo** | **$128/mo** | **$835/mo** |

**Рекомендация:** Использовать Cloudflare R2 вместо AWS S3.

---

### 5. ✅ Geocoding Strategy (выбрать СЕЙЧАС)

**Варианты:**

#### Вариант A: Google Geocoding API
**Pros:**
- Высокая точность
- Worldwide coverage
- Reliable

**Cons:**
- **$5 per 1000 requests** (дорого)
- Rate limits: 50 req/sec

**Best for:** Production с платными пользователями

---

#### Вариант B: Nominatim (OpenStreetMap)
**Pros:**
- **БЕСПЛАТНО**
- Open source
- Self-hostable

**Cons:**
- Strict rate limits: **1 req/sec** (usage policy)
- Требует User-Agent header
- Менее точный чем Google

**Best for:** MVP, low traffic

**Usage Policy:**
```
Nominatim Usage Policy:
- Max 1 request per second
- Provide valid User-Agent: "GeoMark/1.0 (contact@geomark.app)"
- No heavy use (enforce caching!)
```

---

#### Вариант C: Hybrid (РЕКОМЕНДУЕМЫЙ для MVP)

```typescript
async function geocode(lat: number, lon: number): Promise<string> {
  // 1. Check cache
  const cached = await redis.get(`geo:${lat.toFixed(3)}_${lon.toFixed(3)}`);
  if (cached) return cached;

  // 2. Try Nominatim first (free)
  try {
    const nominatimResult = await fetchNominatim(lat, lon);
    await redis.setex(`geo:${lat.toFixed(3)}_${lon.toFixed(3)}`, 86400 * 30, nominatimResult);
    return nominatimResult;
  } catch (error) {
    // 3. Fallback to Google (paid, но reliable)
    const googleResult = await fetchGoogleGeocoding(lat, lon);
    await redis.setex(`geo:${lat.toFixed(3)}_${lon.toFixed(3)}`, 86400 * 30, googleResult);
    return googleResult;
  }
}
```

**Cost savings:** ~90% requests to Nominatim (free) → 10% to Google fallback

---

### 6. ✅ Device Fingerprinting (Apple Guidelines Compliant)

**Текущая проблема:** PRD использует fingerprinting, который нарушает Apple Guidelines.

#### Apple App Store Review Guideline 2.5.13:
> "Apps may not use or transmit device fingerprints for user identification or device tracking."

**Что ЗАПРЕЩЕНО на iOS:**
- Canvas fingerprinting
- WebGL fingerprinting
- Browser fingerprinting (screen resolution, fonts, etc.)
- Hardware fingerprinting (CPU, GPU)

**Что РАЗРЕШЕНО на iOS:**
- `identifierForVendor` (IDFV) — уникален для app developer
- `advertisingIdentifier` (IDFA) — требует ATT permission

#### Исправленная стратегия:

**iOS (Apple Guidelines compliant):**
```swift
import UIKit

func getDeviceIdentifier() -> String {
    // IDFV — разрешено Apple
    let idfv = UIDevice.current.identifierForVendor?.uuidString ?? UUID().uuidString

    // Дополнительный контекст (не для tracking!)
    let deviceModel = UIDevice.current.model // "iPhone"
    let osVersion = UIDevice.current.systemVersion // "17.2"

    // Combined ID (хранится в Keychain)
    let storedID = Keychain.shared.get("device_id")
    if let stored = storedID {
        return stored
    }

    let newID = "\(idfv)_\(deviceModel)_\(osVersion)"
    Keychain.shared.set("device_id", newID)
    return newID
}
```

**Android (более гибко):**
```kotlin
fun getDeviceIdentifier(): String {
    val prefs = context.getSharedPreferences("geomark", Context.MODE_PRIVATE)
    var deviceId = prefs.getString("device_id", null)

    if (deviceId == null) {
        // Installation ID (меняется при переустановке — это ОК)
        val androidId = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ANDROID_ID
        )

        val deviceModel = Build.MODEL
        val osVersion = Build.VERSION.RELEASE

        deviceId = "$androidId-$deviceModel-$osVersion"
        prefs.edit().putString("device_id", deviceId).apply()
    }

    return deviceId
}
```

**Web (минимальный fingerprint):**
```typescript
function getWebDeviceId(): string {
  let deviceId = localStorage.getItem('geomark_device_id');

  if (!deviceId) {
    // Только базовые параметры (не canvas, не WebGL!)
    const basic = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    deviceId = hashBasicFingerprint(basic);
    localStorage.setItem('geomark_device_id', deviceId);
  }

  return deviceId;
}
```

**ВАЖНО:** Обновить PRD.md секцию 2.2.7 с этой стратегией.

---

### 7. ✅ Tech Stack Unification

**Проблема:** Разные документы упоминают разные технологии.

#### Единый Tech Stack (финальная версия):

**Mobile App:**
```yaml
Framework: React Native 0.74
Language: TypeScript 5.0+
Camera: react-native-vision-camera 4.x
GPS: @react-native-community/geolocation
Maps: react-native-maps
Storage: WatermelonDB
State: Zustand + TanStack Query
UI: React Native Paper (Material Design 3)
Navigation: React Navigation 7
Build: EAS (Expo Application Services)
```

**Website:**
```yaml
Framework: Next.js 15 (App Router)
Language: TypeScript 5.0+
Styling: Tailwind CSS 4.0
Components: shadcn/ui
Maps: Mapbox GL JS
PWA: next-pwa
Forms: React Hook Form + Zod
Deployment: Vercel
```

**Backend:**
```yaml
Framework: NestJS 11
Language: TypeScript 5.0+
Database: PostgreSQL 16 + PostGIS 3.4
ORM: Prisma 5.x
Storage: Cloudflare R2 (not AWS S3!)
Cache: Redis 7 (Upstash)
Queue: Bull MQ
Geocoding: Nominatim + Google fallback
Thumbnails: Sharp
Telegram: node-telegram-bot-api
Monitoring: Sentry
Deployment: Railway / Render
```

**Обновить документы:**
- [ ] IMPLEMENTATION_PLAN.md
- [ ] ROADMAP_DETAILED.md
- [ ] PRD.md

---

### 8. ✅ Backend API Specification (OpenAPI 3.0)

Создам отдельный файл `API_SPEC.yaml` с полной спецификацией.

---

## 📋 Регистрации и Setup (что нужно зарегистрировать)

### Аккаунты для разработки:

#### 1. **Apple Developer Account** (обязательно для iOS)
- URL: https://developer.apple.com
- Стоимость: $99/год
- Что даёт: публикация в App Store, TestFlight, push notifications
- **Регистрация:**
  1. Перейти на developer.apple.com
  2. Sign up with Apple ID
  3. Pay $99/year
  4. Подождать ~24-48 часов verification

#### 2. **Google Play Console** (обязательно для Android)
- URL: https://play.google.com/console
- Стоимость: $25 one-time
- Что даёт: публикация в Google Play, internal testing
- **Регистрация:**
  1. Перейти на play.google.com/console
  2. Sign up with Google Account
  3. Pay $25 one-time fee
  4. Verification instant

#### 3. **GitHub Account** (для кода)
- URL: https://github.com
- Стоимость: Free (или Pro $4/месяц)
- **Setup:**
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your@email.com"
  ```

#### 4. **Vercel Account** (для website hosting)
- URL: https://vercel.com
- Стоимость: Free tier (достаточно для MVP)
- **Setup:**
  1. Sign up with GitHub
  2. Connect repository
  3. Auto-deploy on push

#### 5. **Cloudflare Account** (для R2 storage + CDN)
- URL: https://cloudflare.com
- Стоимость: Free tier + R2 pay-as-you-go
- **Setup:**
  1. Sign up
  2. Add domain (geomark.app)
  3. Enable R2 storage

#### 6. **Railway / Render Account** (для backend hosting)
- URL: https://railway.app или https://render.com
- Стоимость: $5-20/месяц
- **Рекомендация:** Railway (проще для начинающих)

#### 7. **Upstash Account** (для Redis cache)
- URL: https://upstash.com
- Стоимость: Free tier (10K requests/day)
- **Setup:**
  1. Sign up
  2. Create Redis database
  3. Copy connection URL

#### 8. **Supabase / Neon Account** (для PostgreSQL)
- URL: https://supabase.com или https://neon.tech
- Стоимость: Free tier
- **Рекомендация:** Neon (быстрее startup)

#### 9. **Sentry Account** (для error tracking)
- URL: https://sentry.io
- Стоимость: Free tier (5K errors/month)
- **Setup:**
  1. Sign up
  2. Create project (React Native + NestJS)
  3. Copy DSN keys

#### 10. **Telegram Bot** (для модерации)
- URL: https://t.me/BotFather
- Стоимость: Free
- **Setup:**
  ```
  1. Открыть Telegram
  2. Найти @BotFather
  3. /newbot
  4. Назвать бота: GeoMarkModBot
  5. Скопировать API token
  6. Создать 5 private каналов (#moscow, #spb, etc.)
  7. Добавить бота в каналы как admin
  ```

---

## ✅ Week 0 Checklist (перед началом разработки)

### День 1-2: Регистрации
- [ ] Зарегистрировать домен `geomark.app` на Namecheap
- [ ] Создать GitHub repo для Privacy Policy
- [ ] Deploy Privacy Policy на GitHub Pages
- [ ] Зарегистрировать Apple Developer Account ($99)
- [ ] Зарегистрировать Google Play Console ($25)

### День 3: Юридическая консультация
- [ ] Найти юриста по GDPR/ФЗ-152
- [ ] Консультация по metadata retention
- [ ] Получить письменное мнение
- [ ] Обновить SECURITY_PRIVACY.md

### День 4: Infrastructure Setup
- [ ] Cloudflare Account + R2 storage
- [ ] Railway/Render Account
- [ ] Neon/Supabase PostgreSQL
- [ ] Upstash Redis
- [ ] Sentry error tracking
- [ ] Telegram Bot creation

### День 5: Финализация документов
- [ ] Обновить PRD.md (device fingerprinting)
- [ ] Создать OpenAPI спецификацию (API_SPEC.yaml)
- [ ] Создать Privacy Policy (PRIVACY_POLICY.md)
- [ ] Создать Terms of Service (TERMS_OF_SERVICE.md)
- [ ] Унифицировать tech stack во всех документах

### День 6-7: Design
- [ ] Создать Figma workspace
- [ ] Design System components
- [ ] Mobile app screens (5 экранов)
- [ ] Website pages (4 страницы)
- [ ] Brand assets (logo, icon, splash)

---

## 🎯 Ready to Start Checklist

**Проверьте перед Week 1:**

✅ Домен зарегистрирован и настроен
✅ Privacy Policy доступен по URL
✅ Apple Developer Account active
✅ Google Play Console active
✅ Юридическая консультация получена
✅ Infrastructure аккаунты созданы
✅ Telegram Bot настроен
✅ Документация обновлена (device fingerprinting, API spec)
✅ Tech stack унифицирован
✅ Figma design готов

**Если всё ✅ — можно начинать Week 1!**

---

**Estimated cost для setup:** $124 (Apple $99 + Google Play $25) + $200-500 (юрист)
**Total:** ~$400-650 one-time

**Estimated time:** 5-7 дней (Week 0)

---

**Next Step:** После завершения Week 0 → переходим к [ROADMAP_DETAILED.md Week 1](./ROADMAP_DETAILED.md)
