# Top-Performing Ads Integration

This document outlines the implementation of top-performing ads integration for the "Most Popular" campaign generation flow.

## Overview

The system now uses top-performing ad examples from a dedicated database table to inspire AI content generation, while maintaining brand personalization and Meta compliance.

## Database Schema

### Tables

#### `campaign_templates` (Updated)
- Added `canonical_name` column (TEXT, UNIQUE, NOT NULL)
- Populated with slug versions of campaign names (e.g., "6 Week Challenge" → "6-week-challenge")

#### `top_performing_ads` (New)
- `id` (UUID, Primary Key)
- `campaign_canonical_name` (TEXT, Foreign Key to campaign_templates.canonical_name)
- `primary_text` (TEXT, NOT NULL)
- `headline` (TEXT)
- `insights` (TEXT)
- `tone` (TEXT)
- `hook_type` (TEXT)
- `platform` (TEXT[])
- `target_market` (TEXT)
- `target_location` (TEXT)
- `result` (TEXT)
- `cost_per_result` (TEXT)
- `media_url` (TEXT)
- `content_hash` (TEXT, NOT NULL) - MD5 hash of primary_text + headline
- `created_at` (TIMESTAMPTZ)

#### Constraints & Indexes
- Unique constraint on (campaign_canonical_name, content_hash)
- Foreign key: campaign_canonical_name → campaign_templates.canonical_name
- RLS enabled: SELECT allowed for authenticated users, INSERT/UPDATE restricted to service role

## CSV Import Options

### Option A: Manual Import via Supabase Dashboard

1. **Prepare CSV with headers:**
   - campaign_name
   - primary_text
   - headline
   - insights
   - tone
   - hook_type
   - platform (comma-separated)
   - target_market
   - target_location
   - result
   - cost_per_result
   - media_url

2. **Import in Supabase Table Editor:**
   - Go to Dashboard → Table Editor → top_performing_ads
   - Click Insert → Import data from CSV
   - Map columns appropriately

3. **Post-import SQL cleanup:**
   ```sql
   -- Fill canonical names
   UPDATE top_performing_ads 
   SET campaign_canonical_name = lower(replace(replace(replace(campaign_name, ' ', '-'), '/', '-'), '--', '-'))
   WHERE campaign_canonical_name IS NULL;

   -- Generate content hashes
   UPDATE top_performing_ads 
   SET content_hash = md5(primary_text||'|'||COALESCE(headline, ''))
   WHERE content_hash IS NULL;
   ```

### Option B: Automated Script (Future Enhancement)

A TypeScript/Node.js script can be created to:
- Read CSV files
- Transform data (slugify campaign names, parse platforms, generate hashes)
- Perform upserts with conflict resolution

## Content Generation Flow

### 1. Campaign Selection
When a user selects a "Most Popular" campaign:
- Frontend passes the campaign's `canonical_name` to the Edge function
- Edge function queries `top_performing_ads` for that campaign

### 2. Top-Performing Ads Query
```sql
SELECT * FROM top_performing_ads 
WHERE campaign_canonical_name = $1 
ORDER BY result DESC, cost_per_result ASC 
LIMIT 10;
```

### 3. AI Prompt Enhancement
The Edge function builds an enhanced prompt including:
- **Campaign Context**: Name, description, target audience from campaign_templates
- **Top-Performing Inspiration**: Up to 10 high-performing examples with structure:
  - Primary Text
  - Headline
  - Tone & Hook Type
  - Performance metrics
  - Platform data
- **Brand Voice**: User's onboarding data (existing)
- **Compliance Rules**: Meta policy guidelines (existing)

### 4. Generation Instructions
The AI receives explicit instructions to:
- Use examples as structural/tonal inspiration only
- Create completely original content
- Maintain brand voice and personalization
- Ensure Meta policy compliance

## Verification Queries

Use these queries to verify successful import and data quality:

```sql
-- Count ads per campaign
SELECT campaign_canonical_name, COUNT(*) as ad_count 
FROM top_performing_ads 
GROUP BY campaign_canonical_name 
ORDER BY ad_count DESC;

-- Check for orphaned campaigns
SELECT DISTINCT tpa.campaign_canonical_name
FROM top_performing_ads tpa
LEFT JOIN campaign_templates ct ON tpa.campaign_canonical_name = ct.canonical_name
WHERE ct.canonical_name IS NULL;

-- Total statistics
SELECT 
  COUNT(*) as total_ads,
  COUNT(DISTINCT campaign_canonical_name) as unique_campaigns,
  COUNT(CASE WHEN result IS NOT NULL THEN 1 END) as ads_with_results
FROM top_performing_ads;
```

## Content Storage Enhancement

Generated content is stored in `saved_ad_content` with enhanced metadata:

```json
{
  "inspired_by_campaign": "6-week-challenge",
  "top_performing_examples_used": ["example_id_1", "example_id_2"],
  "compliance_status": "PASS",
  "generation_method": "top_performing_inspired"
}
```

## Benefits

1. **Higher Quality Output**: AI learns from proven high-performing structures
2. **Maintained Personalization**: Content remains original and brand-specific
3. **Compliance Assurance**: All outputs pass Meta policy validation
4. **Performance Tracking**: Can analyze which examples lead to better results
5. **Scalable Data**: Easy to add more top-performing examples over time

## Next Steps

1. **Import Initial Data**: Add your top-performing ads via CSV import
2. **Test Generation**: Verify that campaigns with top-performing data produce better outputs
3. **Monitor Performance**: Track which examples correlate with successful ad performance
4. **Expand Data**: Continuously add more high-performing examples
5. **Analytics**: Build dashboards to analyze example effectiveness

## Files Modified

- `supabase/migrations/` - Database schema changes
- `src/hooks/useTemplates.ts` - Added top-performing ads queries
- `supabase/functions/generate-ad-content/index.ts` - Enhanced with inspiration injection
- `src/hooks/useAdGeneration.ts` - Updated to pass campaign canonical name
- `src/pages/AdGenerator.tsx` - Updated generation function calls
- `src/utils/csv-import.ts` - Import utilities and transformation functions
- `src/utils/verification-queries.ts` - Database verification queries