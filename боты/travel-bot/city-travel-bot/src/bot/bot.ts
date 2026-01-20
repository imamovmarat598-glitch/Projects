import { Telegraf, Context, Scenes } from 'telegraf';
import { config } from '../config/config.js';
import { safeUserDb, safeSearchHistoryDb } from './db-safe.js';
import { kudagoService } from '../services/kudago.service.js';
import * as keyboards from './keyboards.js';

export interface BotContext extends Context {
  session?: {
    city?: string;
    dateFrom?: Date;
    dateTo?: Date;
    userId?: number;
  };
}

class TravelBot {
  public bot: Telegraf<BotContext>;

  constructor() {
    this.bot = new Telegraf<BotContext>(config.telegram.botToken);
    this.setupHandlers();
  }

  private setupHandlers() {
    // Команда /start
    this.bot.start(async (ctx) => {
      const telegramId = ctx.from.id;
      const userData = {
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
      };

      // Создаем пользователя (работает с БД или без неё)
      await safeUserDb.findOrCreate(telegramId, userData);

      await ctx.reply(
        `👋 Привет, ${ctx.from.first_name}!\n\n` +
        `Я помогу спланировать поездку в любой город.\n\n` +
        `Выбери город, укажи даты — и получи:\n` +
        `✅ Афишу концертов и событий\n` +
        `✅ Лучшие отели с ценами\n` +
        `✅ Готовый маршрут\n` +
        `✅ Достопримечательности\n\n` +
        `🆓 Бесплатно: ${config.limits.freeCities} города, ${config.limits.freeRequestsPerDay} запроса/день\n` +
        `💎 Premium (${config.pricing.premium}₽/мес): все города, без ограничений\n\n` +
        `Начнем? Выбери город 👇`,
        keyboards.mainMenu()
      );
    });

    // Команда /help
    this.bot.help(async (ctx) => {
      await ctx.reply(
        `📖 <b>Как пользоваться ботом:</b>\n\n` +
        `1️⃣ Выберите город из списка\n` +
        `2️⃣ Укажите даты поездки\n` +
        `3️⃣ Получите афишу, отели и маршруты\n\n` +
        `🆓 <b>Бесплатный тариф:</b>\n` +
        `• Доступ к ${config.limits.freeCities} городам\n` +
        `• ${config.limits.freeRequestsPerDay} запроса в день\n\n` +
        `💎 <b>Premium подписка (${config.pricing.premium}₽/мес):</b>\n` +
        `• Все города России\n` +
        `• Неограниченные запросы\n` +
        `• Персональные маршруты\n\n` +
        `❓ Возникли вопросы? Напишите /support`,
        { parse_mode: 'HTML', ...keyboards.mainMenu() }
      );
    });

    // Выбор города
    this.bot.hears('🏙 Выбрать город', async (ctx) => {
      const user = await safeUserDb.getByTelegramId(ctx.from.id);
      if (!user) {
        await ctx.reply('Ошибка. Используйте /start');
        return;
      }

      const subscription = await safeUserDb.checkSubscription(user.id);

      if (subscription === 'free') {
        await ctx.reply(
          `Выберите город из доступных:\n\n` +
          `💎 <b>Premium подписка</b> открывает доступ ко всем городам России!`,
          { parse_mode: 'HTML', ...keyboards.freeCitiesKeyboard() }
        );
      } else {
        await ctx.reply(
          'Выберите город:',
          keyboards.allCitiesKeyboard()
        );
      }
    });

    // Обработка выбора города
    const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Сочи', 'Новосибирск', 'Краснодар', 'Нижний Новгород', 'Владивосток', 'Калининград'];

    cities.forEach(city => {
      this.bot.hears(city, async (ctx) => {
        const user = await safeUserDb.getByTelegramId(ctx.from.id);
        if (!user) return;

        // Проверка лимитов
        const { allowed, remaining } = await safeUserDb.checkRequestLimit(user.id);
        if (!allowed) {
          await ctx.reply(
            `⚠️ Достигнут лимит запросов (${config.limits.freeRequestsPerDay}/день)\n\n` +
            `💎 Оформите Premium подписку для безлимитного доступа!`,
            keyboards.subscriptionKeyboard()
          );
          return;
        }

        // Сохраняем выбранный город в сессии
        if (!ctx.session) ctx.session = {};
        ctx.session.city = city;
        ctx.session.userId = user.id;

        await ctx.reply(
          `Отлично! Вы выбрали ${city} 🏙\n\n` +
          `Теперь укажите, на сколько дней планируете поездку:`,
          keyboards.durationKeyboard()
        );
      });
    });

    // Обработка длительности поездки
    this.bot.hears('1 день', async (ctx) => await this.handleDuration(ctx, 1));
    this.bot.hears('Выходные (2 дня)', async (ctx) => await this.handleDuration(ctx, 2));
    this.bot.hears('3-5 дней', async (ctx) => await this.handleDuration(ctx, 4));
    this.bot.hears('Неделя', async (ctx) => await this.handleDuration(ctx, 7));

    // Показать афишу
    this.bot.hears('🎭 Афиша', async (ctx) => {
      if (!ctx.session?.city) {
        await ctx.reply('Сначала выберите город', keyboards.mainMenu());
        return;
      }

      await ctx.reply('🔍 Ищу события...');

      const citySlug = await kudagoService.getCitySlug(ctx.session.city);
      if (!citySlug) {
        await ctx.reply('Город не найден в базе данных');
        return;
      }

      const events = await kudagoService.getEvents(
        citySlug,
        ctx.session.dateFrom,
        ctx.session.dateTo,
        10
      );

      if (events.length === 0) {
        await ctx.reply(
          `😔 К сожалению, на выбранные даты событий не найдено.\n\n` +
          `Попробуйте выбрать другие даты или посмотрите достопримечательности.`,
          keyboards.resultsMenu()
        );
        return;
      }

      await ctx.reply(
        `📍 ${ctx.session.city}, ${ctx.session.dateFrom?.toLocaleDateString('ru-RU')} - ${ctx.session.dateTo?.toLocaleDateString('ru-RU')}\n\n` +
        `🎭 Найдено событий: ${events.length}`,
        keyboards.resultsMenu()
      );

      // Отправляем первые 5 событий
      for (let i = 0; i < Math.min(5, events.length); i++) {
        const event = events[i];
        const message = kudagoService.formatEventMessage(event);

        try {
          if (event.images && event.images.length > 0) {
            await ctx.replyWithPhoto(event.images[0].image, {
              caption: message,
              parse_mode: 'HTML',
              ...keyboards.eventButtons(event.site_url),
            });
          } else {
            await ctx.reply(message, {
              parse_mode: 'HTML',
              ...keyboards.eventButtons(event.site_url),
            });
          }
        } catch (error) {
          console.error('Error sending event:', error);
        }
      }

      if (events.length > 5) {
        await ctx.reply(`И еще ${events.length - 5} событий! 🎉`);
      }
    });

    // Отели (заглушка)
    this.bot.hears('🏨 Отели', async (ctx) => {
      if (!ctx.session?.city) {
        await ctx.reply('Сначала выберите город', keyboards.mainMenu());
        return;
      }

      await ctx.reply(
        `🏨 <b>Отели в городе ${ctx.session.city}</b>\n\n` +
        `⭐️⭐️⭐️⭐️⭐️ Rival Hotel\n` +
        `💰 4500₽/ночь\n` +
        `📍 В центре города\n\n` +
        `⭐️⭐️⭐️⭐️ Hampton by Hilton\n` +
        `💰 3200₽/ночь\n` +
        `📍 1.2 км от центра\n\n` +
        `💎 Premium: полный список отелей с бронированием`,
        { parse_mode: 'HTML', ...keyboards.resultsMenu() }
      );
    });

    // Premium подписка
    this.bot.hears('💎 Premium подписка', async (ctx) => {
      await ctx.reply(
        `💎 <b>Premium подписка</b>\n\n` +
        `<b>Преимущества:</b>\n` +
        `✅ Все города России (100+)\n` +
        `✅ Неограниченные запросы\n` +
        `✅ Полный список отелей с ценами\n` +
        `✅ Персональные маршруты\n` +
        `✅ Экспорт в PDF/Google Maps\n` +
        `✅ Уведомления о новых событиях\n\n` +
        `💰 Цена: ${config.pricing.premium}₽/месяц\n\n` +
        `👑 <b>VIP подписка (${config.pricing.vip}₽/мес):</b>\n` +
        `Все из Premium + AI-рекомендации + Консьерж-сервис`,
        { parse_mode: 'HTML', ...keyboards.subscriptionKeyboard() }
      );
    });

    // Избранное
    this.bot.hears('⭐️ Избранное', async (ctx) => {
      await ctx.reply(
        `⭐️ <b>Избранные города</b>\n\n` +
        `Пока пусто. Добавьте города в избранное, чтобы получать уведомления о новых событиях!`,
        { parse_mode: 'HTML', ...keyboards.mainMenu() }
      );
    });

    // Настройки
    this.bot.hears('⚙️ Настройки', async (ctx) => {
      const user = await safeUserDb.getByTelegramId(ctx.from.id);
      if (!user) return;

      const subscription = await safeUserDb.checkSubscription(user.id);
      const subscriptionText = subscription === 'free' ? '🆓 Бесплатная' : subscription === 'premium' ? '💎 Premium' : '👑 VIP';

      await ctx.reply(
        `⚙️ <b>Настройки</b>\n\n` +
        `👤 ${ctx.from.first_name}\n` +
        `📊 Подписка: ${subscriptionText}\n` +
        `📅 Запросов сегодня: ${user.requests_today}/${subscription === 'free' ? config.limits.freeRequestsPerDay : '∞'}\n\n` +
        `Выберите раздел:`,
        { parse_mode: 'HTML', ...keyboards.settingsKeyboard() }
      );
    });

    // Назад в меню
    this.bot.hears(['◀️ Назад', '◀️ Назад в меню'], async (ctx) => {
      await ctx.reply('Главное меню:', keyboards.mainMenu());
    });

    // Обработка inline кнопок
    this.bot.action('buy_premium', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply(
        `💎 <b>Оформление Premium подписки</b>\n\n` +
        `Цена: ${config.pricing.premium}₽/месяц\n\n` +
        `После оплаты вам станут доступны все города и функции!`,
        { parse_mode: 'HTML', ...keyboards.confirmPaymentKeyboard('premium') }
      );
    });

