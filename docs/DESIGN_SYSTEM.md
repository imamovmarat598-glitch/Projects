# GeoMark Design System
## Material Design 3 для Mobile & Web

**Версия:** 1.0
**Дата:** 15 января 2026
**Платформы:** Android, iOS, Web

---

## 🎨 Философия дизайна

### Принципы:

1. **Адаптивность** — Material You dynamic theming
2. **Clarity** — Чёткая визуальная иерархия
3. **Efficiency** — Быстрый доступ к функциям
4. **Beauty** — Современный, приятный интерфейс

### Вдохновение:

- **Google Photos** — галерея и карта
- **Google Maps** — навигация по карте
- **Telegram** — чистота и скорость
- **Apple Camera** — minimal camera UI

---

## 🎨 Цветовая палитра

### Primary Color (Teal)

```css
/* Light Theme */
--primary-main: #00796B        /* Teal 700 */
--primary-light: #48A999       /* Teal 400 */
--primary-dark: #004D40        /* Teal 900 */
--on-primary: #FFFFFF

/* Dark Theme */
--primary-main: #26A69A        /* Teal 400 */
--primary-light: #64D8CB
--primary-dark: #00796B        /* Teal 700 */
--on-primary: #000000
```

**Использование:** Buttons, FAB, Active states, Links

### Secondary Color (Amber)

```css
/* Light Theme */
--secondary-main: #FFA000      /* Amber 700 */
--secondary-light: #FFCA28     /* Amber 400 */
--secondary-dark: #FF6F00      /* Amber 900 */
--on-secondary: #000000

/* Dark Theme */
--secondary-main: #FFCA28      /* Amber 400 */
--secondary-light: #FFE082
--secondary-dark: #FFA000      /* Amber 700 */
--on-secondary: #000000
```

**Использование:** Accents, Highlights, Warning states

### Background & Surface

```css
/* Light Theme */
--background: #FAFAFA          /* Grey 50 */
--surface: #FFFFFF
--surface-variant: #F5F5F5     /* Grey 100 */

/* Dark Theme */
--background: #121212
--surface: #1E1E1E
--surface-variant: #2C2C2C
```

### Text Colors

```css
/* Light Theme */
--text-primary: rgba(0, 0, 0, 0.87)
--text-secondary: rgba(0, 0, 0, 0.60)
--text-disabled: rgba(0, 0, 0, 0.38)

/* Dark Theme */
--text-primary: rgba(255, 255, 255, 0.87)
--text-secondary: rgba(255, 255, 255, 0.60)
--text-disabled: rgba(255, 255, 255, 0.38)
```

### Semantic Colors

```css
/* Success */
--success: #388E3C              /* Green 700 */
--success-light: #66BB6A        /* Green 400 */
--success-dark: #1B5E20         /* Green 900 */

/* Error */
--error: #D32F2F                /* Red 700 */
--error-light: #EF5350          /* Red 400 */
--error-dark: #C62828           /* Red 800 */

/* Warning */
--warning: #F57C00              /* Orange 700 */
--warning-light: #FF9800        /* Orange 500 */
--warning-dark: #E65100         /* Orange 900 */

/* Info */
--info: #1976D2                 /* Blue 700 */
--info-light: #42A5F5           /* Blue 400 */
--info-dark: #0D47A1            /* Blue 900 */
```

### GPS Accuracy Colors

```css
/* Excellent (< 10m) */
--gps-excellent: #4CAF50        /* Green 500 */

/* Good (10-30m) */
--gps-good: #8BC34A             /* Light Green 500 */

/* Fair (30-50m) */
--gps-fair: #FFEB3B             /* Yellow 500 */

/* Poor (50-100m) */
--gps-poor: #FF9800             /* Orange 500 */

/* Very Poor (> 100m) */
--gps-very-poor: #F44336        /* Red 500 */
```

---

## ✍️ Typography

### Font Family

```css
/* Android */
font-family: 'Roboto', sans-serif;

/* iOS */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

/* Web */
font-family: 'Inter', -apple-system, system-ui, sans-serif;
```

### Type Scale (Material Design 3)

