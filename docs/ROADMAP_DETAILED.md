# GeoMark — Development Roadmap
## 12-Week Plan to MVP Launch

**Start Date:** Week 1, 2026
**Target Launch:** Week 12, 2026
**Status:** Ready to Start

---

## 🎯 Project Overview

**Goal:** Launch GeoMark (GPS Camera App + Website) на Google Play и App Store за 12 недель.

**Team размер:** 3-4 человека (1 backend, 1-2 frontend, 1 designer)

**Рабочая нагрузка:** 40 часов/неделю на человека

---

## 📅 Timeline Overview

```
Week 1-3:   Foundation (Design + Backend setup)
Week 4-7:   Mobile App Development
Week 8-10:  Website Development
Week 11-12: Testing + Release

Total: 12 weeks до launch
```

---

## 🗓️ Detailed Weekly Breakdown

### **PHASE 1: Foundation (Week 1-3)**

---

#### **Week 1: Design & Planning**

**🎨 Designer:**
- [ ] Создать Figma workspace
- [ ] Design System setup (цвета, типография, компоненты)
- [ ] Мобильные экраны (5 main screens):
  - Camera Screen
  - Gallery Screen
  - Map Screen
  - Photo Detail Screen
  - Settings Screen
- [ ] Prototype flows (Camera → Capture → Gallery)
- [ ] Icon set (Material Icons + custom)
- [ ] Brand assets (logo variations, splash screen)

**💻 Backend Dev:**
- [ ] Проект setup (NestJS 11 + Node.js 20 LTS)
- [ ] Git repo инициализация (Turborepo mono-repo)
- [ ] PostgreSQL + PostGIS database setup
- [ ] Database schema design
- [ ] Cloudflare R2 bucket setup
- [ ] Development environment (Docker Compose)

**📱 Frontend Dev:**
- [ ] Анализ конкурентов (NoteCam, Timestamp Camera)
- [ ] React Native 0.74 project template (EAS)
- [ ] Navigation structure
- [ ] Package manager setup (pnpm)

**Deliverables:**
- ✅ Полный дизайн в Figma (все screens + components)
- ✅ Backend project готов к разработке
- ✅ Mobile project initialized

**Review Meeting:** Friday Week 1 — Demo дизайна команде

---

#### **Week 2: Backend Core**

**💻 Backend Dev:**
- [ ] Photo upload endpoint
  - Multipart form-data parsing
  - File size validation (max 10MB)
  - MIME type check (JPEG, PNG only)
  - GPS coordinates validation
  - IP address extraction
  - Device fingerprinting logic
- [ ] Database models (Prisma ORM)
  - Photos table
  - PhotoMetadata table
  - Indexes (device_id, ip, location, created_at)
- [ ] Cloudflare R2 integration
  - File upload service
  - Signed URL generation
  - Thumbnail storage
- [ ] Rate limiting middleware
  - IP-based (10 uploads/hour)
  - Device-based (20 uploads/day)
- [ ] Error handling & logging (Winston)
- [ ] API testing (Jest + Supertest)

**🎨 Designer:**
- [ ] Web design (Landing page, Upload page, Gallery)
- [ ] Responsive design (Mobile/Tablet/Desktop)
- [ ] Public link viewer design
- [ ] Email templates (если нужно)

**📱 Frontend Dev:**
- [ ] React Native Paper setup (Material Design 3)
- [ ] WatermelonDB setup (offline storage)
- [ ] Camera permission handling
- [ ] GPS permission handling
- [ ] Storage permission handling

**Deliverables:**
- ✅ Working upload API endpoint
- ✅ Database schema implemented
- ✅ Web design готов

**Review:** Friday Week 2 — Test API с Postman

---

#### **Week 3: Telegram Bot & Moderation**

