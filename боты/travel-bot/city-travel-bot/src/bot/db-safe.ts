// Безопасная обертка для работы с БД без падений
import { userDb, searchHistoryDb } from '../database/db.js';

// In-memory хранилище когда БД недоступна
const memoryStorage = new Map<number, any>();

export const safeUserDb = {
  async findOrCreate(telegramId: number, userData: any) {
    try {
      return await userDb.findOrCreate(telegramId, userData);
    } catch (error) {
      // БД недоступна - используем память
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
      return await userDb.getByTelegramId(telegramId);
    } catch (error) {
      return memoryStorage.get(telegramId) || null;
    }
  },

  async checkRequestLimit(userId: number) {
    try {
      return await userDb.checkRequestLimit(userId);
    } catch (error) {
      // Без БД - безлимит
      return { allowed: true, remaining: -1 };
    }
  },

  async incrementRequests(userId: number) {
    try {
      await userDb.incrementRequests(userId);
    } catch (error) {
      // Игнорируем
    }
  },

  async checkSubscription(userId: number) {
    try {
      return await userDb.checkSubscription(userId);
    } catch (error) {
      return 'free' as const;
    }
  },

  async updateSubscription(userId: number, type: any, expiresAt: Date) {
    try {
      await userDb.updateSubscription(userId, type, expiresAt);
    } catch (error) {
      // Игнорируем
    }
  },
};

export const safeSearchHistoryDb = {
  async add(userId: number, city: string, dateFrom: Date, dateTo: Date) {
    try {
      await searchHistoryDb.add(userId, city, dateFrom, dateTo);
    } catch (error) {
      // Игнорируем
    }
  },
};
