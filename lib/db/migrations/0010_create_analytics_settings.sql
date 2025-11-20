-- Create analytics_settings table
CREATE TABLE IF NOT EXISTS analytics_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE,
  google_analytics_id VARCHAR(255),
  google_tag_manager_id VARCHAR(255),
  plausible_domain VARCHAR(255),
  plausible_api_key TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_analytics_settings_user_id ON analytics_settings(user_id);
