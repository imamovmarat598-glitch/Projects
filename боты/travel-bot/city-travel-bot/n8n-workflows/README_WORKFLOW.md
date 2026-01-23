# 🚀 Unified Travel Bot Workflow - Документация

## Обзор

Это единый универсальный n8n workflow, который объединяет всю функциональность бота:

- ✅ **Webhook триггер**: Поиск информации о городе по запросу пользователя
- ✅ **Cron триггер (24 часа)**: Ежедневное обновление афиши событий
- ✅ **Cron триггер (6 часов)**: Уведомления за 24 часа до события
- ✅ **Cron триггер (1 час)**: Уведомления за 30 минут до события
- ✅ **OpenAI интеграция**: AI анализ городов, достопримечательностей, гостиниц
- ✅ **KudaGo API**: События и кино

---

## Архитектура Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    4 ТРИГГЕРА                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Webhook (City Search)                                    │
│ 2. Cron Daily (Events Update)                               │
│ 3. Cron 6h (24h Notifications)                              │
│ 4. Cron 1h (30min Notifications)                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   ROUTER (Switch Node)                       │
│  Определяет тип триггера и направляет в нужную ветку        │
└─────────────────────────────────────────────────────────────┘
        ↓              ↓              ↓              ↓
   ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
   │ WEBHOOK│    │ DAILY  │    │  24H   │    │  30MIN │
   │ BRANCH │    │ BRANCH │    │ BRANCH │    │ BRANCH │
   └────────┘    └────────┘    └────────┘    └────────┘
```

---

## Ветка 1: Webhook - Поиск города (Webhook Trigger)

### URL
```
POST https://cuhelibbeerank.beget.app/webhook/city-search
```

### Входные данные (JSON)
```json
{
  "telegram_id": 123456789,
  "username": "user",
  "first_name": "Иван",
  "city": "Москва",
  "date_from": "2025-01-25",
  "date_to": "2025-01-27"
}
```

### Процесс обработки:

1. **Save User Request** → Сохранить запрос в Supabase (`user_requests`, status: processing)

2. **Параллельные запросы** (5 одновременно):
   - **KudaGo - Get Events**: Получить события для города и дат
   - **KudaGo - Get Cinema**: Получить фильмы в кинотеатрах
   - **OpenAI - City Summary**: Создать обзор города (2-3 абзаца)
   - **OpenAI - Attractions**: Топ-5 достопримечательностей (JSON)
   - **OpenAI - Hotels**: 5 гостиниц/хостелов с отзывами (JSON)

3. **Merge All AI Data** → Объединить все данные

4. **Combine Final Response** → Сформировать финальный JSON:
```json
{
  "success": true,
  "city": "Москва",
  "date_from": "2025-01-25",
  "date_to": "2025-01-27",
  "summary": "AI обзор города...",
  "events": [...],
  "cinema": [...],
  "attractions": [...],
  "hotels": [...]
}
```

5. **Update Request Status** → Обновить status = completed в Supabase

6. **Return to Bot** → Вернуть JSON боту

---

## Ветка 2: Daily Update - Обновление афиши (Cron Daily)

### Расписание
```
Каждые 24 часа (в 02:00 ночи)
```

### Процесс:

1. **Get All Cities** → Получить все уникальные города из `favorites`

2. **Loop Through Cities** → Для каждого города:

3. **KudaGo - Update Events** → Запрос к KudaGo API:
```
GET https://kudago.com/public-api/v1.4/events/?location={city}&actual_since={now}&page_size=50
```

4. **Save/Update Events** → Сохранить/обновить события в `events_cache` (UPSERT)

---

## Ветка 3: Notify 24h Before (Cron 6h)

### Расписание
```
Каждые 6 часов
```

### Процесс:

1. **Get 24h Subscriptions** → SQL запрос:
```sql
SELECT es.*, ec.title, ec.place, ec.event_date, ec.site_url, u.telegram_id
FROM event_subscriptions es
JOIN events_cache ec ON es.event_id = ec.event_id
JOIN users u ON es.telegram_id = u.telegram_id
WHERE es.notified_24h = false
  AND ec.event_date BETWEEN NOW() + INTERVAL '23 hours' AND NOW() + INTERVAL '25 hours'
  AND ec.is_active = true
```

2. **Loop 24h Notifications** → Для каждой подписки:

3. **Send 24h Notification** → Отправить Telegram уведомление:
```
🔔 Напоминание о событии

{Название события}
📍 {Место}
📅 Завтра, {дата и время}

