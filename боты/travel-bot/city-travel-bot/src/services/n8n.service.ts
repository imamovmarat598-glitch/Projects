// n8n Webhook Service - отправка запросов в n8n workflows
import axios from 'axios';
import { userRequestsService } from './userRequests.service.js';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://cuhelibbeerank.beget.app/webhook';

interface CitySearchRequest {
  telegram_id: number;
  username?: string;
  first_name?: string;
  city: string;
  date_from: string; // ISO date
  date_to: string; // ISO date
}

interface CitySearchResponse {
  success: boolean;
  request_id?: number;
  city?: string;
  summary?: string;
  events?: any[];
  attractions?: any[];
  hotels?: any[];
  cinema?: any[];
  error?: string;
}

export const n8nService = {
  /**
   * Отправить запрос на поиск информации о городе
   */
  async sendCitySearchRequest(request: CitySearchRequest): Promise<CitySearchResponse> {
    let responseData: CitySearchResponse = {
      success: false,
      error: 'Unknown error',
    };

    try {
      console.log(`📤 Отправка запроса в n8n для города: ${request.city}`);

      const response = await axios.post(
        `${N8N_WEBHOOK_URL}/city-search`,
        {
          telegram_id: request.telegram_id,
          username: request.username,
          first_name: request.first_name,
          city: request.city,
          date_from: request.date_from,
          date_to: request.date_to,
          request_type: 'search',
        },
        {
          timeout: 30000, // 30 секунд
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Ответ от n8n получен для города: ${request.city}`);

      responseData = {
        success: true,
        ...response.data,
      };

      // Сохраняем успешный запрос в Supabase
      await userRequestsService.saveRequest({
        telegram_id: request.telegram_id,
        username: request.username,
        first_name: request.first_name,
        city: request.city,
        date_from: request.date_from,
        date_to: request.date_to,
        success: true,
      });

      return responseData;
    } catch (error: any) {
      console.error('❌ Ошибка при отправке запроса в n8n:', error.message);

      responseData = {
        success: false,
        error: error.message || 'Ошибка при обработке запроса',
      };

      // Сохраняем неуспешный запрос в Supabase
      await userRequestsService.saveRequest({
        telegram_id: request.telegram_id,
        username: request.username,
        first_name: request.first_name,
        city: request.city,
        date_from: request.date_from,
        date_to: request.date_to,
        success: false,
        error_message: error.message,
      });

      return responseData;
    }
  },

  /**
   * Проверить статус запроса (если нужно асинхронное получение)
   */
  async getRequestStatus(requestId: number): Promise<any> {
    try {
      const response = await axios.get(
        `${N8N_WEBHOOK_URL}/request-status/${requestId}`,
        {
          timeout: 5000,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Ошибка при получении статуса запроса:', error.message);
      return null;
    }
  },

  /**
   * Подписать пользователя на событие (для уведомлений)
   */
  async subscribeToEvent(telegramId: number, eventId: string, eventDate: string): Promise<boolean> {
    try {
      console.log(`📤 Подписка пользователя ${telegramId} на событие ${eventId}`);

      await axios.post(
        `${N8N_WEBHOOK_URL}/subscribe-event`,
        {
          telegram_id: telegramId,
          event_id: eventId,
          event_date: eventDate,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Подписка на событие ${eventId} создана`);
      return true;
    } catch (error: any) {
      console.error('❌ Ошибка при подписке на событие:', error.message);
      return false;
    }
  },

  /**
   * Отписать пользователя от события
   */
  async unsubscribeFromEvent(telegramId: number, eventId: string): Promise<boolean> {
    try {
      console.log(`📤 Отписка пользователя ${telegramId} от события ${eventId}`);

      await axios.post(
        `${N8N_WEBHOOK_URL}/unsubscribe-event`,
        {
          telegram_id: telegramId,
          event_id: eventId,
        },
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Отписка от события ${eventId} выполнена`);
      return true;
    } catch (error: any) {
      console.error('❌ Ошибка при отписке от события:', error.message);
      return false;
    }
  },

  /**
   * Тестовое подключение к n8n
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${N8N_WEBHOOK_URL}/health`, {
        timeout: 5000,
      });

      console.log('✅ n8n connection OK');
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ n8n connection failed (will work in limited mode)');
      return false;
    }
  },
};
