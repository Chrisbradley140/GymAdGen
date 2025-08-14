-- Phase 1: Add canonical_name to campaign_templates
ALTER TABLE campaign_templates ADD COLUMN canonical_name TEXT;

-- Populate with slugs: "6 Week Challenge" → "6-week-challenge"
UPDATE campaign_templates SET canonical_name = lower(replace(replace(replace(name, ' ', '-'), '/', '-'), '--', '-'));

-- Create top_performing_ads table
CREATE TABLE top_performing_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_canonical_name TEXT NOT NULL,
  primary_text TEXT NOT NULL,
  headline TEXT,
  insights TEXT,
  tone TEXT,
  hook_type TEXT,
  platform TEXT[],
  target_market TEXT,
  target_location TEXT,
  result TEXT,
  cost_per_result TEXT,
  media_url TEXT,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add unique constraint
CREATE UNIQUE INDEX idx_top_performing_ads_unique ON top_performing_ads (campaign_canonical_name, content_hash);

-- Add foreign key reference
ALTER TABLE top_performing_ads ADD CONSTRAINT fk_campaign_canonical_name 
  FOREIGN KEY (campaign_canonical_name) REFERENCES campaign_templates(canonical_name);

-- Enable RLS
ALTER TABLE top_performing_ads ENABLE ROW LEVEL SECURITY;

-- Allow SELECT to all authenticated users
CREATE POLICY "Allow SELECT to all" ON top_performing_ads FOR SELECT TO authenticated USING (true);

-- Restrict INSERT/UPDATE to service role only
CREATE POLICY "Service role only INSERT" ON top_performing_ads FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role only UPDATE" ON top_performing_ads FOR UPDATE TO service_role USING (true);