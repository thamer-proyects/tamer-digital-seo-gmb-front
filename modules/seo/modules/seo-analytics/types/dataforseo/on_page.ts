type OnPageLinksRequestType = {
  id: string;
  page_from?: string;
  page_to?: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>[];
  tag?: string;
};

type OnPageTaskPostRequestType = {
  target: string;
  max_crawl_pages?: number;
  start_url: string;
  force_sitewide_checks?: boolean;
  priority_urls?: string[];
  max_crawl_depth?: number;
  crawl_delay?: number;
  store_raw_html?: boolean;
  enable_content_parsing?: boolean;
  support_cookies?: boolean;
  accept_language?: string;
  custom_robots_txt?: string;
  robots_txt_merge_mode?: string;
  custom_user_agent?: string;
  browser_preset?: string;
  browser_screen_width?: number;
  browser_screen_height?: number;
  browser_screen_scale_factor?: number;
  respect_sitemap?: boolean;
  custom_sitemap?: string;
  crawl_sitemap_only?: boolean;
  load_resources?: boolean;
  enable_www_redirect_check?: boolean;
  enable_javascript?: boolean;
  enable_xhr?: boolean;
  enable_browser_rendering?: boolean;
  disable_cookie_popup?: boolean;
  custom_js?: string;
  validate_micromarkup?: boolean;
  allow_subdomains?: boolean;
  allowed_subdomains?: string[];
  disallowed_subdomains?: string[];
  check_spell?: boolean;
  check_spell_language?: string;
  check_spell_exceptions?: string[];
  calculate_keyword_density?: boolean;
  checks_threshold?: AdditionalPropsType;
  disable_sitewide_checks?: string[];
  disable_page_checks?: string[];
  switch_pool?: boolean;
  return_despite_timeout?: boolean;
  tag?: string;
  pingback_url?: string;
};

type CacheControlType = {
  cachable: boolean;
  ttl?: number;
};

type AdditionalPropsType = {
  additionalProp1?: Record<string, unknown>;
  additionalProp2?: Record<string, unknown>;
  additionalProp3?: Record<string, unknown>;
};

type CrawlStatusType = {
  max_crawl_pages: number;
  pages_in_queue?: number;
  pages_crawled?: number;
};

type OnPagePagesRequestType = {
  id: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>[];
  order_by?: string[];
  tag?: string;
};

type IssueType = {
  errors?: ItemsIssueInfoType;
  warnings?: ItemsIssueInfoType;
};

type ItemsIssueInfoType = {
  line?: number;
  column?: number;
  message?: string;
  status_code?: number;
};

type ItemsResponseType = {
  status_code: number;
  location?: string;
  url: string;
  resource_errors?: IssueType;
  size?: number;
  encoded_size?: number;
  total_transfer_size?: number;
  fetch_time?: string;
  cache_control?: CacheControlType;
  checks?: AdditionalPropsType;
  content_encoding?: string;
  media_type?: string;
  server?: string;
  last_modified?: {
    header?: string;
    sitemap?: string;
    meta_tag?: string;
  };
};

type LinkItemInfoType = {
  domain_from?: string;
  domain_to?: string;
  page_from?: string;
  page_to?: string;
  link_from?: string;
  link_to?: string;
  dofollow?: boolean;
  page_from_scheme?: string;
  page_to_scheme?: string;
  direction?: string;
  is_broken?: boolean;
  is_link_relation_conflict?: boolean;
};

type OnPageTaskType<T = Record<string, unknown>> = {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost?: number;
  result_count?: number;
  path?: string[];
  data?: AdditionalPropsType;
  result?: T;
};

type OnPageTaskReadyResponseType = {
  id: string;
  target: string;
  date_posted?: string;
  tag?: string;
};

type OnPagePagesResponseType = {
  crawl_progress: string;
  crawl_status: CrawlStatusType;
  total_items_count: number;
  items_count: number;
  items?: ItemsResponseType[];
};

type OnPageSummaryResponseType = {
  crawl_progress: string;
  crawl_status: CrawlStatusType;
  crawl_gateway_address?: string;
  crawl_stop_reason?: string;
  domain_info?: {
    name: string;
    cms?: string;
    ip?: string;
    server?: string;
    crawl_start?: string;
    crawl_end?: string;
    extended_crawl_status?: string;
    ssl_info?: {
      valid_certificate: boolean;
      certificate_issuer?: string;
      certificate_subject?: string;
      certificate_version?: string;
      certificate_hash?: string;
      certificate_expiration_date?: string;
    };
    checks?: AdditionalPropsType;
    total_pages?: number;
    page_not_found_status_code?: number;
    canonicalization_status_code?: number;
    directory_browsing_status_code?: number;
    www_redirect_status_code?: number;
    main_domain?: string;
    page_metrics?: {
      links_external?: number;
      links_internal?: number;
      duplicate_title?: number;
      duplicate_description?: number;
      duplicate_content?: number;
      broken_links?: number;
      broken_resources?: number;
      links_relation_conflict?: number;
      redirect_loop?: number;
      onpage_score?: number;
      non_indexable?: number;
      checks?: AdditionalPropsType;
    };
  };
};

type OnPageLinksResponseType = {
  crawl_progress: string;
  crawl_status: CrawlStatusType;
  total_items_count: number;
  items_count: number;
  items?: LinkItemInfoType[];
};

type OnPageBaseResponseType<T = Record<string, unknown>> = {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost?: number;
  tasks_count?: number;
  tasks_error?: number;
  tasks?: OnPageTaskType<T>[];
};

export type {
  OnPageBaseResponseType,
  OnPagePagesRequestType,
  OnPagePagesResponseType,
  OnPageTaskReadyResponseType,
  OnPageSummaryResponseType,
  OnPageLinksRequestType,
  OnPageLinksResponseType,
  OnPageTaskPostRequestType,
};
