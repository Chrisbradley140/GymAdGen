-- Add website_tone_scan column to user_onboarding table
ALTER TABLE public.user_onboarding 
ADD COLUMN website_tone_scan TEXT;