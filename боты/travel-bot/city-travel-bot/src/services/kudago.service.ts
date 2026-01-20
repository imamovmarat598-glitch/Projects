import axios from 'axios';
import { config } from '../config/config.js';

const BASE_URL = config.api.kudago.baseUrl;

export interface KudaGoEvent {
  id: number;
  title: string;
  description: string;
  dates: Array<{
    start: number;
    end: number;
  }>;
  place?: {
    id: number;
    title: string;
    address: string;
    coords: {
      lat: number;
      lon: number;
    };
  };
  images: Array<{
    image: string;
  }>;
  price: string;
  is_free: boolean;
  site_url: string;
  categories: string[];
}

export interface KudaGoCity {
  slug: string;
  name: string;
  timezone: string;
  coords: {
    lat: number;
    lon: number;
  };
}

class KudaGoService {
  private readonly apiUrl = BASE_URL;

  // Получить список городов
  async getCities(): Promise<KudaGoCity[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/locations/`);
      return response.data;
    } catch (error) {
      console.error('KudaGo API error (cities):', error);
      return [];
    }
  }

  // Получить события для города
  async getEvents(
    citySlug: string,
    dateFrom?: Date,
    dateTo?: Date,
    limit: number = 10
  ): Promise<KudaGoEvent[]> {
    try {
      const params: any = {
        location: citySlug,
        fields: 'id,title,description,dates,place,images,price,is_free,site_url,categories',
        expand: 'place',
        page_size: limit,
        order_by: '-publication_date',
      };

      if (dateFrom) {
        params.actual_since = Math.floor(dateFrom.getTime() / 1000);
      }

      if (dateTo) {
        params.actual_until = Math.floor(dateTo.getTime() / 1000);
      }

      const response = await axios.get(`${this.apiUrl}/events/`, { params });
      return response.data.results || [];
    } catch (error) {
      console.error('KudaGo API error (events):', error);
      return [];
    }
  }

  // Получить категории событий
  async getCategories(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/event-categories/`);
      return response.data;
    } catch (error) {
      console.error('KudaGo API error (categories):', error);
      return [];
    }
  }

  // Поиск событий по ключевому слову
  async searchEvents(query: string, citySlug?: string, limit: number = 10): Promise<KudaGoEvent[]> {
    try {
      const params: any = {
        q: query,
        fields: 'id,title,description,dates,place,images,price,is_free,site_url',
        expand: 'place',
        page_size: limit,
      };

      if (citySlug) {
        params.location = citySlug;
      }

      const response = await axios.get(`${this.apiUrl}/search/`, { params });
      return response.data.results || [];
    } catch (error) {
      console.error('KudaGo API error (search):', error);
      return [];
    }
  }

  // Форматировать событие для отображения
  formatEventMessage(event: KudaGoEvent): string {
    const title = event.title || 'Без названия';
    const description = event.description?.slice(0, 200) || 'Описание недоступно';
    const price = event.is_free ? 'Бесплатно' : (event.price || 'Цена не указана');
    const place = event.place?.title || 'Место не указано';
    const address = event.place?.address || '';

    let dateStr = 'Дата не указана';
    if (event.dates && event.dates.length > 0) {
      const date = new Date(event.dates[0].start * 1000);
      dateStr = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    return `🎭 <b>${title}</b>\n\n${description}...\n\n📅 ${dateStr}\n📍 ${place}\n${address ? `📌 ${address}\n` : ''}💰 ${price}\n\n🔗 ${event.site_url}`;
  }

  // Получить slug города по названию
  async getCitySlug(cityName: string): Promise<string | null> {
    const cities = await this.getCities();
    const normalizedName = cityName.toLowerCase().trim();

    const city = cities.find(c =>
      c.name.toLowerCase() === normalizedName ||
      c.slug.toLowerCase() === normalizedName
    );

    return city?.slug || null;
  }
}

export const kudagoService = new KudaGoService();