```css
/* Display */
.display-large {
  font-size: 57px;
  line-height: 64px;
  font-weight: 400;
  letter-spacing: -0.25px;
}

.display-medium {
  font-size: 45px;
  line-height: 52px;
  font-weight: 400;
  letter-spacing: 0;
}

.display-small {
  font-size: 36px;
  line-height: 44px;
  font-weight: 400;
  letter-spacing: 0;
}

/* Headline */
.headline-large {
  font-size: 32px;
  line-height: 40px;
  font-weight: 400;
  letter-spacing: 0;
}

.headline-medium {
  font-size: 28px;
  line-height: 36px;
  font-weight: 400;
  letter-spacing: 0;
}

.headline-small {
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
  letter-spacing: 0;
}

/* Title */
.title-large {
  font-size: 22px;
  line-height: 28px;
  font-weight: 500;
  letter-spacing: 0;
}

.title-medium {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  letter-spacing: 0.15px;
}

.title-small {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0.1px;
}

/* Body */
.body-large {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.body-medium {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  letter-spacing: 0.25px;
}

.body-small {
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  letter-spacing: 0.4px;
}

/* Label */
.label-large {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  letter-spacing: 0.1px;
}

.label-medium {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.label-small {
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
```

---

## 📐 Spacing System

### Base unit: 8px

```css
--spacing-0: 0px
--spacing-1: 4px      /* 0.5 * base */
--spacing-2: 8px      /* 1 * base */
--spacing-3: 12px     /* 1.5 * base */
--spacing-4: 16px     /* 2 * base */
--spacing-5: 20px     /* 2.5 * base */
--spacing-6: 24px     /* 3 * base */
--spacing-8: 32px     /* 4 * base */
--spacing-10: 40px    /* 5 * base */
--spacing-12: 48px    /* 6 * base */
--spacing-16: 64px    /* 8 * base */
```

### Применение:

- Padding внутри компонентов: 16px
- Margin между секциями: 24px
- Gap в Grid/Flexbox: 12px
- Icon padding: 12px

---

## 🔲 Border Radius

```css
--radius-none: 0px
--radius-sm: 4px       /* Small elements (chips) */
--radius-md: 8px       /* Cards, inputs */
--radius-lg: 12px      /* Buttons, modals */
--radius-xl: 16px      /* Large cards */
--radius-full: 9999px  /* Pills, circular */
```

---

## 🌑 Elevation (Shadows)

```css
/* Elevation 1 (Cards) */
--shadow-1: 0 1px 2px rgba(0,0,0,0.3),
            0 1px 3px rgba(0,0,0,0.15);

/* Elevation 2 (Hover cards) */
--shadow-2: 0 1px 5px rgba(0,0,0,0.2),
            0 2px 2px rgba(0,0,0,0.14),
            0 3px 1px rgba(0,0,0,0.12);

/* Elevation 3 (Raised buttons) */
--shadow-3: 0 3px 5px rgba(0,0,0,0.2),
            0 1px 18px rgba(0,0,0,0.12),
            0 6px 10px rgba(0,0,0,0.14);

/* Elevation 4 (Modals) */
--shadow-4: 0 4px 5px rgba(0,0,0,0.14),
            0 1px 10px rgba(0,0,0,0.12),
            0 2px 4px rgba(0,0,0,0.2);

/* Elevation 5 (FAB) */
--shadow-5: 0 8px 10px rgba(0,0,0,0.14),
            0 3px 14px rgba(0,0,0,0.12),
            0 5px 5px rgba(0,0,0,0.2);
```

---

## 🧩 Components Library

### 1. Buttons

#### Primary Button
```css
.button-primary {
  background: var(--primary-main);
  color: var(--on-primary);
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  font-size: 14px;
  box-shadow: var(--shadow-2);
  transition: all 0.2s ease;
}

.button-primary:hover {
  background: var(--primary-dark);
  box-shadow: var(--shadow-3);
}

.button-primary:active {
  transform: scale(0.98);
}
```

#### Secondary Button
```css
.button-secondary {
  background: var(--secondary-main);
  color: var(--on-secondary);
  /* Same styles as primary */
}
```

#### Outlined Button
```css
.button-outlined {
  background: transparent;
  color: var(--primary-main);
  border: 2px solid var(--primary-main);
  border-radius: 12px;
  padding: 10px 22px; /* -2px for border */
}
```

#### Text Button
```css
.button-text {
  background: transparent;
  color: var(--primary-main);
  padding: 12px 16px;
  font-weight: 500;
}
```

#### FAB (Floating Action Button)
```css
.button-fab {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--primary-main);
  color: var(--on-primary);
  box-shadow: var(--shadow-5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Extended FAB (с текстом) */
.button-fab-extended {
  height: 56px;
  padding: 0 24px;
  border-radius: 16px;
  gap: 12px;
}
```

### 2. Cards

```css
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow-1);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-2);
}

/* Photo Card */
.card-photo {
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
}

/* Metadata Card */
.card-metadata {
  background: var(--surface-variant);
  border-radius: 12px;
  padding: 12px;
  gap: 8px;
}
```

