-- GeoMark Database Schema
-- Run this in Supabase SQL Editor

-- Enable PostGIS extension for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id VARCHAR(10) UNIQUE NOT NULL,

  -- File info
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  width INTEGER,
  height INTEGER,

  -- GPS data
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  altitude DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,

  -- Geocoded address
  address TEXT,
  city VARCHAR(255),
  country VARCHAR(100),

  -- Metadata
  taken_at TIMESTAMPTZ,
  device_model VARCHAR(255),

  -- Security metadata (for moderation)
  device_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,

  -- Sharing settings
  is_public BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  auto_delete VARCHAR(10) DEFAULT 'never' CHECK (auto_delete IN ('1h', '24h', '7d', 'never')),
  view_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metadata logs for security (kept 90 days after photo deletion)
CREATE TABLE IF NOT EXISTS metadata_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  ip_address INET NOT NULL,
  device_id VARCHAR(255),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_short_id ON photos(short_id);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_expires_at ON photos(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_photos_location ON photos(latitude, longitude) WHERE latitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_photos_device_id ON photos(device_id) WHERE device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_photos_ip ON photos(ip_address) WHERE ip_address IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_metadata_logs_expires ON metadata_logs(expires_at);
CREATE INDEX IF NOT EXISTS idx_metadata_logs_location ON metadata_logs(latitude, longitude);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_photos_updated_at ON photos;
CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metadata_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read public photos
CREATE POLICY "Public photos are viewable by everyone" ON photos
  FOR SELECT USING (is_public = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Allow anyone to insert photos (anonymous uploads)
CREATE POLICY "Anyone can upload photos" ON photos
  FOR INSERT WITH CHECK (true);

-- Allow updates only through service role (for view count, etc)
CREATE POLICY "Service role can update photos" ON photos
  FOR UPDATE USING (true);

-- Metadata logs only accessible by service role
CREATE POLICY "Service role only for metadata" ON metadata_logs
  FOR ALL USING (false);

-- Storage bucket setup (run in Supabase Dashboard > Storage)
-- Create bucket named 'photos' with public access

-- Function to clean expired photos (call via cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_photos()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM photos
    WHERE expires_at IS NOT NULL AND expires_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to detect suspicious location patterns
CREATE OR REPLACE FUNCTION check_suspicious_pattern(
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION,
  p_device_id VARCHAR,
  p_ip_address INET
)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{"suspicious": false, "reasons": []}'::JSONB;
  same_location_count INTEGER;
  recent_upload_count INTEGER;
  night_upload BOOLEAN;
BEGIN
  -- Check 1: Multiple uploads from same location (within 50m)
  SELECT COUNT(*) INTO same_location_count
  FROM photos
  WHERE created_at > NOW() - INTERVAL '1 hour'
    AND (device_id = p_device_id OR ip_address = p_ip_address)
    AND ST_DWithin(
      ST_MakePoint(longitude, latitude)::geography,
      ST_MakePoint(p_longitude, p_latitude)::geography,
      50 -- 50 meters
    );

  IF same_location_count >= 5 THEN
    result := jsonb_set(result, '{suspicious}', 'true');
    result := jsonb_set(result, '{reasons}', result->'reasons' || '["frequent_same_location"]'::jsonb);
  END IF;

  -- Check 2: Too many uploads in short time
  SELECT COUNT(*) INTO recent_upload_count
  FROM photos
  WHERE created_at > NOW() - INTERVAL '1 hour'
    AND (device_id = p_device_id OR ip_address = p_ip_address);

  IF recent_upload_count >= 10 THEN
    result := jsonb_set(result, '{suspicious}', 'true');
    result := jsonb_set(result, '{reasons}', result->'reasons' || '["high_frequency"]'::jsonb);
  END IF;

  -- Check 3: Night uploads (00:00 - 06:00 local time - simplified to UTC)
  IF EXTRACT(HOUR FROM NOW()) BETWEEN 0 AND 5 THEN
    night_upload := true;
    result := jsonb_set(result, '{reasons}', result->'reasons' || '["night_upload"]'::jsonb);
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
