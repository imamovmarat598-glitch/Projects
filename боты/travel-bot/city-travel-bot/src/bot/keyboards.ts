import { Markup } from 'telegraf';

// Топовые города России
export const popularCities = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Сочи',
  'Екатеринбург',
  'Нижний Новгород',
];

/**
 * Главное меню
 */
export function getMainMenuKeyboard() {
  return Markup.keyboard([
    ['🔍 Поиск города', '⭐️ Избранное'],
    ['ℹ️ Помощь'],
  ])
    .resize()
    .persistent();
}

/**
 * Клавиатура выбора популярных городов
 */
export function getCitiesKeyboard() {
  const buttons = [
    ...popularCities.map((city) => Markup.button.callback(city, `city:${city}`)),
    Markup.button.callback('✍️ Другой город', 'city:custom'),
  ];

  // Разбиваем кнопки по 2 в ряду
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  return Markup.inlineKeyboard(rows);
}

/**
 * Клавиатура выбора длительности поездки
 */
export function getDurationKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('1 день', 'duration:1'),
      Markup.button.callback('2 дня', 'duration:2'),
    ],
    [
      Markup.button.callback('3 дня', 'duration:3'),
      Markup.button.callback('Неделя', 'duration:7'),
    ],
    [Markup.button.callback('📅 Указать даты', 'duration:custom')],
    [Markup.button.callback('« Назад', 'back_to_cities')],
  ]);
}

/**
 * Клавиатура с гостиницами
 */
export function getHotelsKeyboard(hotels: any[]) {
  if (!hotels || hotels.length === 0) {
    return Markup.inlineKeyboard([
      [Markup.button.callback('« Назад', 'back_to_results')],
    ]);
  }

  const buttons = hotels.slice(0, 5).map((hotel, index) => {
    const stars = '⭐'.repeat(hotel.stars || 3);
    const price = hotel.price ? ` • от ${hotel.price}₽` : '';
    return [
      Markup.button.callback(
        `${hotel.name} ${stars}${price}`,
        `hotel:${index}`
      ),
    ];
  });

  buttons.push([Markup.button.callback('« Назад', 'back_to_results')]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Кнопки для деталей гостиницы
 */
export function getHotelDetailsKeyboard(hotelUrl?: string) {
  const buttons = [];

  if (hotelUrl) {
    buttons.push([Markup.button.url('🔗 Забронировать', hotelUrl)]);
  }

  buttons.push([Markup.button.callback('« Назад к списку', 'back_to_hotels')]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Кнопки для событий с подпиской
 */
export function getEventsKeyboard(events: any[]) {
  if (!events || events.length === 0) {
    return Markup.inlineKeyboard([
      [Markup.button.callback('« Назад', 'back_to_results')],
    ]);
  }

  const buttons = events.slice(0, 5).map((event, index) => [
    Markup.button.callback(
      `${event.title.substring(0, 35)}...`,
      `event:${index}`
    ),
  ]);

  buttons.push([Markup.button.callback('« Назад', 'back_to_results')]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Кнопки для деталей события с подпиской
 */
export function getEventDetailsKeyboard(eventId: string, isSubscribed: boolean, eventUrl?: string) {
  const buttons = [];

  // Кнопка подписки
  if (isSubscribed) {
    buttons.push([Markup.button.callback('✅ Я пойду (подписан)', `unsubscribe:${eventId}`)]);
  } else {
    buttons.push([Markup.button.callback('🔔 Я пойду!', `subscribe:${eventId}`)]);
  }

  if (eventUrl) {
    buttons.push([Markup.button.url('🔗 Подробнее', eventUrl)]);
  }

  buttons.push([Markup.button.callback('« Назад к событиям', 'back_to_events')]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Кнопки для результатов поиска (главное меню результатов)
 */
export function getResultsMenuKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🎭 События', 'view:events'),
      Markup.button.callback('🏛 Достопримечательности', 'view:attractions'),
    ],
    [
      Markup.button.callback('🏨 Гостиницы', 'view:hotels'),
      Markup.button.callback('🎬 Кино', 'view:cinema'),
    ],
    [Markup.button.callback('🔄 Новый поиск', 'new_search')],
  ]);
}

/**
 * Кнопки для избранного
 */
export function getFavoritesKeyboard(favorites: string[]) {
  if (!favorites || favorites.length === 0) {
    return Markup.inlineKeyboard([
      [Markup.button.callback('➕ Добавить город', 'add_favorite')],
    ]);
  }

  const buttons = favorites.map((city) => [
    Markup.button.callback(`📍 ${city}`, `fav_city:${city}`),
    Markup.button.callback('🗑', `remove_fav:${city}`),
  ]);

  buttons.push([Markup.button.callback('➕ Добавить город', 'add_favorite')]);

  return Markup.inlineKeyboard(buttons);
}

/**
 * Кнопка "Назад"
 */
export function getBackButton(callback: string, text: string = '« Назад') {
  return Markup.inlineKeyboard([[Markup.button.callback(text, callback)]]);
}
