import axios from 'axios';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

const supabase = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  },
});

interface User {
  telegram_id: number;
  username?: string;
  first_name?: string;
}

interface Favorite {
  user_id: number;
  city: string;
  notify_new_events?: boolean;
}

export const supabaseService = {
  // Пользователи
  async findOrCreateUser(telegramId: number, userData: User) {
    try {
      // Попробуем найти пользователя
      const { data: existing } = await supabase.get(`/users?telegram_id=eq.${telegramId}`);

      if (existing && existing.length > 0) {
        return existing[0];
      }

      // Создаем нового
      const { data: newUser } = await supabase.post('/users', {
        telegram_id: telegramId,
        username: userData.username,
        first_name: userData.first_name,
      }, {
        headers: { 'Prefer': 'return=representation' }
      });

      return newUser?.[0] || null;
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw error;
    }
  },

  // Избранные города
  async addFavorite(userId: number, city: string) {
    try {
      const { data } = await supabase.post('/favorites', {
        user_id: userId,
        city: city,
        notify_new_events: true,
      }, {
        headers: { 'Prefer': 'return=representation' }
      });
      return data?.[0] || null;
    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId: number, city: string) {
    try {
      await supabase.delete(`/favorites?user_id=eq.${userId}&city=eq.${city}`);
      return true;
    } catch (error) {
      console.error('Error in removeFavorite:', error);
      return false;
    }
  },

  async getFavorites(userId: number) {
    try {
      const { data } = await supabase.get(`/favorites?user_id=eq.${userId}`);
      return data || [];
    } catch (error) {
      console.error('Error in getFavorites:', error);
      return [];
    }
  },

  // События
  async getActiveEvents(city?: string) {
    try {
      let url = '/events_cache?is_active=eq.true';
      if (city) {
        url += `&city=eq.${city}`;
      }
      url += '&order=event_date.asc&limit=50';

      const { data } = await supabase.get(url);
      return data || [];
    } catch (error) {
      console.error('Error in getActiveEvents:', error);
      return [];
    }
  },

  async getEventById(eventId: string) {
    try {
      const { data } = await supabase.get(`/events_cache?event_id=eq.${eventId}`);
      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getEventById:', error);
      return null;
    }
  },

  // Проверка подключения
  async testConnection() {
    try {
      const { data } = await supabase.get('/users?limit=1');
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }
};
