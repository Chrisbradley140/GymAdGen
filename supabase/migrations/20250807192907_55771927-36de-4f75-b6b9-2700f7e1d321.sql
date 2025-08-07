-- Add coaching_style column to user_onboarding table
ALTER TABLE public.user_onboarding 
ADD COLUMN coaching_style TEXT;