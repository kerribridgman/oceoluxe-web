-- Create mmfc_scheduling_links table
CREATE TABLE IF NOT EXISTS mmfc_scheduling_links (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER NOT NULL REFERENCES mmfc_api_keys(id) ON DELETE CASCADE,
  external_id INTEGER NOT NULL,
  slug VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  booking_url TEXT NOT NULL,
  max_advance_booking_days INTEGER,
  min_notice_minutes INTEGER,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint on api_key_id and external_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mmfc_scheduling_links_api_key_id_external_id_key'
  ) THEN
    ALTER TABLE mmfc_scheduling_links
    ADD CONSTRAINT mmfc_scheduling_links_api_key_id_external_id_key
    UNIQUE (api_key_id, external_id);
  END IF;
END $$;

-- Create index on api_key_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_mmfc_scheduling_links_api_key_id ON mmfc_scheduling_links(api_key_id);

-- Create index on is_enabled for faster queries
CREATE INDEX IF NOT EXISTS idx_mmfc_scheduling_links_enabled ON mmfc_scheduling_links(is_enabled);
