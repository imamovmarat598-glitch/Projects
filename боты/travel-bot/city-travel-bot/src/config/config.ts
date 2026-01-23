import dotenv from 'dotenv';

dotenv.config();

export const config = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    paymentProviderToken: process.env.PAYMENT_PROVIDER_TOKEN || '',
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/city_travel_bot',
  },
  api: {
    kudago: {
      baseUrl: process.env.KUDAGO_API_URL || 'https://kudago.com/public-api/v1.4',
    },
    yandexMaps: {
      apiKey: process.env.YANDEX_MAPS_API_KEY || '',
    },
    googlePlaces: {
      apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
    },
  },
  pricing: {
    premium: parseInt(process.env.PREMIUM_PRICE || '299'),
    vip: parseInt(process.env.VIP_PRICE || '999'),
  },
  limits: {
    freeCities: parseInt(process.env.FREE_CITIES_LIMIT || '3'),
    freeRequestsPerDay: parseInt(process.env.FREE_REQUESTS_PER_DAY || '3'),
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
  },
};

// Валидация обязательных переменных окружения
export function validateConfig() {
  if (!config.telegram.botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is required');
  }
}
