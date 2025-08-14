-- Phase 1: Data Cleanup & Standardization

-- Update campaign_canonical_name to slugified format
UPDATE top_performing_ads 
SET campaign_canonical_name = 
  CASE 
    WHEN campaign_canonical_name = '30 Day Love It Or Leave It' THEN '30-day-love-it-or-leave-it'
    WHEN campaign_canonical_name = 'Black Friday BOGO' THEN 'black-friday-bogo'
    WHEN campaign_canonical_name = 'Flash Sale' THEN 'flash-sale'
    WHEN campaign_canonical_name = 'Seasonal Fitness Class' THEN 'seasonal-fitness-class'
    WHEN campaign_canonical_name = 'Spring Challenge' THEN 'spring-challenge'
    WHEN campaign_canonical_name = 'Summer Bootcamp' THEN 'summer-bootcamp'
    WHEN campaign_canonical_name = 'Winter Prep' THEN 'winter-prep'
    ELSE campaign_canonical_name
  END;

-- Generate content_hash for all rows using MD5 of primary_text + headline
UPDATE top_performing_ads 
SET content_hash = md5(primary_text || COALESCE(headline, ''))
WHERE content_hash IS NULL;

-- Re-add the foreign key constraint
ALTER TABLE top_performing_ads 
ADD CONSTRAINT fk_campaign_canonical_name 
FOREIGN KEY (campaign_canonical_name) 
REFERENCES campaign_templates(canonical_name);