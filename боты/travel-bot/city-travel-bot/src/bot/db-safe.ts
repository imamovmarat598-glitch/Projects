// Безопасная обертка для работы с БД без падений
// Использует: Supabase → In-memory fallback
import { supabaseService } from '../services/supabase.service.js';

// In-memory хранилище когда БД недоступна
const memoryStorage = new Map<number, any>();
const memoryFavorites = new Map<number, string[]>();

export const safeUserDb = {
  async findOrCreate(telegramId: number, userData: any) {
    try {
      return await supabaseService.findOrCreateUser(telegramId, userData);
    } catch (error) {
      console.warn('⚠️ Supabase unavailable, using in-memory storage');
      if (!memoryStorage.has(telegramId)) {
        memoryStorage.set(telegramId, {
          id: telegramId,
          telegram_id: telegramId,
          ...userData,
          subscription_type: 'free',
          requests_today: 0,
          last_request_date: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
      return memoryStorage.get(telegramId);
    }
  },

  async getByTelegramId(telegramId: number) {
    try {
      return await supabaseService.findOrCreateUser(telegramId, { telegram_id: telegramId });
    } catch (error) {
      return memoryStorage.get(telegramId) || null;
    }
  },

  async checkRequestLimit(telegramId: number) {
    // В текущей версии - безлимит
    return { allowed: true, remaining: -1 };
  },

  async incrementRequests(telegramId: number) {
    // Пока не используется
  },

  async checkSubscription(telegramId: number) {
    return 'free' as const;
  },

  async updateSubscription(telegramId: number, type: any, expiresAt: Date) {
    // Пока не используется
  },
};

export const safeFavoritesDb = {
  async add(userId: number, city: string) {
    try {
      await supabaseService.addFavorite(userId, city);
    } catch (error) {
      console.warn('⚠️ Using in-memory favorites');
      if (!memoryFavorites.has(userId)) {
        memoryFavorites.set(userId, []);
      }
      const favorites = memoryFavorites.get(userId)!;
      if (!favorites.includes(city)) {
        favorites.push(city);
      }
    }
  },

  async remove(userId: number, city: string) {
    try {
      await supabaseService.removeFavorite(userId, city);
    } catch (error) {
      const favorites = memoryFavorites.get(userId);
      if (favorites) {
        const index = favorites.indexOf(city);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      }
    }
  },

  async getAll(userId: number) {
    try {
      return await supabaseService.getFavorites(userId);
    } catch (error) {
      const cities = memoryFavorites.get(userId) || [];
      return cities.map(city => ({ city, user_id: userId, notify_new_events: true }));
    }
  },
};

export const safeEventsDb = {
  async getActiveEvents(city?: string) {
    try {
      return await supabaseService.getActiveEvents(city);
    } catch (error) {
      console.warn('⚠️ Cannot fetch events from Supabase');
      return [];
    }
  },

  async getEventById(eventId: string) {
    try {
      return await supabaseService.getEventById(eventId);
    } catch (error) {
      return null;
    }
  },
};

export const safeSearchHistoryDb = {
  async add(userId: number, city: string, dateFrom: Date, dateTo: Date) {
    // Пока не используется
  },
};
