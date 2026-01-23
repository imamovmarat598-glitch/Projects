# 📊 GeoMark Analytics Setup Guide

## Настройка аналитики для отслеживания пользователей и метрик

---

## 🎯 Цели аналитики

1. **Понимать поведение пользователей**
2. **Отслеживать конверсии** (установки → активация → retention → монетизация)
3. **Находить баги и проблемы**
4. **Измерять эффективность маркетинга**
5. **Принимать решения на основе данных**

---

## 📱 Firebase Analytics (Основной инструмент)

### Установка

#### 1. Создание Firebase проекта

```bash
# Перейдите на https://console.firebase.google.com/
# Нажмите "Add project"
# Название проекта: GeoMark
# Включите Google Analytics: Yes
# Google Analytics account: Create new account "GeoMark"
```

#### 2. Регистрация приложений

**Android:**
```
Package name: com.geomarkapp
App nickname: GeoMark Android
Download google-services.json
```

**iOS:**
```
Bundle ID: com.geomarkapp
App nickname: GeoMark iOS
Download GoogleService-Info.plist
```

#### 3. Установка в Expo проект

```bash
cd GeoMarkApp

# Установить Firebase SDK
npm install @react-native-firebase/app @react-native-firebase/analytics

# Создать файл app.json конфигурации
```

#### 4. Конфигурация в app.json

```json
{
  "expo": {
    "name": "GeoMark",
    "slug": "geomark",
    "version": "1.0.0",
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/analytics"
    ],
    "android": {
      "package": "com.geomarkapp",
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "bundleIdentifier": "com.geomarkapp",
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

#### 5. Инициализация в коде

Создать файл: `src/services/Analytics.ts`

```typescript
import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  // Отслеживание экранов
  async logScreenView(screenName: string) {
    await analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName,
    });
  }

  // События пользователей
  async logEvent(eventName: string, params?: Record<string, any>) {
    await analytics().logEvent(eventName, params);
  }

  // Установка User Properties
  async setUserProperty(property: string, value: string) {
    await analytics().setUserProperty(property, value);
  }

  // Установка User ID
  async setUserId(userId: string) {
    await analytics().setUserId(userId);
  }
}

export default new AnalyticsService();
```

---

## 📊 События для отслеживания

### 1. Acquisition (Привлечение)

```typescript
// Первый запуск приложения
Analytics.logEvent('first_open', {
  source: 'organic' | 'paid' | 'referral',
  campaign: 'launch_2026',
});

// Завершение onboarding
Analytics.logEvent('tutorial_complete', {
  duration_seconds: 45,
});
```

### 2. Activation (Активация)

```typescript
// Первое фото
Analytics.logEvent('first_photo_taken', {
  has_gps: true,
  accuracy: 'high',
});

// Первый просмотр на карте
Analytics.logEvent('first_map_view', {
  photos_count: 1,
});

// Первый экспорт
Analytics.logEvent('first_export', {
  format: 'gpx',
  photos_count: 5,
});
```

### 3. Engagement (Вовлечение)

```typescript
// Съемка фото
Analytics.logEvent('photo_captured', {
  has_location: true,
  accuracy: gpsAccuracy,
  flash_mode: 'auto',
});

// Просмотр спутниковых снимков (КЛЮЧЕВАЯ МЕТРИКА!)
Analytics.logEvent('satellite_view_opened', {
  service: 'roscosmos' | 'google' | 'digital_earth',
  photo_id: photoId,
});

// Переключение слоя карты
Analytics.logEvent('map_layer_switched', {
  from: 'osm',
  to: 'roscosmos',
});

// Экспорт данных
Analytics.logEvent('data_exported', {
  format: 'gpx',
  photos_count: 10,
  file_size_kb: 125,
});
```

### 4. Revenue (Монетизация)

```typescript
// Просмотр paywall
Analytics.logEvent('paywall_viewed', {
  source: 'camera_limit' | 'feature_locked',
  photos_count: 95, // близко к лимиту
});

// Начало подписки
Analytics.logEvent('purchase', {
  transaction_id: 'txn_123',
  value: 4.99,
  currency: 'USD',
  subscription_type: 'premium_monthly',
  trial_period: false,
});

// Отмена подписки
Analytics.logEvent('subscription_cancelled', {
  reason: 'too_expensive' | 'not_using' | 'other',
  days_active: 15,
});
```

### 5. Retention (Удержание)

```typescript
// Ежедневный логин
Analytics.logEvent('app_open', {
  days_since_install: 7,
  session_count: 15,
});

