export const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400 border-green-400';
  if (score >= 70) return 'text-yellow-400 border-yellow-400';
  return 'text-red-400 border-red-400';
};

export const scoreGradient = (score: number) => {
  if (score >= 90) return 'from-green-500/20 to-green-500/10';
  if (score >= 70) return 'from-yellow-500/20 to-yellow-500/10';
  return 'from-red-500/20 to-red-500/10';
};

export const getMetricStatus = (
  value: number,
  isNegativeMetric: boolean = true,
): 'good' | 'warning' | 'error' => {
  if (isNegativeMetric) {
    if (value === 0) return 'good';
    if (value <= 2) return 'warning';
    return 'error';
  } else {
    if (value >= 90) return 'good';
    if (value >= 70) return 'warning';
    return 'error';
  }
};

export const getMetricDescription = (key: string): string => {
  const descriptions: Record<string, string> = {
    no_h1_tag: 'Pages missing H1 tags. H1s are crucial for page structure and SEO.',
    no_image_alt: 'Images missing alt text. Alt tags help with accessibility and SEO.',
    no_description: 'Pages missing meta descriptions. These affect click rates in search results.',
    title_too_long: 'Pages with overlong titles. Keep titles under 60 characters.',
    title_too_short: 'Pages with short titles. Make titles descriptive but concise.',
    low_content_rate: 'Pages with thin content. Add more valuable content.',
    duplicate_content: 'Pages with duplicate content. Make content unique.',
    canonical_critical: 'Pages with canonical issues. Fix to avoid duplicate content problems.',
    broken_links: 'Broken links found. Fix or remove broken links.',
    redirect_chain: 'Long redirect chains detected. Simplify redirects.',
  };
  return descriptions[key] || 'This metric affects your SEO performance';
};

export const getRecommendation = (issueKey: string): string => {
  const recommendations: Record<string, string> = {
    low_content_rate: 'Add more relevant content to improve page value and rankings.',
    duplicate_content: 'Review and make content unique across all pages.',
    no_h1_tag: 'Add descriptive H1 headings to improve content structure.',
    no_image_alt: 'Add alt text to images for better accessibility and SEO.',
    no_description: 'Add unique meta descriptions to improve click-through rates.',
    title_too_long: 'Shorten titles to under 60 characters for optimal display.',
    title_too_short: 'Make titles more descriptive while staying concise.',
    canonical_critical: 'Fix canonical tags to prevent duplicate content issues.',
    broken_links: 'Fix or remove broken links to improve user experience.',
    redirect_chain: 'Simplify redirect chains to improve page load speed.',
  };

  return recommendations[issueKey.toLowerCase()] || 'Review and optimize this issue.';
};

export const getIssueLabel = (key: string): string => {
  const labels: Record<string, string> = {
    no_h1_tag: 'Missing Main Headings (H1)',
    no_image_alt: 'Images Without Alt Text',
    no_description: 'Missing Meta Descriptions',
    title_too_long: 'Overlong Page Titles',
    title_too_short: 'Insufficient Page Titles',
    low_content_rate: 'Pages With Thin Content',
    duplicate_content: 'Duplicate Content Issues',
    canonical_critical: 'Incorrect Canonical Tags',
    broken_links: 'Broken Link Issues',
    redirect_chain: 'Problematic Redirect Chains',
    frame: 'Frames Without Titles',
    duplicate_meta_tags: 'Duplicate Meta Tag Issues',
    sitemap: 'Sitemap Issues',
    robots_txt: 'Robots.txt Issues',
    start_page_deny_flag: 'Start Page Deny Flag Detected',
    ssl: 'SSL Configuration Issues',
    http2: 'HTTP/2 Not Enabled',
    test_canonicalization: 'Canonicalization Not Tested',
    test_hidden_server_signature: 'Hidden Server Signature Issues',
    test_page_not_found: '404 Page Issues',
    test_directory_browsing: 'Directory Browsing Enabled',
    test_https_redirect: 'HTTPS Redirect Not Configured',
    large_page_size: 'Large Page Size Detected',
    irrelevant_description: 'Irrelevant Meta Descriptions',
    irrelevant_meta_keywords: 'Irrelevant Meta Keywords',
    is_https: 'Page Uses HTTPS',
    is_http: 'Page Uses HTTP',
    small_page_size: 'Small Page Size Detected',
    recursive_canonical: 'Recursive Canonical Tags',
    no_favicon: 'Missing Favicon',
    no_image_title: 'Images Without Title Attribute',
    seo_friendly_url: 'Non-SEO-Friendly URLs',
    seo_friendly_url_characters_check: 'Invalid Characters in URL',
    seo_friendly_url_dynamic_check: 'Dynamic URL Detected',
    seo_friendly_url_keywords_check: 'Missing Keywords in URL',
    seo_friendly_url_relative_length_check: 'URL Length Issue',
    no_content_encoding: 'Missing Content-Encoding',
    high_waiting_time: 'High Waiting Time Detected',
    high_loading_time: 'High Loading Time Detected',
    is_redirect: 'Redirect Detected',
    is_broken: 'Broken Page',
    is_4xx_code: 'Page Returns 4xx Code',
    is_5xx_code: 'Page Returns 5xx Code',
    is_www: 'WWW Subdomain Usage',
    no_doctype: 'Missing Doctype',
    no_encoding_meta_tag: 'Missing Encoding Meta Tag',
    high_content_rate: 'High Content Rate',
    low_character_count: 'Low Character Count in Content',
    high_character_count: 'High Character Count in Content',
    low_readability_rate: 'Low Readability Rate',
    irrelevant_title: 'Irrelevant Page Title',
    deprecated_html_tags: 'Deprecated HTML Tags Detected',
    duplicate_title_tag: 'Duplicate Title Tags',
    no_title: 'Missing Page Title',
    flash: 'Flash Content Detected',
    lorem_ipsum: 'Lorem Ipsum Placeholder Text Found',
    has_misspelling: 'Misspellings Detected',
    canonical_to_broken: 'Canonical Points to Broken URL',
    canonical_to_redirect: 'Canonical Points to Redirect',
    has_links_to_redirects: 'Links to Redirects Detected',
    is_orphan_page: 'Orphan Page Detected',
    has_meta_refresh_redirect: 'Meta Refresh Redirect Detected',
    meta_charset_consistency: 'Meta Charset Inconsistency',
    size_greater_than_3mb: 'Page Size Greater Than 3MB',
    has_html_doctype: 'HTML Doctype Detected',
    https_to_http_links: 'HTTPS Page Links to HTTP',
    has_render_blocking_resources: 'Render-Blocking Resources Detected',
    canonical_chain: 'Canonical Chain Issues',
    is_link_relation_conflict: 'Link Relation Conflict',
  };
  return labels[key] || key.replace(/_/g, ' ');
};
