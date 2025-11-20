-- Create mmfc_services table
CREATE TABLE IF NOT EXISTS mmfc_services (
  id SERIAL PRIMARY KEY,
  api_key_id INTEGER NOT NULL REFERENCES mmfc_api_keys(id) ON DELETE CASCADE,
  external_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  sale_price DECIMAL(10, 2),
  featured_image_url TEXT,
  cover_image TEXT,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  synced_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique constraint on api_key_id and external_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'mmfc_services_api_key_id_external_id_key'
  ) THEN
    ALTER TABLE mmfc_services
    ADD CONSTRAINT mmfc_services_api_key_id_external_id_key
    UNIQUE (api_key_id, external_id);
  END IF;
END $$;

-- Create index on api_key_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_mmfc_services_api_key_id ON mmfc_services(api_key_id);

-- Create index on is_visible for faster queries
CREATE INDEX IF NOT EXISTS idx_mmfc_services_visible ON mmfc_services(is_visible);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_mmfc_services_slug ON mmfc_services(slug);