// Создание привычки
Analytics.logEvent('habit_formed', {
  consecutive_days: 7,
  photos_taken: 50,
});
```

### 6. Errors (Ошибки)

```typescript
// Ошибка камеры
Analytics.logEvent('camera_error', {
  error_code: 'permission_denied',
  error_message: message,
});

// Ошибка GPS
Analytics.logEvent('gps_error', {
  error_type: 'timeout',
  last_known_accuracy: 'low',
});

// Crash
Analytics.logEvent('app_crash', {
  crash_type: 'native' | 'javascript',
  screen: currentScreen,
});
```

---

## 🔍 Google Analytics 4 (Веб-сайт)

### Установка для Next.js

#### 1. Создание GA4 property

```
1. Перейдите на analytics.google.com
2. Admin → Create Property
3. Property name: GeoMark Web
4. Time zone: Russia/Moscow
5. Currency: RUB
6. Create Data Stream → Web
7. Website URL: https://geomark.app
8. Получите Measurement ID: G-XXXXXXXXXX
```

#### 2. Установка в Next.js

Создать файл: `src/lib/analytics.ts`

```typescript
// Инициализация GA4
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

// Отправка pageview
export const pageview = (url: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Отправка событий
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

Добавить в `src/app/layout.tsx`:

```tsx
import Script from 'next/script'
import { GA_MEASUREMENT_ID } from '@/lib/analytics'

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### 3. Отслеживание событий на сайте

```typescript
import { event } from '@/lib/analytics'

// Клик по кнопке скачивания
<button onClick={() => {
  event({
    action: 'click',
    category: 'download',
    label: 'app_store',
  })
}}>
  Скачать из App Store
</button>

// Подписка на newsletter
event({
  action: 'submit',
  category: 'newsletter',
  label: 'homepage',
})

// Просмотр видео
event({
  action: 'play',
  category: 'video',
  label: 'demo_video',
  value: 1,
})
```

---

## 🐛 Sentry (Error Tracking)

### Установка

```bash
npm install @sentry/react-native

# Для автоматической настройки
npx @sentry/wizard -i reactNative

# Получить DSN от sentry.io
```

### Конфигурация

Создать файл: `sentry.properties`

```properties
defaults.url=https://sentry.io/
defaults.org=geomark
defaults.project=geomark-mobile
auth.token=YOUR_AUTH_TOKEN
```

Инициализация в `App.tsx`:

```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://xxx@xxx.ingest.sentry.io/xxx',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
});

export default Sentry.wrap(App);
```

### Отслеживание ошибок

```typescript
try {
  await capturePhoto();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'camera',
      gps_available: location !== null,
    },
    extra: {
      camera_permissions: hasPermissions,
      location_accuracy: accuracy,
    },
  });
}
```

---

## 📈 Яндекс.Метрика (для российской аудитории)

### Установка на веб-сайт

```html
<!-- Добавить в layout.tsx -->
<Script id="yandex-metrika" strategy="afterInteractive">
  {`
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],
      k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(XXXXXXXX, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });
  `}
</Script>
```

### События

```typescript
// Достижение цели
ym(XXXXXXXX, 'reachGoal', 'download_app');

// Параметры пользователя
ym(XXXXXXXX, 'userParams', {
  premium: true,
  photos_count: 150,
});
```

---

## 📊 RevenueCat (Subscription Analytics)

### Установка

```bash
npm install react-native-purchases
```

### Конфигурация

```typescript
import Purchases from 'react-native-purchases';

// Инициализация
Purchases.configure({
  apiKey: 'YOUR_REVENUECAT_API_KEY',
  appUserID: userId, // optional
});

// Отслеживание покупки
Purchases.purchasePackage(package).then((purchase) => {
  Analytics.logEvent('purchase', {
    transaction_id: purchase.customerInfo.activeSubscriptions[0],
    value: 4.99,
    currency: 'USD',
  });
});
```

---

## 🎯 Key Metrics Dashboard

### Ключевые метрики для отслеживания

```typescript
// Ежедневно проверяйте:

1. DAU (Daily Active Users)
   - Цель: 1,000 к концу месяца 1

2. Retention
   - Day 1: 40%
   - Day 7: 25%
   - Day 30: 15%

