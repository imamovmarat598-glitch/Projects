#!/bin/bash

# Скрипт автоматической настройки Supabase для Travel Bot V3.0
# Выполняет SQL команды для создания необходимых таблиц

SUPABASE_URL="https://ivrcaknzkasscojdjozz.supabase.co"
SUPABASE_SERVICE_KEY="ваш_service_role_key_здесь"  # Нужно заменить на реальный

echo "🚀 Настройка Supabase для Travel Bot V3.0"
echo ""

# Проверка наличия curl
if ! command -v curl &> /dev/null; then
    echo "❌ curl не установлен. Установите curl и повторите попытку."
    exit 1
fi

echo "📊 Supabase URL: $SUPABASE_URL"
echo ""

# SQL запрос для создания таблиц
SQL_QUERY=$(cat <<'EOF'
-- Таблица запросов пользователей с датами поездки
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

-- Таблица подписок на события (для уведомлений)
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

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_requests_telegram_id ON user_requests(telegram_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON user_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created ON user_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_telegram_id ON event_subscriptions(telegram_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_event_date ON event_subscriptions(event_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_notified ON event_subscriptions(notified_24h, notified_30min);

-- Row Level Security
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_subscriptions ENABLE ROW LEVEL SECURITY;

-- Политики доступа (все могут читать и писать с anon ключом)
CREATE POLICY "Enable all access for anon" ON user_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for anon" ON event_subscriptions FOR ALL USING (true);
EOF
)

echo "📝 Выполнение SQL запросов..."
echo ""

# Выполнение SQL через REST API Supabase
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL_QUERY\"}"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SQL запросы выполнены успешно!"
    echo ""
    echo "Созданные таблицы:"
    echo "  ✅ user_requests"
    echo "  ✅ event_subscriptions"
    echo ""
    echo "Созданные индексы:"
    echo "  ✅ idx_requests_telegram_id"
    echo "  ✅ idx_requests_status"
    echo "  ✅ idx_requests_created"
    echo "  ✅ idx_subscriptions_telegram_id"
    echo "  ✅ idx_subscriptions_event_date"
    echo "  ✅ idx_subscriptions_notified"
    echo ""
    echo "🎉 Supabase настроен и готов к работе!"
else
    echo ""
    echo "❌ Ошибка при выполнении SQL запросов"
    echo "Пожалуйста, выполните SQL вручную через Supabase Dashboard"
    exit 1
fi
