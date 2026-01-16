# Инструкция: Как запустить GeoMark на телефоне

## Быстрый старт (5 минут)

### Шаг 1: Установите Expo Go на телефон

**Android:**
1. Откройте Google Play Store
2. Найдите "Expo Go"
3. Нажмите "Установить"

**iOS (iPhone/iPad):**
1. Откройте App Store
2. Найдите "Expo Go"
3. Нажмите "Загрузить"

### Шаг 2: Запустите проект на компьютере

Откройте терминал (командную строку) и выполните:

```bash
# Перейдите в папку проекта
cd c:\Users\ASuS\Documents\Projects\Projects\GeoMarkApp

# Запустите Expo
npx expo start
```

### Шаг 3: Подключите телефон

После запуска в терминале появится QR-код.

**Android:**
1. Откройте приложение Expo Go
2. Нажмите "Scan QR code"
3. Отсканируйте код с экрана компьютера

**iOS:**
1. Откройте стандартную камеру iPhone
2. Наведите на QR-код
3. Нажмите на появившееся уведомление

Приложение загрузится на телефон!

---

## Альтернативные способы

### Способ 2: Через URL (если QR не работает)

1. Запустите `npx expo start`
2. В терминале найдите строку вида:
   ```
   exp://192.168.1.100:8081
   ```
3. Откройте Expo Go на телефоне
4. Нажмите "Enter URL manually"
5. Введите этот адрес

**Важно:** Компьютер и телефон должны быть в одной Wi-Fi сети!

### Способ 3: Tunnel (если разные сети)

```bash
npx expo start --tunnel
```

Это создаст публичный URL, доступный из любой сети.

---

## Создание APK файла (Android)

Если хотите установить приложение без Expo Go:

### Шаг 1: Создайте аккаунт Expo

1. Перейдите на https://expo.dev
2. Нажмите "Sign Up"
3. Создайте бесплатный аккаунт

### Шаг 2: Установите EAS CLI

```bash
npm install -g eas-cli
```

### Шаг 3: Авторизуйтесь

```bash
eas login
```

Введите email и пароль от Expo аккаунта.

### Шаг 4: Настройте проект

Создайте файл `eas.json` в папке GeoMarkApp:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### Шаг 5: Соберите APK

```bash
cd GeoMarkApp
eas build --platform android --profile preview
```

Процесс займет 10-15 минут. После завершения вы получите ссылку для скачивания APK.

### Шаг 6: Установите APK

1. Скачайте APK на телефон
2. Откройте файл
3. Разрешите установку из неизвестных источников (если спросит)
4. Нажмите "Установить"

---

## Сборка для iOS (TestFlight)

### Требования:
- Mac с Xcode
- Apple Developer аккаунт ($99/год)

### Шаги:

```bash
# 1. Авторизуйтесь в EAS
eas login

# 2. Настройте Apple credentials
eas credentials

# 3. Соберите для iOS
eas build --platform ios --profile production

# 4. Отправьте в TestFlight
eas submit --platform ios
```

---

## Частые проблемы

### "Network request failed"
**Причина:** Телефон и компьютер в разных сетях
**Решение:**
- Подключите оба устройства к одному Wi-Fi
- Или используйте `npx expo start --tunnel`

### "Unable to resolve module"
**Причина:** Не установлены зависимости
**Решение:**
```bash
cd GeoMarkApp
rm -rf node_modules
npm install
npx expo start -c
```

### QR-код не сканируется
**Решение:**
1. Попробуйте режим tunnel: `npx expo start --tunnel`
2. Или введите URL вручную в Expo Go

### Камера не работает в Expo Go
**Причина:** Некоторые нативные функции ограничены в Expo Go
**Решение:** Создайте development build:
```bash
eas build --profile development --platform android
```

### GPS показывает неточные координаты
**Решение:**
1. Выйдите на улицу (GPS плохо работает в помещении)
2. Подождите 10-15 секунд для получения точных координат
3. Включите "Высокая точность GPS" в настройках телефона

---

## Команды для разработки

| Команда | Описание |
|---------|----------|
| `npx expo start` | Запуск в режиме разработки |
| `npx expo start --tunnel` | Запуск с публичным URL |
| `npx expo start -c` | Запуск с очисткой кэша |
| `npx expo run:android` | Запуск на эмуляторе Android |
| `npx expo run:ios` | Запуск на симуляторе iOS |
| `eas build --platform android` | Сборка для Android |
| `eas build --platform ios` | Сборка для iOS |

---

## Полезные ссылки

- [Expo Documentation](https://docs.expo.dev)
- [Expo Go на Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Expo Go на App Store](https://apps.apple.com/app/expo-go/id982107779)
- [EAS Build](https://docs.expo.dev/build/introduction/)