3. Конверсия в Premium
   - Цель: 3% от активных пользователей

4. Crash-free rate
   - Цель: >99.5%

5. Среднее время в приложении
   - Цель: >5 минут/сессия

6. Фото per user
   - Цель: >10 фото/месяц

7. Использование спутниковых снимков
   - % пользователей, открывших Роскосмос: >20%
```

---

## 📝 Примеры использования в коде

### Camera Screen

```typescript
import Analytics from '../services/Analytics';

export default function CameraScreen() {
  useEffect(() => {
    Analytics.logScreenView('Camera');
  }, []);

  const handleCapture = async () => {
    const startTime = Date.now();

    try {
      const photo = await capturePhoto(cameraRef, location);
      const duration = (Date.now() - startTime) / 1000;

      Analytics.logEvent('photo_captured', {
        has_location: !!location,
        accuracy: accuracy,
        capture_duration_s: duration,
      });

      await PhotoStorage.savePhoto(photo);

      Alert.alert('Success', 'Photo saved!');
    } catch (error) {
      Analytics.logEvent('camera_error', {
        error_message: error.message,
      });

      Sentry.captureException(error);
    }
  };

  return (
    // ... UI
  );
}
```

### Map Screen

```typescript
const openSatelliteService = (serviceId: string, coords: Coordinates) => {
  Analytics.logEvent('satellite_view_opened', {
    service: serviceId,
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  const service = SATELLITE_SERVICES.find(s => s.id === serviceId);
  if (service) {
    Linking.openURL(service.getLink(coords));
  }
};
```

### Settings Screen

```typescript
const handleExport = async (format: string) => {
  const startTime = Date.now();

  try {
    const data = await exportPhotos(format);
    const duration = (Date.now() - startTime) / 1000;

    Analytics.logEvent('data_exported', {
      format: format,
      photos_count: photos.length,
      export_duration_s: duration,
      file_size_kb: data.length / 1024,
    });

    await Share.share({ url: data });
  } catch (error) {
    Analytics.logEvent('export_error', {
      format: format,
      error_message: error.message,
    });
  }
};
```

---

## 🔐 Privacy & GDPR Compliance

### Конфигурация согласия

```typescript
import Analytics from './Analytics';

// Запросить согласие пользователя
const requestTrackingConsent = async () => {
  const consent = await showConsentDialog();

  if (consent) {
    Analytics.setAnalyticsCollectionEnabled(true);
  } else {
    Analytics.setAnalyticsCollectionEnabled(false);
  }

  AsyncStorage.setItem('analytics_consent', consent.toString());
};

// Проверить при запуске
useEffect(() => {
  const checkConsent = async () => {
    const consent = await AsyncStorage.getItem('analytics_consent');
    if (consent === null) {
      requestTrackingConsent();
    }
  };

  checkConsent();
}, []);
```

---

## 📦 Environment Variables

Создать файл `.env`:

```env
# Firebase
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXX
FIREBASE_PROJECT_ID=geomark-xxxxx
FIREBASE_MESSAGING_SENDER_ID=123456789

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx

# RevenueCat
REVENUECAT_API_KEY_IOS=appl_xxxxx
REVENUECAT_API_KEY_ANDROID=goog_xxxxx

# Yandex Metrika
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
```

---

## 🚀 Deployment Checklist

Перед запуском:

- [ ] Firebase проект создан и настроен
- [ ] google-services.json и GoogleService-Info.plist добавлены
- [ ] Google Analytics 4 property создано
- [ ] Sentry проект создан
- [ ] RevenueCat настроен
- [ ] Яндекс.Метрика установлена
- [ ] Privacy Policy обновлена
- [ ] Согласие на tracking реализовано
- [ ] События логируются корректно (протестировано)
- [ ] Dashboard'ы настроены

---

## 📊 Recommended Dashboards

### Firebase Analytics
- Overview (DAU, retention, revenue)
- Events (top events, funnels)
- User Properties (premium vs free, location)
- Crashes & ANRs

### Google Analytics
- Acquisition (источники трафика)
- Engagement (время на сайте, bounce rate)
- Conversions (скачивания приложения)

### Sentry
- Issues (ошибки по частоте)
- Releases (стабильность версий)
- Performance (медленные запросы)

---

**Аналитика готова! 🎉**

Следующий шаг: Интеграция кода в приложение.