    this.bot.action('buy_vip', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply(
        `👑 <b>Оформление VIP подписки</b>\n\n` +
        `Цена: ${config.pricing.vip}₽/месяц\n\n` +
        `Максимальный уровень сервиса!`,
        { parse_mode: 'HTML', ...keyboards.confirmPaymentKeyboard('vip') }
      );
    });

    this.bot.action(/^pay_(premium|vip)$/, async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.reply(
        `⚠️ Интеграция платежей в разработке.\n\n` +
        `Для подключения нужно:\n` +
        `1. Получить токен от платежного провайдера\n` +
        `2. Настроить PAYMENT_PROVIDER_TOKEN в .env\n\n` +
        `Инструкция: https://core.telegram.org/bots/payments`
      );
    });
  }

  private async handleDuration(ctx: BotContext, days: number) {
    if (!ctx.session?.city || !ctx.session?.userId) {
      await ctx.reply('Сначала выберите город', keyboards.mainMenu());
      return;
    }

    const dateFrom = new Date();
    const dateTo = new Date();
    dateTo.setDate(dateTo.getDate() + days);

    ctx.session.dateFrom = dateFrom;
    ctx.session.dateTo = dateTo;

    // Увеличиваем счетчик запросов
    await safeUserDb.incrementRequests(ctx.session.userId);

    // Сохраняем в историю
    await safeSearchHistoryDb.add(
      ctx.session.userId,
      ctx.session.city,
      dateFrom,
      dateTo
    );

    await ctx.reply(
      `✅ Отлично! Ищу информацию для поездки:\n\n` +
      `📍 Город: ${ctx.session.city}\n` +
      `📅 Даты: ${dateFrom.toLocaleDateString('ru-RU')} - ${dateTo.toLocaleDateString('ru-RU')}\n\n` +
      `Выберите, что вас интересует:`,
      keyboards.resultsMenu()
    );
  }

  public launch() {
    this.bot.launch();
    console.log('✅ Bot launched successfully');

    // Graceful shutdown
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}

export const travelBot = new TravelBot();
