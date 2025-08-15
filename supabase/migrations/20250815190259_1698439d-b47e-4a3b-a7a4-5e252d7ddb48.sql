-- Fix canonical name mismatch between campaign_templates and top_performing_ads
-- Convert display names to slugified format to match campaign_templates

UPDATE top_performing_ads 
SET campaign_canonical_name = CASE 
  WHEN campaign_canonical_name = '30 Day Love It Or Leave It' THEN '30-day-love-it-or-leave-it'
  WHEN campaign_canonical_name = '6 Week Challenge' THEN '6-week-challenge'
  WHEN campaign_canonical_name = 'New Year' THEN 'new-year'
  WHEN campaign_canonical_name = 'Black Friday' THEN 'black-friday'
  WHEN campaign_canonical_name = 'Summer Shred' THEN 'summer-shred'
  WHEN campaign_canonical_name = 'Transformation Challenge' THEN 'transformation-challenge'
  WHEN campaign_canonical_name = 'Holiday Weight Loss' THEN 'holiday-weight-loss'
  WHEN campaign_canonical_name = 'New Year New You' THEN 'new-year-new-you'
  WHEN campaign_canonical_name = 'Beach Body Ready' THEN 'beach-body-ready'
  WHEN campaign_canonical_name = 'Post Holiday Reset' THEN 'post-holiday-reset'
  WHEN campaign_canonical_name = 'Spring Training' THEN 'spring-training'
  WHEN campaign_canonical_name = 'Wedding Season' THEN 'wedding-season'
  WHEN campaign_canonical_name = 'Back to School' THEN 'back-to-school'
  WHEN campaign_canonical_name = 'Resolution Reset' THEN 'resolution-reset'
  WHEN campaign_canonical_name = 'Fitness Kickstart' THEN 'fitness-kickstart'
  ELSE LOWER(REPLACE(REPLACE(REPLACE(campaign_canonical_name, ' ', '-'), '&', 'and'), '''', ''))
END
WHERE campaign_canonical_name ~ '[A-Z ]';

-- Also remove any "New Year" campaign template if it exists
UPDATE campaign_templates 
SET is_active = false 
WHERE name ILIKE '%new year%';

-- Remove "New Year" top performing ads
DELETE FROM top_performing_ads 
WHERE campaign_canonical_name = 'new-year';