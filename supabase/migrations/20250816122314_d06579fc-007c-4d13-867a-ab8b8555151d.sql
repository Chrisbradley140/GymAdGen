-- Fix canonical name mismatch in top_performing_ads table
UPDATE top_performing_ads 
SET campaign_canonical_name = '10-people-ladies-wanted' 
WHERE campaign_canonical_name = '10-people/ladies-wanted';