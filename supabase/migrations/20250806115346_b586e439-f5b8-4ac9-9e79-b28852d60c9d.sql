-- Clean up duplicate onboarding records, keeping only the latest one for each user
WITH latest_records AS (
  SELECT DISTINCT ON (user_id) id, user_id, updated_at
  FROM user_onboarding
  ORDER BY user_id, updated_at DESC
)
DELETE FROM user_onboarding 
WHERE id NOT IN (SELECT id FROM latest_records);

-- Add unique constraint to prevent future duplicates
ALTER TABLE user_onboarding ADD CONSTRAINT unique_user_onboarding UNIQUE (user_id);