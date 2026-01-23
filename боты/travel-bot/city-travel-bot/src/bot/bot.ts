import { Telegraf, Context, session } from 'telegraf';
import { config } from '../config/config.js';
import { safeUserDb, safeSearchHistoryDb } from './db-safe.js';
import { kudagoService } from '../services/kudago.service.js';
import { n8nService } from '../services/n8n.service.js';
import { userRequestsService } from '../services/userRequests.service.js';
import * as keyboards from './keyboards.js';

export interface SessionData {
  city?: string;
  dateFrom?: Date;
  dateTo?: Date;
  userId?: number;
  searchResults?: any; // Результаты поиска из n8n
  currentEvent?: any; // Текущее выбранное событие
  currentHotel?: any; // Текущий выбранный отель
  awaitingCustomCity?: boolean; // Ожидание ввода города
  awaitingCustomDates?: boolean; // Ожидание ввода дат
}

export interface BotContext extends Context {
  session: SessionData;
}

class TravelBot {
  public bot: Telegraf<BotContext>;

  constructor() {
    this.bot = new Telegraf<BotContext>(config.telegram.botToken);

    // Подключаем middleware для сессий
    this.bot.use(session({
      defaultSession: () => ({
        city: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        userId: undefined,
        searchResults: undefined,
        currentEvent: undefined,
        currentHotel: undefined,
        awaitingCustomCity: false,
        awaitingCustomDates: false,
      })
    }));

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
        `Я помогу спланировать поездку в любой город России.\n\n` +
        `🤖 С помощью AI я найду для вас:\n` +
        `🎭 Афишу концертов и событий\n` +
        `🏛 Достопримечательности\n` +
        `🏨 Гостиницы с хорошими отзывами\n` +
        `🎬 Кино в городе\n\n` +
        `Нажмите "🔍 Поиск города" чтобы начать!`,
        keyboards.getMainMenuKeyboard()
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
        { parse_mode: 'HTML', ...keyboards.getMainMenuKeyboard() }
      );
    });

    // Команда /stats - статистика (admin)
    this.bot.command('stats', async (ctx) => {
      try {
        const stats = await userRequestsService.getOverallStats();
        const topCities = await userRequestsService.getCityStats(5);

        let message = `📊 <b>Статистика Travel Bot</b>\n\n`;
        message += `📈 <b>Общая статистика:</b>\n`;
        message += `• Всего запросов: ${stats.total}\n`;
        message += `• Успешных: ${stats.successful} ✅\n`;
        message += `• Ошибок: ${stats.failed} ❌\n`;
        message += `• Success rate: ${stats.success_rate}%\n\n`;

        if (topCities.length > 0) {
          message += `🏙 <b>Топ-5 городов:</b>\n`;
          topCities.forEach((city: any, index: number) => {
            message += `${index + 1}. ${city.city} - ${city.count} запросов\n`;
          });
        }

        await ctx.reply(message, { parse_mode: 'HTML' });
      } catch (error) {
        await ctx.reply('Ошибка при получении статистики');
      }
    });

    // Команда /history - история запросов пользователя
    this.bot.command('history', async (ctx) => {
      try {
        const requests = await userRequestsService.getUserRequests(ctx.from.id, 5);

        if (requests.length === 0) {
          await ctx.reply('У вас пока нет запросов');
          return;
        }

        let message = `📜 <b>Ваши последние запросы:</b>\n\n`;
        requests.forEach((req: any, index: number) => {
          const date = new Date(req.created_at).toLocaleDateString('ru-RU');
          const status = req.success ? '✅' : '❌';
          message += `${index + 1}. ${status} ${req.city} - ${date}\n`;
        });

        await ctx.reply(message, { parse_mode: 'HTML' });
      } catch (error) {
        await ctx.reply('Ошибка при получении истории');
      }
    });

    // Выбор города - новая версия с кнопками
    this.bot.hears('🔍 Поиск города', async (ctx) => {
      await ctx.reply(
        'Выберите город из списка или введите свой:',
        keyboards.getCitiesKeyboard()
      );
    });


    // Избранное
    this.bot.hears('⭐️ Избранное', async (ctx) => {
      await ctx.reply(
        `⭐️ <b>Избранные города</b>\n\n` +
        `Пока пусто. Добавьте города в избранное, чтобы получать уведомления о новых событиях!`,
        { parse_mode: 'HTML', ...keyboards.getMainMenuKeyboard() }
      );
    });

    // Помощь
    this.bot.hears('ℹ️ Помощь', async (ctx) => {
      await ctx.reply(
        `📖 <b>Как пользоваться ботом:</b>\n\n` +
        `1️⃣ Нажмите "🔍 Поиск города"\n` +
        `2️⃣ Выберите город из списка или введите свой\n` +
        `3️⃣ Укажите длительность поездки\n` +
        `4️⃣ Получите полную информацию:\n` +
        `   • 🎭 События и афиша\n` +
        `   • 🏛 Достопримечательности\n` +
        `   • 🏨 Гостиницы с отзывами\n` +
        `   • 🎬 Кино\n\n` +
        `💡 <b>Подписка на события:</b>\n` +
        `Нажмите "Я пойду!" на событии — я напомню за 24ч и 30 минут до начала!\n\n` +
        `❓ Вопросы? Напишите /support`,
        { parse_mode: 'HTML', ...keyboards.getMainMenuKeyboard() }
      );
    });

    // Обработка текстовых сообщений (ввод города или дат)
    this.bot.on('text', async (ctx, next) => {
      // Если ожидаем ввод города
      if (ctx.session.awaitingCustomCity) {
        ctx.session.awaitingCustomCity = false;
        ctx.session.city = ctx.message.text.trim();

        await ctx.reply(
          `✅ Выбран город: ${ctx.session.city}\n\nНа сколько дней планируете поездку?`,
          keyboards.getDurationKeyboard()
        );
        return;
      }

      // Если ожидаем ввод дат
      if (ctx.session.awaitingCustomDates) {
        ctx.session.awaitingCustomDates = false;
        const text = ctx.message.text.trim();

        // Парсим даты (формат: 25.01.2025 - 27.01.2025)
        const datePattern = /(\d{2})\.(\d{2})\.(\d{4})\s*-\s*(\d{2})\.(\d{2})\.(\d{4})/;
        const match = text.match(datePattern);

        if (!match) {
          await ctx.reply(
            '❌ Неверный формат дат.\n\n' +
            'Используйте формат: ДД.ММ.ГГГГ - ДД.ММ.ГГГГ\n' +
            'Например: 25.01.2025 - 27.01.2025'
          );
          ctx.session.awaitingCustomDates = true;
          return;
        }

        const [, day1, month1, year1, day2, month2, year2] = match;
        const dateFrom = new Date(parseInt(year1), parseInt(month1) - 1, parseInt(day1));
        const dateTo = new Date(parseInt(year2), parseInt(month2) - 1, parseInt(day2));

        if (dateFrom >= dateTo) {
          await ctx.reply('❌ Дата начала должна быть раньше даты окончания');
          ctx.session.awaitingCustomDates = true;
          return;
        }

        ctx.session.dateFrom = dateFrom;
        ctx.session.dateTo = dateTo;

        await ctx.reply(
          `✅ Даты поездки:\n` +
          `${dateFrom.toLocaleDateString('ru-RU')} - ${dateTo.toLocaleDateString('ru-RU')}\n\n` +
          `⏳ Ищу информацию о городе ${ctx.session.city}...\n` +
          `Это может занять 10-20 секунд.`
        );

        // Отправляем запрос в n8n
        await this.searchCity(ctx);
        return;
      }

      // Если не ожидаем специального ввода, передаем дальше
      await next();
    });

    // Назад в меню
    this.bot.hears(['◀️ Назад', '◀️ Назад в меню'], async (ctx) => {
      await ctx.reply('Главное меню:', keyboards.getMainMenuKeyboard());
    });

    // Обработка выбора города (inline кнопки)
    this.bot.action(/^city:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const cityMatch = ctx.match[1];

      if (cityMatch === 'custom') {
        // Пользователь хочет ввести свой город
        ctx.session.awaitingCustomCity = true;
        await ctx.reply('✍️ Введите название города:');
        return;
      }

      // Сохраняем выбранный город
      ctx.session.city = cityMatch;
      await ctx.editMessageText(
        `✅ Выбран город: ${cityMatch}\n\nНа сколько дней планируете поездку?`,
        keyboards.getDurationKeyboard()
      );
    });

    // Обработка выбора длительности (inline кнопки)
    this.bot.action(/^duration:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const durationMatch = ctx.match[1];

      if (durationMatch === 'custom') {
        // Пользователь хочет указать свои даты
        ctx.session.awaitingCustomDates = true;
        await ctx.reply(
          '📅 Введите даты в формате:\n' +
          'ДД.ММ.ГГГГ - ДД.ММ.ГГГГ\n\n' +
          'Например: 25.01.2025 - 27.01.2025'
        );
        return;
      }

      const days = parseInt(durationMatch);
      const dateFrom = new Date();
      const dateTo = new Date();
      dateTo.setDate(dateTo.getDate() + days);

      ctx.session.dateFrom = dateFrom;
      ctx.session.dateTo = dateTo;

      await ctx.editMessageText(
        `✅ Даты поездки:\n` +
        `${dateFrom.toLocaleDateString('ru-RU')} - ${dateTo.toLocaleDateString('ru-RU')}\n\n` +
        `⏳ Ищу информацию о городе ${ctx.session.city}...\n` +
        `Это может занять 10-20 секунд.`
      );

      // Отправляем запрос в n8n
      await this.searchCity(ctx);
    });

    // Обработка кнопок результатов
    this.bot.action('view:events', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showEvents(ctx);
    });

    this.bot.action('view:attractions', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showAttractions(ctx);
    });

    this.bot.action('view:hotels', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showHotels(ctx);
    });

    this.bot.action('view:cinema', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showCinema(ctx);
    });

    this.bot.action('new_search', async (ctx) => {
      await ctx.answerCbQuery();
      ctx.session.city = undefined;
      ctx.session.dateFrom = undefined;
      ctx.session.dateTo = undefined;
      ctx.session.searchResults = undefined;
      await ctx.reply('Выберите город:', keyboards.getCitiesKeyboard());
    });

    // Обработка выбора события
    this.bot.action(/^event:(\d+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const eventIndex = parseInt(ctx.match[1]);
      const event = ctx.session.searchResults?.events?.[eventIndex];

      if (!event) {
        await ctx.reply('Событие не найдено');
        return;
      }

      ctx.session.currentEvent = event;

      // Проверяем подписку
      // TODO: проверить в БД, подписан ли пользователь
      const isSubscribed = false;

      await ctx.editMessageText(
        `🎭 ${event.title}\n\n` +
        `${event.description || 'Без описания'}\n\n` +
        `📍 ${event.place || 'Место уточняется'}\n` +
        `📅 ${event.dates || 'Дата уточняется'}\n` +
        `💰 ${event.price || 'Бесплатно'}`,
        keyboards.getEventDetailsKeyboard(event.id, isSubscribed, event.site_url)
      );
    });

    // Подписка на событие
    this.bot.action(/^subscribe:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery('Подписка оформлена! ✅');
      const eventId = ctx.match[1];
      const event = ctx.session.currentEvent;

      if (event && event.dates) {
        // Отправляем в n8n для создания подписки
        await n8nService.subscribeToEvent(
          ctx.from.id,
          eventId,
          event.dates
        );

        await ctx.reply(
          '✅ Отлично! Я напомню вам о событии:\n' +
          '• За 24 часа до начала\n' +
          '• За 30 минут до начала'
        );
      }
    });

    // Отписка от события
    this.bot.action(/^unsubscribe:(.+)$/, async (ctx) => {
      await ctx.answerCbQuery('Вы отписаны');
      const eventId = ctx.match[1];

      await n8nService.unsubscribeFromEvent(ctx.from.id, eventId);
      await ctx.reply('Вы больше не будете получать уведомления об этом событии');
    });

    // Выбор отеля
    this.bot.action(/^hotel:(\d+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const hotelIndex = parseInt(ctx.match[1]);
      const hotel = ctx.session.searchResults?.hotels?.[hotelIndex];

      if (!hotel) {
        await ctx.reply('Гостиница не найдена');
        return;
      }

      const stars = '⭐'.repeat(hotel.stars || 3);
      await ctx.editMessageText(
        `🏨 ${hotel.name}\n\n` +
        `${stars} ${hotel.type === 'hostel' ? '(Хостел)' : '(Отель)'}\n` +
        `💰 ${hotel.price}\n` +
        `⭐ Рейтинг: ${hotel.rating}/5\n\n` +
        `✅ ${hotel.pros}`,
        keyboards.getHotelDetailsKeyboard()
      );
    });

    // Обработка кнопок "Назад"
    this.bot.action('back_to_cities', async (ctx) => {
      await ctx.answerCbQuery();
      ctx.session.city = undefined;
      await ctx.editMessageText(
        'Выберите город:',
        keyboards.getCitiesKeyboard()
      );
    });

    this.bot.action('back_to_results', async (ctx) => {
      await ctx.answerCbQuery();
      await ctx.editMessageText(
        `📍 ${ctx.session.city}\n` +
        `📅 ${ctx.session.dateFrom?.toLocaleDateString('ru-RU')} - ${ctx.session.dateTo?.toLocaleDateString('ru-RU')}\n\n` +
        `Что вас интересует?`,
        keyboards.getResultsMenuKeyboard()
      );
    });

    this.bot.action('back_to_events', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showEvents(ctx);
    });

    this.bot.action('back_to_hotels', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showHotels(ctx);
    });

    // Обработка inline кнопок
  }

  /**
   * Отправка запроса в n8n для поиска информации о городе
   */
  private async searchCity(ctx: BotContext) {
    if (!ctx.session.city || !ctx.session.dateFrom || !ctx.session.dateTo || !ctx.from) {
      await ctx.reply('Ошибка: не указан город или даты');
      return;
    }

    try {
      // Отправляем запрос в n8n webhook
      const response = await n8nService.sendCitySearchRequest({
        telegram_id: ctx.from.id,
        username: ctx.from.username,
        first_name: ctx.from.first_name,
        city: ctx.session.city,
        date_from: ctx.session.dateFrom.toISOString(),
        date_to: ctx.session.dateTo.toISOString(),
      });

      if (!response.success) {
        await ctx.reply(
          '❌ Произошла ошибка при поиске информации.\n' +
          'Попробуйте позже или выберите другой город.'
        );
        return;
      }

      // Сохраняем результаты в сессию
      ctx.session.searchResults = response;

      // Отправляем обзор города
      await ctx.reply(
        `🏙 <b>${response.city}</b>\n\n` +
        `${response.summary || 'Информация обрабатывается...'}`,
        { parse_mode: 'HTML' }
      );

      // Показываем главное меню результатов
      await ctx.reply(
        `📍 ${ctx.session.city}\n` +
        `📅 ${ctx.session.dateFrom.toLocaleDateString('ru-RU')} - ${ctx.session.dateTo.toLocaleDateString('ru-RU')}\n\n` +
        `Что вас интересует?`,
        keyboards.getResultsMenuKeyboard()
      );

    } catch (error) {
      console.error('Error searching city:', error);
      await ctx.reply(
        '❌ Произошла ошибка при обработке запроса.\n' +
        'Попробуйте позже.'
      );
    }
  }

  /**
   * Показать события
   */
  private async showEvents(ctx: BotContext) {
    const events = ctx.session.searchResults?.events || [];

    if (events.length === 0) {
      await ctx.reply(
        '😔 События на выбранные даты не найдены',
        keyboards.getResultsMenuKeyboard()
      );
      return;
    }

    let message = `🎭 <b>События в городе ${ctx.session.city}</b>\n\n`;

    events.forEach((event: any, index: number) => {
      message += `${index + 1}. <b>${event.title}</b>\n`;
      if (event.venue) {
        message += `📍 ${event.venue}\n`;
      }
      if (event.date) {
        message += `📅 ${event.date}\n`;
      }
      if (event.price) {
        message += `💰 ${event.price}\n`;
      }
      message += '\n';
    });

    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboards.getBackButton('back_to_results', '« Назад к результатам')
    });
  }

  /**
   * Показать достопримечательности
   */
  private async showAttractions(ctx: BotContext) {
    const attractions = ctx.session.searchResults?.attractions || [];

    if (attractions.length === 0) {
      await ctx.reply(
        '😔 Достопримечательности не найдены',
        keyboards.getResultsMenuKeyboard()
      );
      return;
    }

    let message = `🏛 <b>Достопримечательности ${ctx.session.city}</b>\n\n`;
    attractions.forEach((attr: any, index: number) => {
      // Если пришла строка (простой формат от n8n)
      if (typeof attr === 'string') {
        message += `${attr}\n`;
      } else {
        // Если пришел объект (расширенный формат)
        message += `${index + 1}. <b>${attr.name}</b>\n`;
        if (attr.description) {
          message += `${attr.description}\n`;
        }
        if (attr.address) {
          message += `📍 ${attr.address}\n`;
        }
        message += '\n';
      }
    });

    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboards.getBackButton('back_to_results')
    });
  }

  /**
   * Показать гостиницы
   */
  private async showHotels(ctx: BotContext) {
    const hotels = ctx.session.searchResults?.hotels || [];

    if (hotels.length === 0) {
      await ctx.reply(
        '😔 Гостиницы не найдены',
        keyboards.getResultsMenuKeyboard()
      );
      return;
    }

    let message = `🏨 <b>Гостиницы в городе ${ctx.session.city}</b>\n\n`;

    hotels.forEach((hotel: any, index: number) => {
      // Если пришла строка (простой формат от n8n)
      if (typeof hotel === 'string') {
        message += `${hotel}\n\n`;
      } else {
        // Если пришел объект (расширенный формат)
        message += `${index + 1}. <b>${hotel.name}</b>\n`;
        if (hotel.rating) {
          message += `⭐ ${hotel.rating}/5\n`;
        }
        if (hotel.price) {
          message += `💰 от ${hotel.price}₽/ночь\n`;
        }
        if (hotel.address) {
          message += `📍 ${hotel.address}\n`;
        }
        message += '\n';
      }
    });

    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboards.getBackButton('back_to_results', '« Назад к результатам')
    });
  }

  /**
   * Показать кино
   */
  private async showCinema(ctx: BotContext) {
    const cinema = ctx.session.searchResults?.cinema || [];

    if (cinema.length === 0) {
      await ctx.reply(
        '😔 Фильмы в прокате не найдены',
        keyboards.getResultsMenuKeyboard()
      );
      return;
    }

    let message = `🎬 <b>Кино в городе ${ctx.session.city}</b>\n\n`;
    cinema.slice(0, 5).forEach((movie: any, index: number) => {
      // Если пришла строка (простой формат от n8n)
      if (typeof movie === 'string') {
        message += `${movie}\n`;
      } else {
        // Если пришел объект (расширенный формат)
        message += `${index + 1}. <b>${movie.title}</b> (${movie.year || '—'})\n`;
        if (movie.description) {
          message += `${movie.description.substring(0, 100)}...\n`;
        }
        message += '\n';
      }
    });

    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboards.getBackButton('back_to_results')
    });
  }

  private async handleDuration(ctx: BotContext, days: number) {
    if (!ctx.session.city || !ctx.session.userId) {
      await ctx.reply('Сначала выберите город', keyboards.getMainMenuKeyboard());
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
      keyboards.getResultsMenuKeyboard()
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
