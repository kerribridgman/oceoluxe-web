-- Add unique constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'mmfc_scheduling_links_api_key_id_external_id_unique'
    ) THEN
        ALTER TABLE mmfc_scheduling_links
        ADD CONSTRAINT mmfc_scheduling_links_api_key_id_external_id_unique
        UNIQUE (api_key_id, external_id);
    END IF;
END $$;