### 3. Inputs

```css
.input {
  background: var(--surface);
  border: 2px solid rgba(0,0,0,0.12);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--primary-main);
  outline: none;
}

.input:disabled {
  background: var(--surface-variant);
  color: var(--text-disabled);
}

/* Search Input */
.input-search {
  border-radius: 28px;
  padding-left: 48px; /* for icon */
  background-image: url('search-icon.svg');
  background-position: 16px center;
  background-repeat: no-repeat;
}
```

### 4. Chips (Filter Tags)

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-variant);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.chip:hover {
  background: rgba(0,0,0,0.08);
}

.chip.active {
  background: var(--primary-main);
  color: var(--on-primary);
}
```

### 5. Bottom Sheet

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-radius: 28px 28px 0 0;
  padding: 24px;
  box-shadow: 0 -4px 8px rgba(0,0,0,0.1);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-sheet.open {
  transform: translateY(0);
}

/* Handle */
.bottom-sheet::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 4px;
  background: rgba(0,0,0,0.12);
  border-radius: 2px;
}
```

### 6. Navigation Bar (Bottom Tabs)

```css
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--surface);
  border-top: 1px solid rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 16px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.nav-item.active {
  background: rgba(0, 121, 107, 0.12);
  color: var(--primary-main);
}

.nav-item-icon {
  width: 24px;
  height: 24px;
}

.nav-item-label {
  font-size: 12px;
  font-weight: 500;
}
```

### 7. GPS Accuracy Indicator

```css
.gps-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.gps-indicator.excellent {
  background: rgba(76, 175, 80, 0.12);
  color: #388E3C;
}

.gps-indicator.good {
  background: rgba(139, 195, 74, 0.12);
  color: #689F38;
}

.gps-indicator.fair {
  background: rgba(255, 235, 59, 0.12);
  color: #F57F17;
}

.gps-indicator.poor {
  background: rgba(255, 152, 0, 0.12);
  color: #E65100;
}

.gps-indicator.very-poor {
  background: rgba(244, 67, 54, 0.12);
  color: #C62828;
}
```

### 8. Map Marker

```css
.map-marker {
  width: 32px;
  height: 32px;
  background: var(--primary-main);
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: transform 0.2s;
}

.map-marker:hover {
  transform: scale(1.2);
}

.map-marker.selected {
  width: 40px;
  height: 40px;
  background: var(--secondary-main);
}

/* Cluster Marker */
.map-marker-cluster {
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  background: var(--primary-main);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```

### 9. Loading States

