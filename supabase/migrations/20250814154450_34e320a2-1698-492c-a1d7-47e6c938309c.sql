-- Clear existing campaign templates and insert the new "Most Popular" campaigns
DELETE FROM public.ad_templates;
DELETE FROM public.campaign_templates;

-- Insert the specific "Most Popular" campaigns in order
INSERT INTO public.campaign_templates (name, description, category, target_audience, sort_order) VALUES
  ('Seasonal Fitness Class', 'Join our seasonal fitness programs designed to keep you motivated year-round', 'Most Popular', 'Fitness enthusiasts', 1),
  ('New Year', 'Start your year strong with our proven New Year transformation program', 'Most Popular', 'Resolution makers', 2),
  ('6 Week Challenge', 'Transform your life in just 6 weeks with our proven system', 'Most Popular', 'Health & Fitness enthusiasts', 3),
  ('30 Day Love It Or Leave It', 'Try our program for 30 days - love the results or get your money back', 'Most Popular', 'Skeptical prospects', 4),
  ('5 People Personal Training', 'Exclusive small group training limited to just 5 committed individuals', 'Most Popular', 'Quality-focused clients', 5),
  ('10 People/Ladies Wanted', 'Special program seeking 10 dedicated women ready for transformation', 'Most Popular', 'Women fitness enthusiasts', 6),
  ('8-10 Week Body Transformation', 'Complete body transformation program with proven 8-10 week timeline', 'Most Popular', 'Transformation seekers', 7),
  ('21 Day Challenge', 'Quick results in just 21 days with our intensive challenge program', 'Most Popular', 'Fast-result seekers', 8),
  ('Football Camp', 'Athletic training program designed for football players and sports enthusiasts', 'Most Popular', 'Athletes and sports enthusiasts', 9),
  ('Small Group Personal Training', 'Personalized attention in an intimate small group setting', 'Most Popular', 'Personal training clients', 10),
  ('7 Day Free Trial', 'Experience our program completely free for 7 days - no commitment required', 'Most Popular', 'Trial seekers', 11);

-- Insert sample ad template for the 6 Week Challenge
INSERT INTO public.ad_templates (campaign_template_id, primary_text, headline, offer_type, target_market, tone, hook_type, performance_score) 
SELECT 
  ct.id,
  'Are you tired of starting fitness programs that you never finish? 🔥

What if I told you that in just 6 weeks, you could completely transform not just your body, but your entire relationship with fitness?

The 6-Week Total Transformation Challenge is not just another workout program. It is a complete lifestyle reset designed for busy people who want real results.

✨ What makes this different:
• Workouts that fit into YOUR schedule (15-30 mins max)
• Meal plans that actually taste good
• Daily accountability and support
• Proven system used by 1000+ successful clients

Stop making excuses. Start making changes.

Your transformation starts NOW. 💪',
  'Transform Your Body in Just 6 Weeks',
  'Challenge Program',
  'Health & Fitness',
  'Motivational',
  'Problem/Solution',
  95
FROM public.campaign_templates ct WHERE ct.name = '6 Week Challenge';