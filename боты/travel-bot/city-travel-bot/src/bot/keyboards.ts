import { Markup } from 'telegraf';

// Главное меню
export const mainMenu = () => {
  return Markup.keyboard([
    ['🏙 Выбрать город', '⭐️ Избранное'],
    ['💎 Premium подписка', '⚙️ Настройки'],
  ]).resize();
};

// Популярные города (для free-пользователей)
export const freeCitiesKeyboard = () => {
  return Markup.keyboard([
    ['Москва', 'Санкт-Петербург'],
    ['Казань', 'Екатеринбург'],
    ['Сочи'],
    ['◀️ Назад'],
  ]).resize();
};

// Все города (для premium)
export const allCitiesKeyboard = () => {
  return Markup.keyboard([
    ['Москва', 'Санкт-Петербург'],
    ['Казань', 'Екатеринбург'],
    ['Сочи', 'Новосибирск'],
    ['Краснодар', 'Нижний Новгород'],
    ['Владивосток', 'Калининград'],
    ['◀️ Назад'],
  ]).resize();
};

// Выбор длительности поездки
export const durationKeyboard = () => {
  return Markup.keyboard([
    ['1 день', 'Выходные (2 дня)'],
    ['3-5 дней', 'Неделя'],
    ['Указать даты вручную'],
    ['◀️ Назад'],
  ]).resize();
};

// Категории результатов
export const resultsMenu = () => {
  return Markup.keyboard([
    ['🎭 Афиша', '🏨 Отели'],
    ['🗺 Маршрут', '🏛 Достопримечательности'],
    ['◀️ Назад в меню'],
  ]).resize();
};

// Inline кнопки для события
export const eventButtons = (eventUrl: string) => {
  return Markup.inlineKeyboard([
    [Markup.button.url('🎟 Купить билет', eventUrl)],
    [Markup.button.callback('➕ Добавить в маршрут', 'add_to_route')],
  ]);
};

// Inline кнопки для отеля
export const hotelButtons = (bookingUrl: string) => {
  return Markup.inlineKeyboard([
    [Markup.button.url('🏨 Забронировать', bookingUrl)],
    [Markup.button.callback('📍 На карте', 'show_on_map')],
  ]);
};

// Кнопки подписки
export const subscriptionKeyboard = () => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('💎 Premium (299₽/мес)', 'buy_premium')],
    [Markup.button.callback('👑 VIP (999₽/мес)', 'buy_vip')],
    [Markup.button.callback('◀️ Назад', 'back_to_menu')],
  ]);
};

// Кнопки настроек
export const settingsKeyboard = () => {
  return Markup.keyboard([
    ['📊 Моя подписка', '📜 История поисков'],
    ['🔔 Уведомления', '❓ Помощь'],
    ['◀️ Назад в меню'],
  ]).resize();
};

// Inline кнопки для избранного
export const favoriteButtons = (city: string) => {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🔔 Уведомления вкл/выкл', `notify_${city}`)],
    [Markup.button.callback('🗑 Удалить', `remove_fav_${city}`)],
  ]);
};

// Кнопки подтверждения платежа
export const confirmPaymentKeyboard = (subscriptionType: 'premium' | 'vip') => {
  const price = subscriptionType === 'premium' ? 299 : 999;
  return Markup.inlineKeyboard([
    [Markup.button.callback(`✅ Оплатить ${price}₽`, `pay_${subscriptionType}`)],
    [Markup.button.callback('❌ Отменить', 'cancel_payment')],
  ]);
};