```css
/* Skeleton Loader */
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0.06) 25%,
    rgba(0,0,0,0.10) 50%,
    rgba(0,0,0,0.06) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Spinner */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-top-color: var(--primary-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 10. Snackbar (Toast)

```css
.snackbar {
  position: fixed;
  bottom: 100px;
  left: 16px;
  right: 16px;
  background: #323232;
  color: white;
  padding: 14px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-3);
  animation: slide-up 0.3s;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.snackbar-action {
  color: var(--secondary-main);
  font-weight: 500;
  cursor: pointer;
}
```

---

## 📱 Screen Templates

### 1. Camera Screen

```
┌─────────────────────────────────┐
│ [Status Bar]                    │ 24px
├─────────────────────────────────┤
│                                 │
│       Live Camera Preview       │ Full screen
│       (react-native-vision)     │
│                                 │
│  ┌─────────────────────────┐   │ Overlay
│  │ GPS: 55.7558, 37.6173   │   │
│  │ Accuracy: 8m ✓          │   │
│  └─────────────────────────┘   │
│                                 │
│                                 │
│                                 │
│     [Watermark Preview]         │
│  "📍 Moscow, Russia"            │
│  "55.7558, 37.6173"             │
│  "15.01.2026 14:30"             │
│                                 │
├─────────────────────────────────┤
│     ⚙️        📸         🖼️     │ Bottom
│  Settings  Capture   Gallery   │ 80px
└─────────────────────────────────┘
```

### 2. Gallery Screen

```
┌─────────────────────────────────┐
│ [Status Bar]                    │
├─────────────────────────────────┤
│  Gallery                  🔍 ⋮  │ Header (56px)
├─────────────────────────────────┤
│ [Today] [Yesterday] [Week]      │ Filter Chips (48px)
├─────────────────────────────────┤
│                                 │
│  ┌───┐ ┌───┐ ┌───┐            │ Grid (3 columns)
│  │ □ │ │ □ │ │ □ │            │ Gap: 4px
│  └───┘ └───┘ └───┘            │
│                                 │
│  ┌───┐ ┌───┐ ┌───┐            │
│  │ □ │ │ □ │ │ □ │            │
│  └───┘ └───┘ └───┘            │
│                                 │
│       ... (infinite scroll)     │
│                                 │
├─────────────────────────────────┤
│     📷      🖼️      🗺️     ⚙️   │ Bottom Nav
└─────────────────────────────────┘
```

### 3. Map Screen

```
┌─────────────────────────────────┐
│ [Status Bar]                    │
├─────────────────────────────────┤
│  ┌───────────────────────────┐ │ Search Bar (56px)
│  │ 🔍 Search location...     │ │
│  └───────────────────────────┘ │
├─────────────────────────────────┤
│                                 │
│       🗺️ Interactive Map        │
│     (Mapbox / Google Maps)      │ Full screen
│                                 │
│       📍 📍 📍                  │ Markers
│     📍       📍  (15)          │ Cluster
│         📍                      │
│                                 │
├─────────────────────────────────┤ Bottom Sheet
│  ═══                            │ Handle (4px)
│  ┌──────┐  Moscow, Russia      │
│  │ 📷   │  55.7558, 37.6173    │ Photo preview
│  │ img  │  15.01.2026 14:30    │
│  └──────┘  [View] [Share]      │
├─────────────────────────────────┤
│     📷      🖼️      🗺️     ⚙️   │ Bottom Nav
└─────────────────────────────────┘
```

### 4. Photo Detail Screen

```
┌─────────────────────────────────┐
│ ← Photo Detail          ⋮       │ Header (56px)
├─────────────────────────────────┤
│                                 │
│         Hero Image              │ Hero (400px)
│    (zoomable, pinch)            │
│                                 │
├─────────────────────────────────┤
│  📍 Location                    │ Card (collapsible)
│  Moscow, Russia                 │
│  55.7558, 37.6173               │
│  Accuracy: 8m                   │
│  ┌──────────────┐              │ Mini map
│  │   Mini Map   │              │
│  └──────────────┘              │
├─────────────────────────────────┤
│  🕒 Timestamp                   │ Card
│  15 January 2026, 14:30        │
├─────────────────────────────────┤
│  📱 Device Info                 │ Card (collapsed)
│  > Tap to expand                │
├─────────────────────────────────┤
│  [🔗 Share]  [🗑️ Delete]        │ Actions (64px)
└─────────────────────────────────┘
```

### 5. Settings Screen

```
┌─────────────────────────────────┐
│ Settings                        │ Header (56px)
├─────────────────────────────────┤
│                                 │
│  CAMERA                         │ Section Header
│  ─────────────────────────      │
│  Photo Quality        High ⌄    │ Dropdown
│  Watermark Style      Full ⌄    │
│  GPS Precision        Best ⌄    │
│                                 │
│  AUTO-DELETE                    │
│  ─────────────────────────      │
│  Default Retention    24h ⌄     │
│  ○ 1 hour                       │ Radio group
│  ● 24 hours                     │
│  ○ 7 days                       │
│  ○ Forever                      │
│                                 │
│  APPEARANCE                     │
│  ─────────────────────────      │
│  Theme                Auto ⌄    │
│  Dark Mode            [●──]     │ Switch
│                                 │
│  PRIVACY                        │
│  ─────────────────────────      │
│  Privacy Policy         >       │
│  Terms of Service       >       │
│                                 │
│  ABOUT                          │
│  ─────────────────────────      │
│  Version              1.0.0     │
│  Rate App               >       │
│                                 │
├─────────────────────────────────┤
│     📷      🖼️      🗺️     ⚙️   │ Bottom Nav
└─────────────────────────────────┘
```

---

## 🌐 Web Design (Responsive)

### Breakpoints

```css
/* Mobile */
@media (max-width: 640px) { /* sm */ }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { /* md */ }

/* Desktop */
@media (min-width: 1025px) { /* lg */ }
```

### Landing Page Layout

```
Desktop (1440px):
┌───────────────────────────────────────┐
│  [Logo] GeoMark      [Login] [Sign Up]│ Nav (80px)
├───────────────────────────────────────┤
│                                       │
│     GPS Camera with Location          │ Hero (600px)
│     Tracking & Pattern Detection      │
│                                       │
│     [Download App]  [Try on Web]      │
│                                       │
│     [Preview Image]                   │
│                                       │
├───────────────────────────────────────┤
│  Features                             │
│  ┌──────┐ ┌──────┐ ┌──────┐         │ 3 columns
│  │  📷  │ │  🗺️  │ │  🔗  │         │
│  │Photo │ │ Map  │ │Share │         │
│  └──────┘ └──────┘ └──────┘         │
├───────────────────────────────────────┤
│  How It Works                         │
│  1 → 2 → 3                            │ Steps
├───────────────────────────────────────┤
│  [Footer]                             │
└───────────────────────────────────────┘

