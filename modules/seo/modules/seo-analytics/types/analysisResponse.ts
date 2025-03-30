export interface Metric {
  name: string;
  value: string;
  score: number;
  description: string;
}

export interface Issue {
  title: string;
  description: string;
}

export interface CategoryReport {
  category: string;
  score: number;
  metrics: Metric[];
  issues: Issue[];
  audits: Record<string, any>;
  loadingExperience: any;
}

export interface SSLInfo {
  valid_certificate: boolean;
  certificate_issuer: string;
  certificate_subject: string;
  certificate_version: number;
  certificate_hash: string;
  certificate_expiration_date: string;
}

export interface DomainChecks {
  sitemap: boolean;
  robots_txt: boolean;
  start_page_deny_flag: boolean;
  ssl: boolean;
  http2: boolean;
  test_canonicalization: boolean;
  test_hidden_server_signature?: boolean;
  test_page_not_found: boolean;
  test_https_redirect: boolean;
}

export interface DomainInfo {
  name: string;
  cms: string | null;
  ip: string;
  server: string;
  crawl_start: string;
  crawl_end: string | null;
  extended_crawl_status: string;
  ssl_info: SSLInfo;
  checks: DomainChecks;
  total_pages: number;
  page_not_found_status_code: number;
  canonicalization_status_code: number;
  directory_browsing_status_code: number | null;
  www_redirect_status_code: number | null;
  main_domain: string;
}

export interface CrawlStatus {
  max_crawl_pages: number;
  pages_in_queue: number;
  pages_crawled: number;
}

export interface PageMetricsChecks {
  canonical: number;
  duplicate_meta_tags: number;
  no_description: number;
  frame: number;
  large_page_size: number;
  irrelevant_description: number;
  irrelevant_meta_keywords: number;
  is_https: number;
  is_http: number;
  title_too_long: number;
  low_content_rate: number;
  small_page_size: number;
  no_h1_tag: number;
  recursive_canonical: number;
  no_favicon: number;
  no_image_alt: number;
  no_image_title: number;
  seo_friendly_url: number;
  seo_friendly_url_characters_check: number;
  seo_friendly_url_dynamic_check: number;
  seo_friendly_url_keywords_check: number;
  seo_friendly_url_relative_length_check: number;
  title_too_short: number;
  no_content_encoding: number;
  high_waiting_time: number;
  high_loading_time: number;
  is_redirect: number;
  is_broken: number;
  is_4xx_code: number;
  is_5xx_code: number;
  is_www: number;
  no_doctype: number;
  no_encoding_meta_tag: number;
  high_content_rate: number;
  low_character_count: number;
  high_character_count: number;
  low_readability_rate: number;
  irrelevant_title: number;
  deprecated_html_tags: number;
  duplicate_title_tag: number;
  no_title: number;
  flash: number;
  lorem_ipsum: number;
  has_misspelling: null | number;
  canonical_to_broken: number;
  canonical_to_redirect: number;
  has_links_to_redirects: number;
  is_orphan_page: number;
  has_meta_refresh_redirect: number;
  meta_charset_consistency: number;
  size_greater_than_3mb: number;
  has_html_doctype: number;
  https_to_http_links: number;
  has_render_blocking_resources: number;
  redirect_chain: number;
  canonical_chain: number;
  is_link_relation_conflict: number;
}
export interface PageMetrics {
  onpage_score: number;
  total_issues?: number;
  checks: Record<string, number>;
  checks_info?: Record<
    string,
    {
      urls: string[];
      details?: string;
    }
  >;
  links_external: number;
  links_internal: number;
  duplicate_title: number;
  duplicate_description: number;
  duplicate_content: number;
  broken_links: number;
  broken_resources: number;
  non_indexable: number;
}

export interface SEOSection {
  crawl_progress: string;
  crawl_status: CrawlStatus;
  crawl_gateway_address: string;
  crawl_stop_reason: string | null;
  domain_info: DomainInfo;
  page_metrics: PageMetrics;
}

export interface SpeedSection {
  mobile: CategoryReport[];
  desktop: CategoryReport[];
}

export type BestPractices = {
  seoFriendlyUrls: number;
};

export type IssuesAndWarnings = {
  irrelevantDescriptions: number;
  noMetaDescriptions: number;
  shortTitles: number;
  longTitles: number;
  nonSeoFriendlyUrls: number;
  lowContentRate: number;
  httpsToHttpLinks: number;
};

export type SEOPageMetrics = {
  linksExternal: number;
  linksInternal: number;
  duplicateTitle: number;
  duplicateDescription: number;
  duplicateContent: number;
  brokenLinks: number;
  brokenResources: number;
  onpageScore: number;
  nonIndexablePages: number;
};
export interface PageAnalysisResponse {
  url: string;
  speed: SpeedSection;
  seo: SEOSection;
}

export interface PageSpeedMetric {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
  numericValue?: number;
}

export interface PageSpeedAudit {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
  details?: {
    items?: Array<{
      url?: string;
      wastedMs?: number;
      totalBytes?: number;
      wastedBytes?: number;
    }>;
  };
}

export interface PageSpeedCategory {
  id: string;
  title: string;
  description: string;
  score: number;
  auditRefs: Array<{
    id: string;
    weight: number;
    group?: string;
  }>;
}

export interface PageSpeedResponse {
  id: string;
  loadingExperience: {
    metrics: Record<string, any>;
    overall_category: string;
    initial_url: string;
  };
  originLoadingExperience: {
    metrics: Record<string, any>;
    overall_category: string;
    initial_url: string;
  };
  lighthouseResult: {
    requestedUrl: string;
    finalUrl: string;
    fetchTime: string;
    categories: Record<string, PageSpeedCategory>;
    audits: Record<string, PageSpeedAudit>;
  };
  analysisUTCTimestamp: string;
  kind: string;
}
