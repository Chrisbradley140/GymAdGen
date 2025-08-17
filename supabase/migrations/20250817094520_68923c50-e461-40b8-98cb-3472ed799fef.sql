-- Add business type and city fields to user_onboarding table
ALTER TABLE public.user_onboarding 
ADD COLUMN business_type text,
ADD COLUMN business_city text;