// Service for saving user search requests to Supabase
import { config } from '../config/config.js';
import axios from 'axios';

const supabase = axios.create({
  baseURL: config.supabase.url + '/rest/v1',
  headers: {
    'apikey': config.supabase.anonKey,
    'Authorization': `Bearer ${config.supabase.anonKey}`,
    'Content-Type': 'application/json',
  },
});

interface UserRequest {
  telegram_id: number;
  username?: string;
  first_name?: string;
  city: string;
  date_from: string;
  date_to: string;
  success: boolean;
  error_message?: string;
}

export const userRequestsService = {
  /**
   * Сохранить запрос пользователя
   */
  async saveRequest(request: UserRequest): Promise<number | null> {
    try {
      // Адаптируем к существующей структуре таблицы:
      // status: 'completed' для success=true, 'failed' для success=false
      // request_type: 'search'
      // response_data: сохраняем дополнительную информацию
      const data = {
        telegram_id: request.telegram_id,
        city: request.city,
        date_from: request.date_from,
        date_to: request.date_to,
        request_type: 'search',
        status: request.success ? 'completed' : 'failed',
        response_data: {
          username: request.username,
          first_name: request.first_name,
          error_message: request.error_message,
        },
        completed_at: request.success ? new Date().toISOString() : null,
      };

      const response = await supabase.post('/user_requests', data, {
        headers: { 'Prefer': 'return=representation' }
      });

      if (response.data && response.data.length > 0 && response.data[0].id) {
        console.log(`💾 Запрос сохранен в Supabase (ID: ${response.data[0].id})`);
        return response.data[0].id;
      }

      return null;
    } catch (error: any) {
      console.error('❌ Ошибка при сохранении запроса:', error.message);
      return null;
    }
  },

  /**
   * Получить последние запросы пользователя
   */
  async getUserRequests(telegramId: number, limit: number = 10): Promise<any[]> {
    try {
      const response = await supabase.get(
        `/user_requests?telegram_id=eq.${telegramId}&order=created_at.desc&limit=${limit}`
      );

      return response.data || [];
    } catch (error: any) {
      console.error('❌ Ошибка при получении запросов:', error.message);
      return [];
    }
  },

  /**
   * Получить статистику по городам
   */
  async getCityStats(limit: number = 10): Promise<any[]> {
    try {
      // Получаем последние успешные запросы (status='completed')
      const response = await supabase.get(
        `/user_requests?status=eq.completed&order=created_at.desc&limit=1000`
      );

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Подсчитываем количество запросов по городам
      const cityCounts = response.data.reduce((acc: any, req: any) => {
        const city = req.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

      // Сортируем по количеству и берем топ
      const sorted = Object.entries(cityCounts)
        .map(([city, count]) => ({ city, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit);

      return sorted;
    } catch (error: any) {
      console.error('❌ Ошибка при получении статистики:', error.message);
      return [];
    }
  },

  /**
   * Получить общую статистику
   */
  async getOverallStats(): Promise<any> {
    try {
      const response = await supabase.get(
        `/user_requests?order=created_at.desc&limit=10000`
      );

      if (!response.data || response.data.length === 0) {
        return {
          total: 0,
          successful: 0,
          failed: 0,
          success_rate: 0,
        };
      }

      const total = response.data.length;
      const successful = response.data.filter((r: any) => r.status === 'completed').length;
      const failed = total - successful;
      const success_rate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0.0';

      return {
        total,
        successful,
        failed,
        success_rate: parseFloat(success_rate),
      };
    } catch (error: any) {
      console.error('❌ Ошибка при получении общей статистики:', error.message);
      return {
        total: 0,
        successful: 0,
        failed: 0,
        success_rate: 0,
      };
    }
  },
};
