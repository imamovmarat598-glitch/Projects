import pg from 'pg';
import { config } from '../config/config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.database.url,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Тест подключения
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Типы для пользователей
export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  subscription_type: 'free' | 'premium' | 'vip';
  subscription_expires_at?: Date;
  requests_today: number;
  last_request_date: Date;
  created_at: Date;
  updated_at: Date;
}

// Операции с пользователями
export const userDb = {
  // Найти или создать пользователя
  async findOrCreate(telegramId: number, userData: { username?: string; first_name?: string; last_name?: string }): Promise<User> {
    const query = `
      INSERT INTO users (telegram_id, username, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (telegram_id)
      DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const result = await pool.query(query, [telegramId, userData.username, userData.first_name, userData.last_name]);
    return result.rows[0];
  },

  // Получить пользователя
  async getByTelegramId(telegramId: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE telegram_id = $1';
    const result = await pool.query(query, [telegramId]);
    return result.rows[0] || null;
  },

  // Проверить лимиты запросов
  async checkRequestLimit(userId: number): Promise<{ allowed: boolean; remaining: number }> {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!user.rows[0]) return { allowed: false, remaining: 0 };

    const userData = user.rows[0];
    const today = new Date().toISOString().split('T')[0];
    const lastRequestDate = userData.last_request_date?.toISOString().split('T')[0];

    // Сброс счетчика если новый день
    if (lastRequestDate !== today) {
      await pool.query(
        'UPDATE users SET requests_today = 0, last_request_date = CURRENT_DATE WHERE id = $1',
        [userId]
      );
      userData.requests_today = 0;
    }

    // Premium и VIP без лимитов
    if (userData.subscription_type !== 'free') {
      return { allowed: true, remaining: -1 };
    }

    const limit = config.limits.freeRequestsPerDay;
    const allowed = userData.requests_today < limit;
    const remaining = Math.max(0, limit - userData.requests_today);

    return { allowed, remaining };
  },

  // Увеличить счетчик запросов
  async incrementRequests(userId: number): Promise<void> {
    await pool.query(
      'UPDATE users SET requests_today = requests_today + 1, last_request_date = CURRENT_DATE WHERE id = $1',
      [userId]
    );
  },

  // Обновить подписку
  async updateSubscription(userId: number, type: 'premium' | 'vip', expiresAt: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET subscription_type = $1, subscription_expires_at = $2 WHERE id = $3',
      [type, expiresAt, userId]
    );
  },

  // Проверить статус подписки
  async checkSubscription(userId: number): Promise<'free' | 'premium' | 'vip'> {
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (!user.rows[0]) return 'free';

    const userData = user.rows[0];

    // Проверка истечения подписки
    if (userData.subscription_expires_at && new Date(userData.subscription_expires_at) < new Date()) {
      await pool.query('UPDATE users SET subscription_type = $1 WHERE id = $2', ['free', userId]);
      return 'free';
    }

    return userData.subscription_type;
  },
};

// Операции с историей поисков
export const searchHistoryDb = {
  async add(userId: number, city: string, dateFrom: Date, dateTo: Date): Promise<void> {
    await pool.query(
      'INSERT INTO search_history (user_id, city, date_from, date_to) VALUES ($1, $2, $3, $4)',
      [userId, city, dateFrom, dateTo]
    );
  },

  async getRecent(userId: number, limit: number = 5): Promise<any[]> {
    const result = await pool.query(
      'SELECT * FROM search_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    return result.rows;
  },
};

// Операции с платежами
export const paymentsDb = {
  async create(userId: number, amount: number, subscriptionType: string, provider: string): Promise<number> {
    const result = await pool.query(
      'INSERT INTO payments (user_id, amount, subscription_type, provider) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, amount, subscriptionType, provider]
    );
    return result.rows[0].id;
  },

  async updateStatus(paymentId: number, status: string, providerPaymentId?: string): Promise<void> {
    await pool.query(
      'UPDATE payments SET status = $1, provider_payment_id = $2, completed_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, providerPaymentId, paymentId]
    );
  },
};

// Операции с избранным
export const favoritesDb = {
  async add(userId: number, city: string, notifyOnNewEvents: boolean = false): Promise<void> {
    await pool.query(
      'INSERT INTO favorites (user_id, city, notify_on_new_events) VALUES ($1, $2, $3) ON CONFLICT (user_id, city) DO NOTHING',
      [userId, city, notifyOnNewEvents]
    );
  },

  async remove(userId: number, city: string): Promise<void> {
    await pool.query('DELETE FROM favorites WHERE user_id = $1 AND city = $2', [userId, city]);
  },

  async getAll(userId: number): Promise<any[]> {
    const result = await pool.query('SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  },
};
