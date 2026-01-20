import { Telegraf } from 'telegraf';
import { config } from '../config/config.js';
import { userDb, paymentsDb } from '../database/db.js';

export type SubscriptionType = 'premium' | 'vip';

export interface PaymentData {
  userId: number;
  subscriptionType: SubscriptionType;
  amount: number;
  currency: string;
}

class PaymentService {
  private readonly providerToken = config.telegram.paymentProviderToken;

  // Создать счет на оплату
  async createInvoice(
    bot: Telegraf,
    chatId: number,
    paymentData: PaymentData
  ): Promise<void> {
    if (!this.providerToken) {
      throw new Error('Payment provider token not configured');
    }

    const title = paymentData.subscriptionType === 'premium'
      ? '💎 Premium подписка'
      : '👑 VIP подписка';

    const description = paymentData.subscriptionType === 'premium'
      ? 'Доступ ко всем городам и функциям на 1 месяц'
      : 'VIP подписка: все функции + AI + консьерж на 1 месяц';

    const payload = JSON.stringify({
      userId: paymentData.userId,
      subscriptionType: paymentData.subscriptionType,
    });

    await bot.telegram.sendInvoice(chatId, {
      title,
      description,
      payload,
      provider_token: this.providerToken,
      currency: paymentData.currency,
      prices: [
        {
          label: title,
          amount: paymentData.amount * 100, // в копейках
        },
      ],
    });
  }

  // Обработать успешную оплату
  async handleSuccessfulPayment(
    userId: number,
    subscriptionType: SubscriptionType,
    amount: number,
    providerPaymentId: string
  ): Promise<void> {
    // Создать запись о платеже
    const paymentId = await paymentsDb.create(
      userId,
      amount,
      subscriptionType,
      'telegram'
    );

    // Обновить статус платежа
    await paymentsDb.updateStatus(paymentId, 'completed', providerPaymentId);

    // Активировать подписку на 30 дней
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await userDb.updateSubscription(userId, subscriptionType, expiresAt);
  }

  // Проверить статус подписки и продлить если истекла
  async checkAndRenewSubscription(userId: number): Promise<{
    active: boolean;
    type: 'free' | 'premium' | 'vip';
    expiresAt?: Date;
  }> {
    const subscriptionType = await userDb.checkSubscription(userId);
    const user = await userDb.getByTelegramId(userId);

    if (!user) {
      return { active: false, type: 'free' };
    }

    if (subscriptionType === 'free') {
      return { active: false, type: 'free' };
    }

    return {
      active: true,
      type: subscriptionType,
      expiresAt: user.subscription_expires_at,
    };
  }

  // Получить цену подписки
  getSubscriptionPrice(type: SubscriptionType): number {
    return type === 'premium' ? config.pricing.premium : config.pricing.vip;
  }

  // Создать описание подписки
  getSubscriptionDescription(type: SubscriptionType): string {
    if (type === 'premium') {
      return `💎 <b>Premium подписка</b>\n\n` +
        `<b>Преимущества:</b>\n` +
        `✅ Все города России (100+)\n` +
        `✅ Неограниченные запросы\n` +
        `✅ Полный список отелей с ценами\n` +
        `✅ Персональные маршруты\n` +
        `✅ Экспорт в PDF/Google Maps\n` +
        `✅ Уведомления о новых событиях\n\n` +
        `💰 Цена: ${config.pricing.premium}₽/месяц`;
    } else {
      return `👑 <b>VIP подписка</b>\n\n` +
        `<b>Все из Premium +</b>\n` +
        `✅ AI-рекомендации на основе предпочтений\n` +
        `✅ Эксклюзивные скидки на билеты и отели\n` +
        `✅ Консьерж-сервис (помощь в бронировании)\n` +
        `✅ Приоритетная поддержка\n\n` +
        `💰 Цена: ${config.pricing.vip}₽/месяц`;
    }
  }
}

export const paymentService = new PaymentService();
