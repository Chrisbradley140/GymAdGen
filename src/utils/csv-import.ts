// CSV Import Utility for Top-Performing Ads

export interface CSVImportRow {
  campaign_name: string;
  primary_text: string;
  headline?: string;
  insights?: string;
  tone?: string;
  hook_type?: string;
  platform?: string;
  target_market?: string;
  target_location?: string;
  result?: string;
  cost_per_result?: string;
  media_url?: string;
}

export interface TopPerformingAd {
  campaign_canonical_name: string;
  primary_text: string;
  headline?: string;
  insights?: string;
  tone?: string;
  hook_type?: string;
  platform?: string[];
  target_market?: string;
  target_location?: string;
  result?: string;
  cost_per_result?: string;
  media_url?: string;
  content_hash: string;
}

/**
 * Converts campaign name to canonical slug format
 * "6 Week Challenge" → "6-week-challenge"
 */
export function slugifyCampaignName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Converts platform string to array
 * "Facebook, Instagram" → ["Facebook", "Instagram"]
 */
export function parsePlatforms(platformString?: string): string[] {
  if (!platformString) return [];
  return platformString
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

/**
 * Generates MD5 content hash from primary_text and headline
 */
export function generateContentHash(primaryText: string, headline?: string): string {
  const content = primaryText + '|' + (headline || '');
  
  // Simple hash function (for production, use a proper crypto library)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Transforms CSV row to database format
 */
export function transformCSVRow(row: CSVImportRow): TopPerformingAd {
  const canonical_name = slugifyCampaignName(row.campaign_name);
  const platforms = parsePlatforms(row.platform);
  const content_hash = generateContentHash(row.primary_text, row.headline);

  return {
    campaign_canonical_name: canonical_name,
    primary_text: row.primary_text,
    headline: row.headline,
    insights: row.insights,
    tone: row.tone,
    hook_type: row.hook_type,
    platform: platforms,
    target_market: row.target_market,
    target_location: row.target_location,
    result: row.result,
    cost_per_result: row.cost_per_result,
    media_url: row.media_url,
    content_hash
  };
}

/**
 * Manual import instructions for Supabase Table Editor
 */
export const MANUAL_IMPORT_INSTRUCTIONS = `
## Manual CSV Import Instructions

### Step 1: Prepare your CSV
Ensure your CSV has these column headers:
- campaign_name
- primary_text
- headline
- insights
- tone
- hook_type
- platform (comma-separated for multiple)
- target_market
- target_location
- result
- cost_per_result
- media_url

### Step 2: Import in Supabase
1. Go to Supabase Dashboard → Table Editor
2. Select the 'top_performing_ads' table
3. Click "Insert" → "Import data from CSV"
4. Upload your CSV file
5. Map the columns appropriately
6. Import the data

### Step 3: Fill content_hash and canonical_name
After import, run this SQL query in the SQL Editor:

\`\`\`sql
-- Update canonical names
UPDATE top_performing_ads 
SET campaign_canonical_name = lower(replace(replace(replace(campaign_name, ' ', '-'), '/', '-'), '--', '-'))
WHERE campaign_canonical_name IS NULL;

-- Generate content hashes
UPDATE top_performing_ads 
SET content_hash = md5(primary_text||'|'||COALESCE(headline, ''))
WHERE content_hash IS NULL;

-- Convert platform strings to arrays (if needed)
UPDATE top_performing_ads 
SET platform = string_to_array(platform_string, ',')
WHERE platform IS NULL AND platform_string IS NOT NULL;
\`\`\`

### Step 4: Verify import
Run the verification queries to check the import was successful.
`;

/**
 * Utility queries for verification
 */
export const VERIFICATION_QUERIES = {
  countPerCampaign: `
    SELECT campaign_canonical_name, COUNT(*) as ad_count 
    FROM top_performing_ads 
    GROUP BY campaign_canonical_name 
    ORDER BY ad_count DESC;
  `,
  
  orphanedCampaigns: `
    SELECT DISTINCT tpa.campaign_canonical_name
    FROM top_performing_ads tpa
    LEFT JOIN campaign_templates ct ON tpa.campaign_canonical_name = ct.canonical_name
    WHERE ct.canonical_name IS NULL;
  `,
  
  totalCount: `
    SELECT COUNT(*) as total_ads FROM top_performing_ads;
  `,
  
  sampleData: `
    SELECT campaign_canonical_name, primary_text, headline, platform, content_hash
    FROM top_performing_ads
    LIMIT 5;
  `
};