Не забудьте купить билеты!
🔗 {ссылка}
```

4. **Mark 24h Sent** → Обновить `notified_24h = true`

---

## Ветка 4: Notify 30min Before (Cron 1h)

### Расписание
```
Каждый час
```

### Процесс:

1. **Get 30min Subscriptions** → SQL запрос:
```sql
SELECT es.*, ec.title, ec.place, ec.event_date, u.telegram_id
FROM event_subscriptions es
JOIN events_cache ec ON es.event_id = ec.event_id
JOIN users u ON es.telegram_id = u.telegram_id
WHERE es.notified_30min = false
  AND ec.event_date BETWEEN NOW() + INTERVAL '25 minutes' AND NOW() + INTERVAL '35 minutes'
  AND ec.is_active = true
```

2. **Loop 30min Notifications** → Для каждой подписки:

3. **Send 30min Notification** → Отправить Telegram уведомление:
```
⏰ Скоро начнется!

{Название события}
📍 {Место}
⏱ Начало через 30 минут ({время})

Удачи! 🎉
```

4. **Mark 30min Sent** → Обновить `notified_30min = true`

---

## Настройка Credentials в n8n

### 1. Supabase API
```
Credential Type: Supabase API
Name: supabase-creds

Host: https://ivrcaknzkasscojdjozz.supabase.co
Service Role Secret: [из Supabase Dashboard]
```

### 2. OpenAI API
```
Credential Type: OpenAI API
Name: openai-creds

API Key: YOUR_OPENAI_API_KEY_HERE
```

### 3. Telegram Bot API
```
Credential Type: Telegram API
Name: telegram-creds

Access Token: 8205281658:AAFPl2Ise5TaUFLqjiVj_Chnd_G5-Davz2o
```

---

## Установка Workflow на сервер n8n

### Шаг 1: Открыть n8n
```
https://cuhelibbeerank.beget.app/
```

### Шаг 2: Импортировать Workflow
1. Нажать "+ Add workflow" → Import from File
2. Выбрать файл: `unified-travel-bot-workflow.json`
3. Нажать "Import"

### Шаг 3: Настроить Credentials
Для каждого узла с красным восклицательным знаком:
1. Кликнуть на узел
2. В поле "Credential" выбрать нужный credential или создать новый
3. Применить настройки

### Шаг 4: Активировать Workflow
1. Переключатель "Active" в верхнем правом углу → ON
2. Workflow начнет работать

---

## Тестирование

### Тест 1: Webhook (City Search)
```bash
curl -X POST https://cuhelibbeerank.beget.app/webhook/city-search \
  -H "Content-Type: application/json" \
  -d '{
    "telegram_id": 123456789,
    "username": "test",
    "city": "Москва",
    "date_from": "2025-01-25",
    "date_to": "2025-01-27"
  }'
```

**Ожидаемый ответ**:
```json
{
  "success": true,
  "city": "Москва",
  "summary": "...",
  "events": [...],
  "attractions": [...],
  "hotels": [...]
}
```

### Тест 2: Daily Update
Вручную запустить workflow (кнопка "Execute Workflow") или подождать следующего срабатывания по расписанию.

### Тест 3: Уведомления
1. Добавить тестовую подписку в `event_subscriptions`
2. Установить `event_date` на +24 часа или +30 минут
3. Дождаться срабатывания cron триггера

---

## Преимущества Unified Workflow

✅ **Один workflow вместо 5** - проще управлять и поддерживать

✅ **Общие credentials** - настраиваются один раз

✅ **Единая логика маршрутизации** - Switch node определяет тип триггера

✅ **Параллельная обработка** - OpenAI и KudaGo запросы выполняются одновременно

✅ **Легко масштабируется** - можно добавлять новые ветки через Switch node

✅ **Меньше памяти** - один active workflow вместо нескольких

---

## Мониторинг

### Логи в n8n
1. Открыть workflow
2. Перейти на вкладку "Executions"
3. Посмотреть историю выполнений

### Ошибки
Если workflow не работает:
1. Проверить credentials (красные значки)
2. Проверить подключение к Supabase
3. Проверить OpenAI API key (не истек ли)
4. Проверить Telegram Bot Token

---

## Обновление Workflow

При необходимости изменений:
1. Деактивировать workflow (Active → OFF)
2. Внести изменения
3. Сохранить
4. Активировать заново (Active → ON)

---

**Workflow готов к использованию!** 🚀

Осталось только обновить `bot.ts` для работы с новым webhook.
