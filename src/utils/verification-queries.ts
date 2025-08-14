// Verification Queries for Top-Performing Ads

export const VERIFICATION_QUERIES = {
  // Count ads per campaign
  countPerCampaign: `
    SELECT 
      campaign_canonical_name, 
      COUNT(*) as ad_count,
      COUNT(CASE WHEN result IS NOT NULL THEN 1 END) as ads_with_results,
      COUNT(CASE WHEN cost_per_result IS NOT NULL THEN 1 END) as ads_with_cost_data
    FROM top_performing_ads 
    GROUP BY campaign_canonical_name 
    ORDER BY ad_count DESC;
  `,
  
  // Check for orphaned campaigns (no matching campaign_template)
  orphanedCampaigns: `
    SELECT DISTINCT tpa.campaign_canonical_name
    FROM top_performing_ads tpa
    LEFT JOIN campaign_templates ct ON tpa.campaign_canonical_name = ct.canonical_name
    WHERE ct.canonical_name IS NULL;
  `,
  
  // Total count and basic stats
  totalStats: `
    SELECT 
      COUNT(*) as total_ads,
      COUNT(DISTINCT campaign_canonical_name) as unique_campaigns,
      COUNT(CASE WHEN result IS NOT NULL THEN 1 END) as ads_with_results,
      COUNT(CASE WHEN cost_per_result IS NOT NULL THEN 1 END) as ads_with_cost_data,
      COUNT(CASE WHEN platform IS NOT NULL THEN 1 END) as ads_with_platform_data
    FROM top_performing_ads;
  `,
  
  // Sample data to verify import structure
  sampleData: `
    SELECT 
      campaign_canonical_name, 
      LEFT(primary_text, 100) as primary_text_preview,
      headline, 
      platform, 
      result,
      cost_per_result,
      content_hash
    FROM top_performing_ads
    ORDER BY created_at DESC
    LIMIT 10;
  `,

  // Check for duplicate content hashes within campaigns
  duplicateContentHashes: `
    SELECT 
      campaign_canonical_name,
      content_hash,
      COUNT(*) as duplicate_count
    FROM top_performing_ads
    GROUP BY campaign_canonical_name, content_hash
    HAVING COUNT(*) > 1
    ORDER BY duplicate_count DESC;
  `,

  // Performance distribution analysis
  performanceDistribution: `
    SELECT 
      campaign_canonical_name,
      COUNT(*) as total_ads,
      AVG(CASE WHEN result ~ '^[0-9.]+$' THEN result::numeric ELSE NULL END) as avg_result,
      MIN(CASE WHEN result ~ '^[0-9.]+$' THEN result::numeric ELSE NULL END) as min_result,
      MAX(CASE WHEN result ~ '^[0-9.]+$' THEN result::numeric ELSE NULL END) as max_result
    FROM top_performing_ads
    WHERE result IS NOT NULL
    GROUP BY campaign_canonical_name
    ORDER BY avg_result DESC NULLS LAST;
  `,

  // Platform distribution
  platformDistribution: `
    SELECT 
      unnest(platform) as platform_name,
      COUNT(*) as ad_count
    FROM top_performing_ads
    WHERE platform IS NOT NULL
    GROUP BY platform_name
    ORDER BY ad_count DESC;
  `,

  // Missing data analysis
  missingDataAnalysis: `
    SELECT 
      'headline' as field_name,
      COUNT(CASE WHEN headline IS NULL OR headline = '' THEN 1 END) as missing_count,
      COUNT(*) as total_count,
      ROUND((COUNT(CASE WHEN headline IS NULL OR headline = '' THEN 1 END) * 100.0 / COUNT(*)), 2) as missing_percentage
    FROM top_performing_ads
    
    UNION ALL
    
    SELECT 
      'insights' as field_name,
      COUNT(CASE WHEN insights IS NULL OR insights = '' THEN 1 END) as missing_count,
      COUNT(*) as total_count,
      ROUND((COUNT(CASE WHEN insights IS NULL OR insights = '' THEN 1 END) * 100.0 / COUNT(*)), 2) as missing_percentage
    FROM top_performing_ads
    
    UNION ALL
    
    SELECT 
      'tone' as field_name,
      COUNT(CASE WHEN tone IS NULL OR tone = '' THEN 1 END) as missing_count,
      COUNT(*) as total_count,
      ROUND((COUNT(CASE WHEN tone IS NULL OR tone = '' THEN 1 END) * 100.0 / COUNT(*)), 2) as missing_percentage
    FROM top_performing_ads
    
    UNION ALL
    
    SELECT 
      'platform' as field_name,
      COUNT(CASE WHEN platform IS NULL OR array_length(platform, 1) IS NULL THEN 1 END) as missing_count,
      COUNT(*) as total_count,
      ROUND((COUNT(CASE WHEN platform IS NULL OR array_length(platform, 1) IS NULL THEN 1 END) * 100.0 / COUNT(*)), 2) as missing_percentage
    FROM top_performing_ads
    
    ORDER BY missing_percentage DESC;
  `
};

// SQL query to fill missing content_hash values after manual import
export const FILL_CONTENT_HASH_QUERY = `
UPDATE top_performing_ads 
SET content_hash = md5(primary_text||'|'||COALESCE(headline, ''))
WHERE content_hash IS NULL OR content_hash = '';
`;

// SQL query to convert platform strings to arrays (if imported as text)
export const CONVERT_PLATFORM_TO_ARRAY_QUERY = `
UPDATE top_performing_ads 
SET platform = string_to_array(platform_string, ',')
WHERE platform IS NULL AND platform_string IS NOT NULL;
`;

export default VERIFICATION_QUERIES;