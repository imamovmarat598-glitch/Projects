-- Migration: Create user_requests table for tracking user searches
-- Purpose: Store all user search requests for analytics and history

CREATE TABLE IF NOT EXISTS user_requests (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT NOT NULL,
  username TEXT,
  first_name TEXT,
  city TEXT NOT NULL,
  date_from TIMESTAMPTZ NOT NULL,
  date_to TIMESTAMPTZ NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_requests_telegram_id ON user_requests(telegram_id);
CREATE INDEX IF NOT EXISTS idx_user_requests_city ON user_requests(city);
CREATE INDEX IF NOT EXISTS idx_user_requests_created_at ON user_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_requests_success ON user_requests(success);

-- Enable Row Level Security (RLS)
ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on user_requests" ON user_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create function for city statistics
CREATE OR REPLACE FUNCTION get_city_stats(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  city TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ur.city,
    COUNT(*) as count
  FROM user_requests ur
  GROUP BY ur.city
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function for overall statistics
CREATE OR REPLACE FUNCTION get_overall_stats()
RETURNS TABLE (
  total BIGINT,
  successful BIGINT,
  failed BIGINT,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE success = true) as successful,
    COUNT(*) FILTER (WHERE success = false) as failed,
    ROUND(
      (COUNT(*) FILTER (WHERE success = true)::NUMERIC / NULLIF(COUNT(*), 0)::NUMERIC * 100),
      1
    ) as success_rate
  FROM user_requests;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_city_stats(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_overall_stats() TO anon, authenticated;

COMMENT ON TABLE user_requests IS 'Stores all user search requests for analytics and history tracking';
COMMENT ON COLUMN user_requests.telegram_id IS 'Telegram user ID';
COMMENT ON COLUMN user_requests.username IS 'Telegram username (optional)';
COMMENT ON COLUMN user_requests.first_name IS 'User first name from Telegram';
COMMENT ON COLUMN user_requests.city IS 'City name that was searched';
COMMENT ON COLUMN user_requests.date_from IS 'Start date of the trip';
COMMENT ON COLUMN user_requests.date_to IS 'End date of the trip';
COMMENT ON COLUMN user_requests.success IS 'Whether the request was successful';
COMMENT ON COLUMN user_requests.error_message IS 'Error message if request failed';
COMMENT ON COLUMN user_requests.created_at IS 'Timestamp when request was made';
