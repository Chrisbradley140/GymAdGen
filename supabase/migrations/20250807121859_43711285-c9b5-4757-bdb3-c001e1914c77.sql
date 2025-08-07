-- Create campaigns for orphaned content
INSERT INTO campaigns (user_id, name, description, created_at, updated_at)
SELECT DISTINCT 
  user_id,
  'Legacy Campaign - ' || TO_CHAR(DATE_TRUNC('day', MIN(created_at)), 'Mon DD, YYYY') as name,
  'Auto-created campaign for existing content from ' || TO_CHAR(MIN(created_at), 'FMMM/DD/YYYY') as description,
  MIN(created_at) as created_at,
  MAX(created_at) as updated_at
FROM saved_ad_content 
WHERE campaign_id IS NULL
GROUP BY user_id, DATE_TRUNC('day', created_at);

-- Update orphaned content to link to the newly created campaigns
UPDATE saved_ad_content 
SET campaign_id = c.id
FROM campaigns c
WHERE saved_ad_content.campaign_id IS NULL 
  AND saved_ad_content.user_id = c.user_id
  AND DATE_TRUNC('day', saved_ad_content.created_at) = DATE_TRUNC('day', c.created_at)
  AND c.name LIKE 'Legacy Campaign%';