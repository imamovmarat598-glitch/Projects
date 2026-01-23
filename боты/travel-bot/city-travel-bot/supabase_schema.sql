-- Travel Bot Tables for Supabase
-- Выполните этот SQL в Supabase Dashboard: Table Editor -> SQL Editor

-- 1. Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Таблица избранных городов пользователей
CREATE TABLE IF NOT EXISTS favorites (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  city TEXT NOT NULL,
  notify_new_events BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, city)
);

-- 3. Таблица кэша событий
CREATE TABLE IF NOT EXISTS events_cache (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  price TEXT DEFAULT 'Бесплатно',
  image_url TEXT,
  category TEXT,
  venue_name TEXT,
  venue_address TEXT,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  kudago_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Таблица запросов пользователей (для n8n workflow)
CREATE TABLE IF NOT EXISTS user_requests (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  city TEXT NOT NULL,
  date_from TIMESTAMP WITH TIME ZONE,
  date_to TIMESTAMP WITH TIME ZONE,
  request_type TEXT DEFAULT 'search',
  status TEXT DEFAULT 'pending',
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. Таблица подписок пользователей на события
CREATE TABLE IF NOT EXISTS event_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  event_id TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notified_24h BOOLEAN DEFAULT false,
  notified_30min BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(telegram_id, event_id)
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_city ON favorites(city);
CREATE INDEX IF NOT EXISTS idx_events_city ON events_cache(city);
CREATE INDEX IF NOT EXISTS idx_events_date ON events_cache(event_date);
CREATE INDEX IF NOT EXISTS idx_events_active ON events_cache(is_active);
CREATE INDEX IF NOT EXISTS idx_requests_telegram_id ON user_requests(telegram_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON user_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON user_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_telegram_id ON event_subscriptions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_event_date ON event_subscriptions(event_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_notified ON event_subscriptions(notified_24h, notified_30min);

-- Row Level Security (опционально - для безопасности)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE events_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_subscriptions ENABLE ROW LEVEL SECURITY;

-- Политики доступа (все могут читать и писать с anon ключом)
CREATE POLICY "Enable all access for anon" ON users FOR ALL USING (true);
CREATE POLICY "Enable all access for anon" ON favorites FOR ALL USING (true);
CREATE POLICY "Enable all access for anon" ON events_cache FOR ALL USING (true);
CREATE POLICY "Enable all access for anon" ON user_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for anon" ON event_subscriptions FOR ALL USING (true);