**💻 Backend Dev:**
- [ ] Telegram Bot setup (node-telegram-bot-api)
  - Create bot via BotFather
  - Setup 5 private channels (#moscow, #spb, #russia_other, #foreign, #suspicious)
  - Bot commands (/search, /export, /stats)
- [ ] Region detection (PostGIS spatial queries)
  - Moscow region boundaries
  - St. Petersburg region
  - Russia check
  - Foreign detection
- [ ] Location pattern detection
  - Same location check (50m radius)
  - Regular intervals check (30 min automation)
  - Night activity check (00:00-06:00)
  - Route detection (city-to-city, 500km+)
- [ ] Geocoding service
  - Nominatim integration (OpenStreetMap)
  - Google Maps API fallback
  - Result caching (Redis)
- [ ] Thumbnail generation (Sharp)
  - Resize to 640x480
  - JPEG compression (quality 80)
  - Watermark overlay
- [ ] Auto-deletion cron job
  - Scheduler setup (@nestjs/schedule)
  - Check every 10 minutes
  - Cloudflare R2file deletion
  - Metadata retention logic
  - Anonymization after 90 days

**📱 Frontend Dev:**
- [ ] Theme provider setup (light/dark mode)
- [ ] Navigation structure (Bottom Tabs)
- [ ] Splash screen
- [ ] App icon (Android adaptive icon + iOS icon)

**Deliverables:**
- ✅ Полная система модерации работает
- ✅ Telegram bot отправляет фото по регионам
- ✅ Geocoding работает
- ✅ Auto-deletion тестирован

**Review:** Friday Week 3 — Demo модерации в Telegram

---

### **PHASE 2: Mobile App (Week 4-7)**

---

#### **Week 4: Camera & GPS Implementation**

**📱 Frontend Dev:**
- [ ] react-native-vision-camera 4.x setup
  - Permission requests
  - Camera device selection (back camera)
  - enableLocation (automatic GPS EXIF tags)
  - Photo quality settings
- [ ] GPS tracking service
  - @react-native-community/geolocation
  - Motion detection (accelerometer + gyroscope)
  - High-accuracy GPS when moving
  - Low-power GPS when stationary
  - Battery optimization (80% savings)
- [ ] Camera Screen UI
  - Live preview (full screen)
  - GPS accuracy indicator (color-coded)
  - Capture button (FAB)
  - Settings overlay (translucent)
  - Watermark preview (real-time)
- [ ] EXIF metadata writing
  - GPS coordinates
  - Timestamp
  - Device model
  - App version
- [ ] Local photo capture
  - Save to device gallery
  - Save to app's local database (WatermelonDB)

**💻 Backend Dev:**
- [ ] Public link generation API
  - Short URL service (nanoid)
  - Public viewer endpoint
  - View counter
  - Expiration based on retention period
- [ ] Metadata API endpoints
  - GET /api/photos/:id
  - GET /api/photos (gallery, paginated)
  - DELETE /api/photos/:id

**Deliverables:**
- ✅ Рабочая камера с GPS
- ✅ Фото сохраняются локально
- ✅ Watermark overlay preview

**Review:** Friday Week 4 — Field test GPS accuracy

---

#### **Week 5: Gallery & Map Screens**

**📱 Frontend Dev:**
- [ ] Gallery Screen
  - Photo grid (3 columns, gap 4px)
  - Infinite scroll (TanStack Query)
  - Thumbnail previews
  - Filter chips (Today, Yesterday, Week, Month)
  - Search bar
  - Selection mode (multi-select)
  - Bulk actions (delete, export)
  - Pull-to-refresh
- [ ] Map Screen
  - react-native-maps integration
  - Photo markers
  - Marker clustering (react-native-map-clustering)
  - Custom marker icons
  - On marker press → show photo preview
  - Bottom sheet (photo detail)
  - Search location (autocomplete)
  - Map type switcher (standard, satellite, terrain)
- [ ] Photo Detail Screen
  - Hero image (zoomable, pinch-to-zoom)
  - Metadata cards (collapsible)
    - Location (address + coordinates)
    - Timestamp
    - Device info
    - GPS accuracy
  - Mini map
  - Share button
  - Delete button
  - Edit button (future)

**Deliverables:**
- ✅ Gallery работает (pagination, filters)
- ✅ Map отображает все фото
- ✅ Photo detail screen полностью функционален

**Review:** Friday Week 5 — Demo навигации

---

#### **Week 6: Upload & Sync**

**📱 Frontend Dev:**
- [ ] Upload service
  - Photo upload to server API
  - Thumbnail generation (client-side)
    - react-native-image-resizer
    - 640x480 max size
  - Multipart form-data
  - Progress tracking
  - Metadata extraction (IP, device, GPS)
- [ ] Offline queue
  - WatermelonDB queue table
  - Background sync (react-native-background-fetch)
  - Retry logic (exponential backoff: 1s, 2s, 4s, 8s, 16s)
  - Max 5 retries
  - Persist queue on app close
  - Network state listener
  - Auto-sync when online
- [ ] Upload UI
  - Progress indicator (circular)
  - Upload success animation
  - Upload failed state
  - Retry button
  - Snackbar notifications
- [ ] Error handling
  - Network error → retry
  - Server 5xx → retry
  - 413 Too Large → immediate fail (show error)
  - 401/403 → immediate fail
  - Timeout → retry

**💻 Backend Dev:**
- [ ] WebSocket support (для real-time upload progress)
- [ ] Batch upload endpoint (если нужно)

**Deliverables:**
- ✅ Загрузка на сервер работает
- ✅ Офлайн очередь функционирует
- ✅ Retry logic тестирован

**Review:** Friday Week 6 — Test offline mode

---

#### **Week 7: Settings & Polish**

**📱 Frontend Dev:**
- [ ] Settings Screen
  - Profile section (анонимный, только device ID)
  - Camera settings
    - Photo quality (Low, Medium, High, Maximum)
    - Watermark style (Full, Compact, None)
    - GPS precision (Best, Balanced, Low Power)
  - Auto-delete settings
    - Default retention (1h, 24h, 7d, Forever)
    - Radio group UI
  - Appearance
    - Theme (Auto, Light, Dark)
    - Dark mode toggle
  - Privacy
    - Privacy Policy (WebView)
    - Terms of Service
    - Data collection info
  - About
    - App version
    - Rate app (link to stores)
    - Support email
- [ ] Onboarding flow
  - Welcome screen
  - Permission requests (Camera, GPS, Storage)
  - Privacy Policy acceptance
  - Feature highlights (3-4 screens)
  - Skip button
- [ ] Material Design 3 polish
  - Dynamic theming (Material You on Android 12+)
  - Elevation shadows
  - Ripple effects
  - State layers
  - Transitions (page, modal)
  - Loading states (skeleton loaders)
- [ ] Error boundaries
- [ ] Crash reporting (Sentry)

**Deliverables:**
- ✅ Settings работают
- ✅ Onboarding flow готов
- ✅ App выглядит красиво (Material Design 3)
- ✅ MVP mobile app ГОТОВ!

**Review:** Friday Week 7 — Full app demo

---

### **PHASE 3: Website (Week 8-10)**

---

#### **Week 8: Core Web Pages**

**🌐 Web Dev (Frontend):**
- [ ] Next.js 15 project setup
  - App Router
  - TypeScript 5.0+
  - Tailwind CSS 4.0
  - shadcn/ui components
  - ESLint + Prettier
- [ ] Landing Page
  - Hero section (headline, CTA buttons)
  - Features showcase (3-4 features)
  - How it works (3 steps)
  - Screenshots carousel
  - Download buttons (Google Play, App Store)
  - Footer (links, social)
- [ ] Upload Page (/upload)
  - Drag & drop zone (react-dropzone)
  - File validation (size, type)
  - EXIF extraction (exifr library)
    - Auto-detect GPS from EXIF
  - Manual GPS picker (map click)
    - Mapbox/Leaflet integration
  - Watermark preview (canvas)
  - Upload progress bar
  - Success/Error states
- [ ] PWA configuration
  - next-pwa setup
  - manifest.json
  - Service worker
  - Offline fallback page
  - Install prompt (Add to Home Screen)
  - Icon sizes (192x192, 512x512)

**💻 Backend Dev:**
- [ ] CORS configuration (allow website domain)
- [ ] API optimization (response time < 200ms)

**Deliverables:**
- ✅ Landing page live
- ✅ Upload работает через web
- ✅ PWA installable

**Review:** Friday Week 8 — Test upload from web

---

#### **Week 9: Gallery & Public Viewer**

**🌐 Web Dev:**
- [ ] Gallery Page (/gallery)
  - Photo grid (responsive: 1/2/3/4 columns)
  - Filters (date range, location)
  - Search (by address)
  - Pagination (infinite scroll)
  - Lightbox (photo viewer)
  - Bulk actions (delete, download)
  - Export options (ZIP, CSV)
- [ ] Map View Page (/map)
  - Interactive map (Mapbox GL JS / Leaflet)
  - Photo markers
  - Clustering
  - Marker click → photo preview (popup)
  - Filter by date range
  - Search location
- [ ] Public Link Viewer (/p/[id])
  - Photo display (responsive)
  - Mini map (static or interactive)
  - Metadata panel
    - Location (address + coordinates)
    - Timestamp
    - View count
  - Share buttons
    - Copy link
    - Share to Telegram/WhatsApp/Twitter
    - QR code (для мобильного сканирования)
  - Embed code (iframe для вставки на сайты)
  - Mobile-optimized

**Deliverables:**
- ✅ Gallery функционирует
- ✅ Map view работает
- ✅ Public link viewer красиво показывает фото

**Review:** Friday Week 9 — Demo публичной ссылки

---

#### **Week 10: Design & UX Polish**

**🌐 Web Dev:**
- [ ] shadcn/ui components integration
  - Button variants
  - Card components
  - Input fields
  - Modal dialogs
  - Toast notifications
  - Dropdown menus
- [ ] Tailwind CSS styling
  - Responsive design (mobile/tablet/desktop)
  - Dark mode support
  - Custom animations (Framer Motion)
  - Hover states
  - Focus states (accessibility)
- [ ] Loading states
  - Skeleton loaders
  - Spinners
  - Progress bars
  - Placeholder content
- [ ] Error pages
  - 404 Not Found
  - 500 Server Error
  - Network Error
  - Empty states
- [ ] SEO optimization
  - Meta tags (title, description)
  - Open Graph (og:image для sharing)
  - Structured data (Schema.org)
  - Sitemap.xml
  - robots.txt
- [ ] Performance optimization
  - Image optimization (Next.js Image)
  - Code splitting
  - Lazy loading
  - Font optimization
  - Lighthouse score > 90

**Deliverables:**
- ✅ Сайт выглядит потрясающе
- ✅ Responsive на всех устройствах
- ✅ Lighthouse score > 90

**Review:** Friday Week 10 — Final design review

---

### **PHASE 4: Testing & Release (Week 11-12)**

---

#### **Week 11: Testing**

**🧪 QA + Team:**
- [ ] Unit tests
  - Backend API (Jest)
    - Photo upload endpoint
    - Rate limiting
    - Pattern detection
    - Auto-deletion
  - Mobile app (Jest + React Native Testing Library)
    - Camera service
    - GPS tracking
    - Upload queue
  - Web (Vitest)
    - Upload form
    - Gallery filters
    - EXIF extraction
- [ ] Integration tests
  - Backend E2E (Supertest)
    - Upload flow
    - Public link generation
    - Telegram bot sending
  - Mobile E2E (Detox)
    - Camera → Capture → Upload
    - Gallery browsing
    - Map navigation
  - Web E2E (Playwright)
    - Upload flow
    - Public link sharing
- [ ] Manual testing
  - GPS accuracy testing (field tests: outdoor, indoor, moving, stationary)
  - Offline mode testing (airplane mode, no internet)
  - Battery consumption testing (24h monitoring)
  - Different devices (Android 12+, iOS 15+)
  - Different screen sizes
  - Dark mode testing
  - Permissions testing
- [ ] Performance testing
  - Backend load testing (k6 / Artillery)
    - 100 concurrent uploads
    - 1000 requests/sec
  - Mobile performance (React Native Performance)
    - Launch time < 2s
    - Camera open < 1s
    - Photo capture < 2s
  - Web performance (Lighthouse)
    - FCP < 1.5s
    - LCP < 2.5s
    - TTI < 3.5s
- [ ] Security audit
  - OWASP Top 10 checks
  - API security (rate limiting, input validation)
  - SQL injection tests
  - XSS tests
  - CSRF protection
  - Dependency vulnerabilities (npm audit)

**🐛 Bug Fixing:**
- [ ] Критические баги (Priority 1)
- [ ] Высокоприоритетные (Priority 2)
- [ ] Средние (Priority 3, если время позволяет)

**Deliverables:**
- ✅ Все тесты проходят
- ✅ No critical bugs
- ✅ Performance targets met

**Review:** Friday Week 11 — Bug triage meeting

---

#### **Week 12: Release Preparation**

**📱 Mobile Release Prep:**
- [ ] App Store assets
  - Screenshots (6.5" iPhone, 12.9" iPad)
  - App Preview video (30s)
  - App description (4000 chars)
  - Keywords
  - Subtitle (30 chars)
  - Promotional text
  - Support URL
  - Marketing URL
  - Privacy Policy URL
- [ ] Google Play assets
  - Screenshots (Phone: 1080x1920, Tablet: 1600x2560)
  - Feature graphic (1024x500)
  - App description (Short: 80 chars, Full: 4000 chars)
  - Category (Photography)
  - Content rating (questionnaire)
  - Target audience & content
  - Data safety form (GPS, IP, device ID)
  - Privacy Policy URL
  - App icon (512x512)
- [ ] Build & Sign
  - iOS: Xcode Archive + Upload to App Store Connect
  - Android: AAB (App Bundle) + Sign with release key
  - Versioning: 1.0.0 (build 1)
- [ ] App Store submission (iOS)
  - TestFlight beta testing (опционально)
  - Submit for review
  - Expected review time: 24-48 hours
- [ ] Google Play submission
  - Internal testing track (опционально)
  - Production release
  - Staged rollout: 10% → 50% → 100%

**🌐 Website Deployment:**
- [ ] Domain setup
  - Register geomark.app
  - DNS configuration
  - SSL certificate
- [ ] Vercel deployment
  - Connect GitHub repo
  - Environment variables
  - Production build
  - Custom domain
  - Analytics setup
- [ ] Monitoring setup
  - Sentry (errors)
  - Datadog / CloudWatch (performance)
  - Google Analytics (traffic)
  - Uptime monitoring (UptimeRobot)

**📄 Documentation:**
- [ ] Privacy Policy финализация
- [ ] Terms of Service
- [ ] Data Safety disclosure
- [ ] API documentation (если Public API)
- [ ] User guide (FAQ)

**🚀 Launch:**
- [ ] Pre-launch checklist
  - All tests passing ✅
  - Privacy Policy live ✅
  - Monitoring enabled ✅
  - Support email setup ✅
- [ ] LAUNCH! 🎉
  - App Store: Submit for review
  - Google Play: Publish to production
  - Website: Deploy to Vercel
  - Telegram: Announce in channels
  - Social media: Post launch announcement

**Deliverables:**
- ✅ LIVE in App Store!
- ✅ LIVE in Google Play!
- ✅ Website LIVE!

**Celebration:** Friday Week 12 — 🎉 Launch Party!

---

## 📊 Success Criteria (Week 12+)

### Technical KPIs:
- ✅ App size < 40MB
- ✅ Launch time < 2 sec
- ✅ GPS accuracy < 10m (outdoor)
- ✅ Battery drain < 2%/day
- ✅ Crash rate < 1%
- ✅ Upload success rate > 95%
- ✅ Website Lighthouse score > 90

### Business KPIs (First Month):
- 🎯 1,000+ total installs (iOS + Android)
- 🎯 4.0+ star rating
- 🎯 20%+ retention (7 days)
- 🎯 50+ daily active users
- 🎯 100+ public links created

### Security KPIs:
- ✅ Location pattern detection working
- ✅ Zero data breaches
- ✅ Privacy compliance (GDPR + РФ)
- ✅ Rate limiting effective (no abuse)

---

## 💰 Budget Estimate

### Infrastructure (Monthly):
| Service | Cost | Notes |
|---------|------|-------|
| Backend Hosting | $20-40 | Railway/Render |
| Database | $15-25 | Supabase/Neon |
| Storage (R2) | $5-15 | 100GB + bandwidth |
| Redis Cache | $5-10 | Upstash |
| Geocoding API | $0-10 | Nominatim free + Google fallback |
| Monitoring | $0-10 | Sentry free tier |
| Domain | $1 | geomark.app |
| **Total** | **$46-111/mo** | |

### One-time Costs:
| Item | Cost |
|------|------|
| Apple Developer Account | $99/year |
| Google Play Console | $25 one-time |
| **Total** | **$124** |

---

## ✅ Готовность к старту!

**Всё готово для начала разработки:**
- ✅ Полная документация (PRD, Design System, Implementation Plan)
- ✅ Детальная roadmap (12 недель)
- ✅ Дизайн-система определена
- ✅ Стек технологий выбран (современный, 2026)
- ✅ Бюджет просчитан
- ✅ Риски учтены

**Следующий шаг:** Week 1 Day 1 — Создать Figma workspace!

---

**Let's ship it!** 🚀

**Sources:**
- [NoteCam Lite on Google Play](https://play.google.com/store/apps/details?id=com.derekr.NoteCam)
- [Mobile App Design Trends 2026](https://uxpilot.ai/blogs/mobile-app-design-trends)
- [React Native Best Practices 2026](https://medium.com/@lucina12/react-native-in-2026-advanced-patterns-best-practices-future-proof-development-6a9982c3f580)
- [VisionCamera GPS Integration](https://react-native-vision-camera.com/docs/guides/location)
