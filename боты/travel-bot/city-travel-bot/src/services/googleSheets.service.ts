import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Google Sheets Service
 *
 * Заменяет PostgreSQL для хранения данных бота:
 * - Users (пользователи и подписки)
 * - History (история поисков)
 * - Favorites (избранные города)
 * - Preferences (предпочтения пользователей)
 */

interface UserData {
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  subscription_type: 'free' | 'premium' | 'vip';
  subscription_expires?: Date;
  requests_today: number;
  last_request_date: Date;
  created_at: Date;
}

interface SearchHistory {
  user_id: number;
  city: string;
  date_from: Date;
  date_to: Date;
  created_at: Date;
}

interface Favorite {
  user_id: number;
  city: string;
  notify_new_events: boolean;
  created_at: Date;
}

interface UserPreferences {
  user_id: number;
  event_types: string[]; // ['concert', 'exhibition', 'theater', ...]
  budget_level: 'low' | 'medium' | 'high';
  travel_style: string; // 'cultural', 'party', 'family', 'romantic', ...
  preferences_text?: string; // Свободный текст из Google Docs
}

class GoogleSheetsService {
  private auth: JWT | null = null;
  private sheets: any = null;
  private spreadsheetId: string;

  // Названия листов (вкладок) в Google Таблице
  private readonly SHEETS = {
    USERS: 'Users',
    HISTORY: 'History',
    FAVORITES: 'Favorites',
    PREFERENCES: 'Preferences',
  };

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || '';
  }

  /**
   * Инициализация Google Sheets API
   */
  async initialize(): Promise<boolean> {
    try {
      const credentialsPath = path.join(process.cwd(), 'credentials.json');

      if (!fs.existsSync(credentialsPath)) {
        console.log('⚠️  credentials.json не найден. Google Sheets недоступен.');
        return false;
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

      this.auth = new google.auth.JWT(
        credentials.client_email,
        undefined,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      );

      await this.auth.authorize();

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      console.log('✅ Google Sheets подключен');

      // Проверяем/создаем структуру таблиц
      await this.ensureSheetStructure();

      return true;
    } catch (error) {
      console.error('❌ Ошибка подключения Google Sheets:', error);
      return false;
    }
  }

  /**
   * Создает необходимые листы если их нет
   */
  private async ensureSheetStructure(): Promise<void> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = response.data.sheets.map((s: any) => s.properties.title);

      // Создаем отсутствующие листы
      for (const sheetName of Object.values(this.SHEETS)) {
        if (!existingSheets.includes(sheetName)) {
          await this.createSheet(sheetName);
          await this.initializeSheetHeaders(sheetName);
        }
      }
    } catch (error) {
      console.error('Ошибка создания структуры:', error);
    }
  }

  /**
   * Создает новый лист
   */
  private async createSheet(title: string): Promise<void> {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      resource: {
        requests: [{
          addSheet: {
            properties: { title }
          }
        }]
      }
    });
    console.log(`📋 Создан лист: ${title}`);
  }

  /**
   * Инициализирует заголовки для каждого листа
   */
  private async initializeSheetHeaders(sheetName: string): Promise<void> {
    const headers: { [key: string]: string[] } = {
      [this.SHEETS.USERS]: [
        'telegram_id', 'username', 'first_name', 'last_name',
        'subscription_type', 'subscription_expires', 'requests_today',
        'last_request_date', 'created_at'
      ],
      [this.SHEETS.HISTORY]: [
        'user_id', 'city', 'date_from', 'date_to', 'created_at'
      ],
      [this.SHEETS.FAVORITES]: [
        'user_id', 'city', 'notify_new_events', 'created_at'
      ],
      [this.SHEETS.PREFERENCES]: [
        'user_id', 'event_types', 'budget_level', 'travel_style', 'preferences_text'
      ],
    };

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      resource: {
        values: [headers[sheetName]]
      }
    });
  }

  // ============================================
  // USERS - Операции с пользователями
  // ============================================

  /**
   * Найти или создать пользователя
   */
  async findOrCreateUser(telegramId: number, userData: Partial<UserData>): Promise<UserData> {
    const existing = await this.getUserByTelegramId(telegramId);

    if (existing) {
      return existing;
    }

    // Создаем нового пользователя
    const newUser: UserData = {
      telegram_id: telegramId,
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      subscription_type: 'free',
      requests_today: 0,
      last_request_date: new Date(),
      created_at: new Date(),
    };

    await this.appendRow(this.SHEETS.USERS, [
      newUser.telegram_id,
      newUser.username || '',
      newUser.first_name || '',
      newUser.last_name || '',
      newUser.subscription_type,
      newUser.subscription_expires?.toISOString() || '',
      newUser.requests_today,
      newUser.last_request_date.toISOString(),
      newUser.created_at.toISOString(),
    ]);

    return newUser;
  }

  /**
   * Получить пользователя по Telegram ID
   */
  async getUserByTelegramId(telegramId: number): Promise<UserData | null> {
    const rows = await this.getAllRows(this.SHEETS.USERS);

    const userRow = rows.find(row => Number(row[0]) === telegramId);

    if (!userRow) return null;

    return {
      telegram_id: Number(userRow[0]),
      username: userRow[1],
      first_name: userRow[2],
      last_name: userRow[3],
      subscription_type: userRow[4] as any,
      subscription_expires: userRow[5] ? new Date(userRow[5]) : undefined,
      requests_today: Number(userRow[6]) || 0,
      last_request_date: new Date(userRow[7]),
      created_at: new Date(userRow[8]),
    };
  }

  /**
   * Проверить лимит запросов для пользователя
   */
  async checkRequestLimit(telegramId: number): Promise<{ allowed: boolean; remaining: number }> {
    const user = await this.getUserByTelegramId(telegramId);

    if (!user) {
      return { allowed: false, remaining: 0 };
    }

    // Premium/VIP - безлимит
    if (user.subscription_type === 'premium' || user.subscription_type === 'vip') {
      return { allowed: true, remaining: -1 };
    }

    // Проверяем дату последнего запроса
    const today = new Date().toDateString();
    const lastRequest = new Date(user.last_request_date).toDateString();

    let requestsToday = user.requests_today;

    // Сброс счетчика если новый день
    if (today !== lastRequest) {
      requestsToday = 0;
    }

    const FREE_LIMIT = Number(process.env.FREE_REQUESTS_PER_DAY) || 3;
    const remaining = FREE_LIMIT - requestsToday;

    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
    };
  }

  /**
   * Увеличить счетчик запросов пользователя
   */
  async incrementRequests(telegramId: number): Promise<void> {
    const rows = await this.getAllRows(this.SHEETS.USERS);
    const rowIndex = rows.findIndex(row => Number(row[0]) === telegramId);

    if (rowIndex === -1) return;

    const user = rows[rowIndex];
    const today = new Date().toDateString();
    const lastRequest = new Date(user[7]).toDateString();

    let requestsToday = Number(user[6]) || 0;

    if (today !== lastRequest) {
      requestsToday = 0;
    }

    requestsToday += 1;

    await this.updateCell(
      this.SHEETS.USERS,
      rowIndex + 2, // +2 потому что строка 1 - заголовки, индексация с 1
      7, // колонка G (requests_today)
      requestsToday
    );

    await this.updateCell(
      this.SHEETS.USERS,
      rowIndex + 2,
      8, // колонка H (last_request_date)
      new Date().toISOString()
    );
  }

  /**
   * Обновить подписку пользователя
   */
  async updateSubscription(
    telegramId: number,
    type: 'free' | 'premium' | 'vip',
    expiresAt?: Date
  ): Promise<void> {
    const rows = await this.getAllRows(this.SHEETS.USERS);
    const rowIndex = rows.findIndex(row => Number(row[0]) === telegramId);

    if (rowIndex === -1) return;

    await this.updateCell(this.SHEETS.USERS, rowIndex + 2, 5, type);
    await this.updateCell(
      this.SHEETS.USERS,
      rowIndex + 2,
      6,
      expiresAt?.toISOString() || ''
    );
  }

  // ============================================
  // HISTORY - История поисков
  // ============================================

  /**
   * Добавить запись в историю поисков
   */
  async addSearchHistory(
    telegramId: number,
    city: string,
    dateFrom: Date,
    dateTo: Date
  ): Promise<void> {
    await this.appendRow(this.SHEETS.HISTORY, [
      telegramId,
      city,
      dateFrom.toISOString(),
      dateTo.toISOString(),
      new Date().toISOString(),
    ]);
  }

  /**
   * Получить историю поисков пользователя
   */
  async getUserSearchHistory(telegramId: number, limit: number = 10): Promise<SearchHistory[]> {
    const rows = await this.getAllRows(this.SHEETS.HISTORY);

    const userHistory = rows
      .filter(row => Number(row[0]) === telegramId)
      .map(row => ({
        user_id: Number(row[0]),
        city: row[1],
        date_from: new Date(row[2]),
        date_to: new Date(row[3]),
        created_at: new Date(row[4]),
      }))
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit);

    return userHistory;
  }

  // ============================================
  // FAVORITES - Избранные города
  // ============================================

  /**
   * Добавить город в избранное
   */
  async addFavorite(telegramId: number, city: string, notifyNewEvents: boolean = true): Promise<void> {
    // Проверяем что город еще не в избранном
    const existing = await this.getFavorites(telegramId);
    if (existing.some(f => f.city === city)) {
      return;
    }

    await this.appendRow(this.SHEETS.FAVORITES, [
      telegramId,
      city,
      notifyNewEvents,
      new Date().toISOString(),
    ]);
  }

  /**
   * Получить избранные города пользователя
   */
  async getFavorites(telegramId: number): Promise<Favorite[]> {
    const rows = await this.getAllRows(this.SHEETS.FAVORITES);

    return rows
      .filter(row => Number(row[0]) === telegramId)
      .map(row => ({
        user_id: Number(row[0]),
        city: row[1],
        notify_new_events: row[2] === 'true' || row[2] === true,
        created_at: new Date(row[3]),
      }));
  }

  /**
   * Удалить город из избранного
   */
  async removeFavorite(telegramId: number, city: string): Promise<void> {
    const rows = await this.getAllRows(this.SHEETS.FAVORITES);
    const rowIndex = rows.findIndex(
      row => Number(row[0]) === telegramId && row[1] === city
    );

    if (rowIndex === -1) return;

    await this.deleteRow(this.SHEETS.FAVORITES, rowIndex + 2);
  }

  // ============================================
  // PREFERENCES - Предпочтения пользователей
  // ============================================

  /**
   * Сохранить предпочтения пользователя
   */
  async savePreferences(telegramId: number, prefs: Partial<UserPreferences>): Promise<void> {
    const rows = await this.getAllRows(this.SHEETS.PREFERENCES);
    const rowIndex = rows.findIndex(row => Number(row[0]) === telegramId);

    const prefsData = [
      telegramId,
      (prefs.event_types || []).join(','),
      prefs.budget_level || 'medium',
      prefs.travel_style || '',
      prefs.preferences_text || '',
    ];

    if (rowIndex === -1) {
      // Создаем новую запись
      await this.appendRow(this.SHEETS.PREFERENCES, prefsData);
    } else {
      // Обновляем существующую
      await this.updateRow(this.SHEETS.PREFERENCES, rowIndex + 2, prefsData);
    }
  }

  /**
   * Получить предпочтения пользователя
   */
  async getPreferences(telegramId: number): Promise<UserPreferences | null> {
    const rows = await this.getAllRows(this.SHEETS.PREFERENCES);
    const row = rows.find(r => Number(r[0]) === telegramId);

    if (!row) return null;

    return {
      user_id: Number(row[0]),
      event_types: row[1] ? row[1].split(',') : [],
      budget_level: (row[2] || 'medium') as any,
      travel_style: row[3] || '',
      preferences_text: row[4] || '',
    };
  }

  // ============================================
  // Вспомогательные методы для работы с Google Sheets
  // ============================================

  /**
   * Получить все строки из листа (без заголовков)
   */
  private async getAllRows(sheetName: string): Promise<any[][]> {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`, // Со 2-й строки (1-я - заголовки)
      });

      return response.data.values || [];
    } catch (error) {
      console.error(`Ошибка чтения листа ${sheetName}:`, error);
      return [];
    }
  }

  /**
   * Добавить строку в конец листа
   */
  private async appendRow(sheetName: string, values: any[]): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'RAW',
      resource: {
        values: [values]
      }
    });
  }

  /**
   * Обновить конкретную ячейку
   */
  private async updateCell(
    sheetName: string,
    row: number,
    col: number,
    value: any
  ): Promise<void> {
    const columnLetter = String.fromCharCode(65 + col - 1); // A=65
    const range = `${sheetName}!${columnLetter}${row}`;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [[value]]
      }
    });
  }

  /**
   * Обновить всю строку
   */
  private async updateRow(sheetName: string, row: number, values: any[]): Promise<void> {
    const range = `${sheetName}!A${row}`;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [values]
      }
    });
  }

  /**
   * Удалить строку
   */
  private async deleteRow(sheetName: string, row: number): Promise<void> {
    // Получаем ID листа
    const response = await this.sheets.spreadsheets.get({
      spreadsheetId: this.spreadsheetId,
    });

    const sheet = response.data.sheets.find(
      (s: any) => s.properties.title === sheetName
    );

    if (!sheet) return;

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheet.properties.sheetId,
              dimension: 'ROWS',
              startIndex: row - 1,
              endIndex: row,
            }
          }
        }]
      }
    });
  }
}

// Экспортируем singleton
export const googleSheetsService = new GoogleSheetsService();
