-- Update campaign template descriptions with new copy

UPDATE campaign_templates 
SET description = 'Generate ads that promote a limited-time seasonal fitness program, keeping messaging fresh and aligned with the time of year.'
WHERE canonical_name = 'seasonal_fitness_class';

UPDATE campaign_templates 
SET description = 'Create high-energy ads designed to capture the New Year motivation spike and drive early-year sign-ups.'
WHERE canonical_name = 'new_year';

UPDATE campaign_templates 
SET description = 'Build compelling ads that position your offer as a 6-week transformation, perfect for driving quick-start commitments.'
WHERE canonical_name = '6_week_challenge';

UPDATE campaign_templates 
SET description = 'Generate persuasive ads for a risk-free 30-day trial offer, highlighting confidence in your program''s results.'
WHERE canonical_name = '30_day_love_it_or_leave_it';

UPDATE campaign_templates 
SET description = 'Craft scarcity-driven ads promoting an exclusive personal training spot for only 5 participants.'
WHERE canonical_name = '5_people_personal_training';

UPDATE campaign_templates 
SET description = 'Create targeted ads inviting 10 women to join a dedicated transformation program.'
WHERE canonical_name = '10_people_ladies_wanted';

UPDATE campaign_templates 
SET description = 'Develop ads emphasizing a full transformation within an 8–10 week window, focused on results and commitment.'
WHERE canonical_name = '8_10_week_body_transformation';

UPDATE campaign_templates 
SET description = 'Write high-intensity challenge ads that promise quick results and keep participants engaged for 3 weeks.'
WHERE canonical_name = '21_day_challenge';

UPDATE campaign_templates 
SET description = 'Generate sports-focused ads for football conditioning or athletic performance programs.'
WHERE canonical_name = 'football_camp';

UPDATE campaign_templates 
SET description = 'Build ads that highlight the benefits of small group training — personalized coaching plus community.'
WHERE canonical_name = 'small_group_personal_training';

UPDATE campaign_templates 
SET description = 'Create low-barrier ads offering a free week of training to quickly get leads in the door.'
WHERE canonical_name = '7_day_free_trial';