Mobile (375px):
┌─────────────────┐
│ ☰  GeoMark      │ Nav (collapsed)
├─────────────────┤
│   GPS Camera    │ Hero (stacked)
│                 │
│ [Download App]  │
│                 │
│ [Preview Image] │
├─────────────────┤
│     📷          │ Features (1 column)
│    Photo        │
│                 │
│     🗺️          │
│     Map         │
│                 │
│     🔗          │
│    Share        │
├─────────────────┤
│ How It Works    │
│   1 ↓ 2 ↓ 3     │ Vertical steps
└─────────────────┘
```

---

## 🎬 Animations & Transitions

### Micro-interactions

```css
/* Button Press */
.button {
  transition: transform 0.1s ease;
}

.button:active {
  transform: scale(0.98);
}

/* Card Hover */
.card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-3);
  transform: translateY(-2px);
}

/* Photo Grid Item */
.photo-item {
  transition: opacity 0.3s ease;
  opacity: 0;
  animation: fade-in 0.3s forwards;
}

@keyframes fade-in {
  to { opacity: 1; }
}

/* Page Transition */
.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease;
}
```

### Loading Animations

```css
/* Pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* Bounce (для FAB) */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.fab-bounce {
  animation: bounce 0.6s ease;
}
```

---

## ♿ Accessibility

### Touch Targets

```css
/* Minimum touch target size */
.touch-target {
  min-width: 48px;
  min-height: 48px;
}

/* Spacing between touch targets */
.touch-targets-container {
  gap: 8px;
}
```

### Focus States

```css
.interactive:focus-visible {
  outline: 2px solid var(--primary-main);
  outline-offset: 2px;
}
```

### Color Contrast

- AA Standard: 4.5:1 для обычного текста
- AAA Standard: 7:1 для обычного текста
- Large text (18px+): 3:1 minimum

### Screen Reader Support

```html
<!-- Button labels -->
<button aria-label="Take Photo">
  <CameraIcon />
</button>

<!-- Image alt text -->
<img src="photo.jpg" alt="Moscow, Russia - 55.7558, 37.6173" />

<!-- Loading states -->
<div role="status" aria-live="polite">
  Loading photos...
</div>
```

---

## 📦 Icon Set

### Primary Icons (Material Icons)

```
Camera:          photo_camera
Gallery:         photo_library
Map:             map
Settings:        settings
GPS:             gps_fixed
Share:           share
Delete:          delete
Download:        download
Upload:          cloud_upload
Search:          search
Filter:          filter_list
Menu:            menu
Close:           close
Back:            arrow_back
Forward:         arrow_forward
Refresh:         refresh
More:            more_vert
Edit:            edit
Info:            info
Warning:         warning
Error:           error
Success:         check_circle
Location:        place
Time:            access_time
```

### Custom Icons (SVG)

- GPS Accuracy indicator (5 states)
- Watermark styles preview
- Pattern detection alert icon

---

## 🎨 Dark Mode

### Implementation

```typescript
// React Native
import { useColorScheme } from 'react-native';

const ColorScheme = () => {
  const scheme = useColorScheme(); // 'light' | 'dark'

  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return <PaperProvider theme={theme}>...</PaperProvider>;
};

// Web (Next.js)
import { useTheme } from 'next-themes';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
};
```

---

## 📐 Design Files

### Figma Structure

```
GeoMark Design System
├── 📁 Foundations
│   ├── Colors (Light + Dark)
│   ├── Typography
│   ├── Spacing
│   ├── Elevation
│   └── Icons
├── 📁 Components
│   ├── Buttons
│   ├── Cards
│   ├── Inputs
│   ├── Navigation
│   └── Overlays
├── 📁 Mobile Screens
│   ├── Camera
│   ├── Gallery
│   ├── Map
│   ├── Photo Detail
│   └── Settings
└── 📁 Web Pages
    ├── Landing
    ├── Upload
    ├── Gallery
    ├── Map
    └── Public Viewer
```

### Component States

Каждый компонент имеет states:
- Default
- Hover
- Active/Pressed
- Focused
- Disabled
- Loading
- Error (для inputs)

---

**Готово!** Полная дизайн-система для GeoMark.

**Next Steps:**
1. Создать Figma файл с компонентами
2. Экспортировать icon set
3. Создать mobile mockups
4. Создать web mockups
5. Prototype flows (Camera → Upload → Gallery)
