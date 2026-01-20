# 💳 Платежная система СБП для City Travel Bot

## Обзор

Интеграция **Системы Быстрых Платежей (СБП)** для приема оплаты подписок Premium и VIP напрямую в Telegram боте.

### Преимущества СБП:
- ✅ **Без комиссий** для пользователя
- ✅ **Низкая комиссия** для бизнеса (~0.4-0.7%)
- ✅ **Мгновенный перевод** (1-2 секунды)
- ✅ **QR-код** для быстрой оплаты
- ✅ **Работает с любым банком** РФ
- ✅ **Не нужна карта** - оплата через банковское приложение

---

## 🏦 Провайдеры для подключения СБП

### 1. ЮMoney (Яндекс.Деньги)

**Преимущества:**
- Простая интеграция
- Telegram Payments поддержка
- Комиссия: 2-3% (без СБП), 0.5% (СБП)
- Быстрый вывод средств

**Подключение:**
1. Зарегистрируйтесь на [yoomoney.ru](https://yoomoney.ru/transfer/myservices)
2. Создайте магазин
3. Получите токен провайдера
4. Включите СБП в настройках

**Документация:** https://yoomoney.ru/docs/payment-buttons/using-api

---

### 2. CloudPayments

**Преимущества:**
- СБП интеграция
- Подписки и рекуррентные платежи
- Комиссия: 2.8% (карты), 0.4-0.7% (СБП)
- Продвинутая аналитика

**Подключение:**
1. Регистрация на [cloudpayments.ru](https://cloudpayments.ru/)
2. Подключение СБП
3. API ключ

**Документация:** https://developers.cloudpayments.ru/

---

### 3. Тинькофф Касса

**Преимущества:**
- Надежность банка
- СБП встроен
- Комиссия: от 2.49%
- Вывод на счет в Тинькофф

**Подключение:**
1. Откройте расчетный счет в Тинькофф
2. Подключите Тинькофф Кассу
3. Активируйте СБП

**Документация:** https://www.tinkoff.ru/kassa/develop/

---

### 4. Сбербанк Эквайринг

**Преимущества:**
- Крупнейший банк
- СБП поддержка
- Комиссия: от 1.8%

**Подключение:**
- Требуется расчетный счет
- Подключение через менеджера

---

## 🎯 Рекомендация: ЮMoney

**Почему:**
- ✅ Самая простая интеграция с Telegram
- ✅ Не требует расчетного счета на старте
- ✅ Работает как Telegram Payment Provider
- ✅ Низкая комиссия на СБП (0.5%)
- ✅ Подходит для стартапа

---

## 🛠 Техническая реализация

### Вариант 1: Telegram Payments API (с ЮMoney)

#### Настройка:

1. **Получите токен провайдера от ЮMoney**
2. **Добавьте в .env:**
```env
PAYMENT_PROVIDER_TOKEN=your_yoomoney_provider_token
YOOMONEY_SHOP_ID=your_shop_id
YOOMONEY_SECRET_KEY=your_secret_key
```

#### Код интеграции:

```typescript
// src/services/payment.service.ts

import { Telegraf } from 'telegraf';

class PaymentService {
  private bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot;
  }

  /**
   * Создать счет для оплаты
   */
  async createInvoice(
    ctx: any,
    subscriptionType: 'premium' | 'vip',
    duration: 1 | 3 | 12 // месяцев
  ) {
    const prices = {
      premium: { 1: 299, 3: 799, 12: 2999 },
      vip: { 1: 999, 3: 2799, 12: 9999 },
    };

    const price = prices[subscriptionType][duration];
    const title = subscriptionType === 'premium' ? 'Premium подписка' : 'VIP подписка';
    const description = `${title} на ${duration} ${this.getMonthWord(duration)}`;

    await ctx.replyWithInvoice({
      title,
      description,
      payload: `${subscriptionType}_${duration}_${Date.now()}`,
      provider_token: process.env.PAYMENT_PROVIDER_TOKEN!,
      currency: 'RUB',
      prices: [
        {
          label: description,
          amount: price * 100, // в копейках
        },
      ],
      photo_url: 'https://your-cdn.com/subscription-image.jpg',
      photo_width: 640,
      photo_height: 360,
      need_name: false,
      need_phone_number: false,
      need_email: false,
      need_shipping_address: false,
      is_flexible: false,
    });
  }

  /**
   * Обработка успешной оплаты
   */
  async handleSuccessfulPayment(ctx: any) {
    const payment = ctx.message.successful_payment;
    const payload = payment.invoice_payload; // "premium_1_1234567890"

    const [type, duration] = payload.split('_');
    const userId = ctx.from.id;

    // Активируем подписку
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + parseInt(duration));

    await googleSheetsService.updateSubscription(userId, type, expiresAt);

    // Логируем платеж
    await this.logPayment({
      user_id: userId,
      subscription_type: type,
      duration: parseInt(duration),
      amount: payment.total_amount / 100,
      currency: payment.currency,
      provider_payment_id: payment.provider_payment_charge_id,
      paid_at: new Date(),
    });

    // Отправляем подтверждение
    await ctx.reply(
      `🎉 Спасибо за покупку!\n\n` +
      `✅ ${type.toUpperCase()} подписка активирована\n` +
      `📅 Действует до: ${expiresAt.toLocaleDateString()}\n\n` +
      `Теперь вам доступны:\n` +
      this.getFeaturesList(type)
    );
  }

  /**
   * Проверка оплаты (pre-checkout)
   */
  async handlePreCheckout(ctx: any) {
    // Здесь можно добавить проверки
    // Например, проверить что пользователь не забанен

    await ctx.answerPreCheckoutQuery(true);
  }

  private getMonthWord(count: number): string {
    if (count === 1) return 'месяц';
    if (count < 5) return 'месяца';
    return 'месяцев';
  }

  private getFeaturesList(type: string): string {
    if (type === 'premium') {
      return (
        `• Все города России (100+)\n` +
        `• Безлимитные запросы\n` +
        `• Полный список отелей\n` +
        `• Персональные маршруты\n` +
        `• Экспорт маршрутов`
      );
    } else {
      return (
        `• Всё из Premium +\n` +
        `• AI-рекомендации от GPT-4\n` +
        `• Уведомления за 30 мин до событий\n` +
        `• Скидки на билеты до 20%\n` +
        `• Приоритетная поддержка`
      );
    }
  }

  private async logPayment(data: any) {
    // Сохраняем в Google Sheets лист "Payments"
    await googleSheetsService.appendRow('Payments', [
      data.user_id,
      data.subscription_type,
      data.duration,
      data.amount,
      data.currency,
      data.provider_payment_id,
      data.paid_at.toISOString(),
    ]);
  }
}
```

---

### Вариант 2: Прямая интеграция СБП (через API банка)

#### Для продвинутого использования:

```typescript
// src/services/sbp.service.ts

import axios from 'axios';
import crypto from 'crypto';

class SBPService {
  private apiUrl: string;
  private merchantId: string;
  private secretKey: string;

  constructor() {
    this.apiUrl = process.env.SBP_API_URL || 'https://api.cloudpayments.ru';
    this.merchantId = process.env.SBP_MERCHANT_ID!;
    this.secretKey = process.env.SBP_SECRET_KEY!;
  }

  /**
   * Создать QR-код для оплаты через СБП
   */
  async createSBPPayment(params: {
    amount: number;
    orderId: string;
    description: string;
  }): Promise<{ qrUrl: string; paymentId: string }> {
    const data = {
      Amount: params.amount,
      Currency: 'RUB',
      InvoiceId: params.orderId,
      Description: params.description,
      AccountId: params.orderId,
    };

    const response = await axios.post(
      `${this.apiUrl}/payments/qr/sbp/create`,
      data,
      {
        auth: {
          username: this.merchantId,
          password: this.secretKey,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.Success) {
      return {
        qrUrl: response.data.Model.QrUrl, // Картинка QR-кода
        paymentId: response.data.Model.TransactionId,
      };
    }

    throw new Error('Failed to create SBP payment');
  }

  /**
   * Проверить статус платежа
   */
  async checkPaymentStatus(paymentId: string): Promise<string> {
    const response = await axios.post(
      `${this.apiUrl}/payments/find`,
      { TransactionId: paymentId },
      {
        auth: {
          username: this.merchantId,
          password: this.secretKey,
        },
      }
    );

    return response.data.Model.Status; // Completed, Pending, Failed
  }

  /**
   * Отправить пользователю QR-код
   */
  async sendQRCode(ctx: any, subscriptionType: 'premium' | 'vip', duration: number) {
    const prices = {
      premium: { 1: 299, 3: 799, 12: 2999 },
      vip: { 1: 999, 3: 2799, 12: 9999 },
    };

    const amount = prices[subscriptionType][duration];
    const orderId = `${ctx.from.id}_${subscriptionType}_${duration}_${Date.now()}`;
    const description = `${subscriptionType.toUpperCase()} подписка на ${duration} мес.`;

    // Создаем платеж
    const payment = await this.createSBPPayment({
      amount,
      orderId,
      description,
    });

    // Отправляем QR-код пользователю
    await ctx.replyWithPhoto(
      { url: payment.qrUrl },
      {
        caption:
          `💳 Оплата через СБП\n\n` +
          `💰 Сумма: ${amount}₽\n` +
          `📱 Отсканируйте QR-код\n` +
          `   в приложении вашего банка\n\n` +
          `⏱ QR-код действителен 15 минут\n\n` +
          `После оплаты подписка активируется автоматически`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Я оплатил',
                callback_data: `check_payment_${payment.paymentId}`,
              },
            ],
            [{ text: '❌ Отменить', callback_data: 'cancel_payment' }],
          ],
        },
      }
    );

    // Запускаем проверку статуса каждые 5 секунд
    this.startPaymentCheck(ctx, payment.paymentId, orderId);
  }

  /**
   * Автоматическая проверка статуса оплаты
   */
  private async startPaymentCheck(ctx: any, paymentId: string, orderId: string) {
    const maxAttempts = 180; // 15 минут (180 * 5 сек)
    let attempts = 0;

    const checkInterval = setInterval(async () => {
      attempts++;

      try {
        const status = await this.checkPaymentStatus(paymentId);

        if (status === 'Completed') {
          clearInterval(checkInterval);

          // Активируем подписку
          const [userId, type, duration] = orderId.split('_');
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + parseInt(duration));

          await googleSheetsService.updateSubscription(
            parseInt(userId),
            type as any,
            expiresAt
          );

          await ctx.reply(
            `🎉 Оплата получена!\n\n` +
            `✅ ${type.toUpperCase()} подписка активирована\n` +
            `📅 Действует до: ${expiresAt.toLocaleDateString()}`
          );
        } else if (status === 'Failed') {
          clearInterval(checkInterval);
          await ctx.reply('❌ Оплата не прошла. Попробуйте еще раз.');
        }

        if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          await ctx.reply('⏱ Время ожидания оплаты истекло.');
        }
      } catch (error) {
        console.error('Payment check error:', error);
      }
    }, 5000); // проверяем каждые 5 секунд
  }
}

export const sbpService = new SBPService();
```

---

## 🎨 UI/UX для оплаты

### Сценарий 1: Через Telegram Payments

```
Пользователь → /premium
   ↓
Бот: Выберите тариф
   [Premium 299₽/мес]
   [Premium 799₽/3 мес] (-11%)
   [Premium 2999₽/год] (-16%)
   ↓
Пользователь нажимает кнопку
   ↓
Telegram показывает стандартную форму оплаты
   [Оплатить через СБП]
   [Оплатить картой]
   ↓
Выбор СБП → QR-код
   ↓
Сканирование в банковском приложении
   ↓
Подтверждение
   ↓
✅ Подписка активирована
```

### Сценарий 2: Прямая интеграция

```
Пользователь → /premium
   ↓
Бот: Выберите способ оплаты
   [💳 СБП (рекомендуем - без комиссии)]
   [💰 ЮMoney]
   [💳 Банковская карта]
   ↓
Выбор СБП
   ↓
Бот отправляет QR-код
   ↓
Пользователь сканирует в банке
   ↓
Оплата → автоматическая проверка
   ↓
✅ Подписка активирована
```

---

## 💰 Тарифы и скидки

### Premium подписка:

| Период | Цена | Цена/месяц | Скидка |
|--------|------|------------|--------|
| 1 месяц | 299₽ | 299₽ | - |
| 3 месяца | 799₽ | 266₽ | -11% |
| 12 месяцев | 2999₽ | 250₽ | -16% |

### VIP подписка:

| Период | Цена | Цена/месяц | Скидка |
|--------|------|------------|--------|
| 1 месяц | 999₽ | 999₽ | - |
| 3 месяца | 2799₽ | 933₽ | -7% |
| 12 месяцев | 9999₽ | 833₽ | -17% |

---

## 📊 Google Sheets: Лист "Payments"

Структура для отслеживания платежей:

```
A: payment_id
B: user_id
C: subscription_type (premium/vip)
D: duration (1/3/12)
E: amount
F: currency (RUB)
G: payment_method (sbp/card/yoomoney)
H: status (pending/completed/failed)
I: provider_payment_id
J: created_at
K: completed_at
L: expires_at
```

---

## 🔔 Автоматические уведомления

### За 7 дней до окончания:

```
⏰ Ваша Premium подписка заканчивается через 7 дней

📅 Дата окончания: 20 января 2026

Продлите сейчас со скидкой 10%:
[Продлить за 269₽] (вместо 299₽)
```

### За 1 день до окончания:

```
⚠️ Завтра заканчивается доступ к Premium

Продлите прямо сейчас:
[💳 Оплатить через СБП]
[💰 Другие способы]
```

### После окончания:

```
😔 Ваша Premium подписка истекла

Вы вернулись на Free тариф:
❌ Ограничение 3 города
❌ 3 запроса в день

Восстановите доступ:
[Оформить Premium]
[Узнать о VIP]
```

---

## 🚀 План внедрения

### Этап 1: Регистрация (1 день)
1. Зарегистрироваться на ЮMoney
2. Создать магазин
3. Получить токен провайдера
4. Активировать СБП

### Этап 2: Интеграция (2-3 дня)
1. Добавить payment.service.ts
2. Обработчики для инвойсов
3. Лист Payments в Google Sheets
4. Тестирование оплаты

### Этап 3: UI (1 день)
1. Меню выбора подписки
2. Кнопки оплаты
3. Сообщения подтверждения

### Этап 4: Автоматизация (1 день)
1. Проверка истечения подписки
2. Уведомления
3. Автопродление (опционально)

**Общее время: 5-6 дней**

---

## 📈 Прогноз доходов с СБП

### Конверсия Free → Premium:

| Месяц | Пользователи | Конверсия | Платящих | Доход |
|-------|--------------|-----------|----------|-------|
| 1 | 1,000 | 5% | 50 | 14,950₽ |
| 3 | 5,000 | 6% | 300 | 89,700₽ |
| 6 | 10,000 | 8% | 800 | 239,200₽ |
| 12 | 20,000 | 10% | 2,000 | 598,000₽ |

**СБП увеличивает конверсию на 15-20%** за счет:
- Отсутствия комиссий для пользователя
- Привычный способ оплаты
- Быстрота (1-2 секунды)

---

**Следующий шаг:** Зарегистрироваться на ЮMoney и получить токен провайдера! 💳
