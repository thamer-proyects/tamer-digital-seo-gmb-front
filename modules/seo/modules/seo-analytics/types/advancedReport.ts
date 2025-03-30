export type DataForSEOOnPagePagesResponse = {
  version: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  tasks_count: number;
  tasks_error: number;
  tasks: DataForSEOTask[];
};

export type DataForSEOTask = {
  id: string;
  status_code: number;
  status_message: string;
  time: string;
  cost: number;
  result_count: number;
  path: string[];
  data: DataForSEOTaskData;
  result: DataForSEOTaskResult[];
};

export type DataForSEOTaskData = {
  api: string;
  function: string;
  filters: [string, string, string];
  limit: number;
  target: string;
  max_crawl_pages: number;
  store_raw_html: boolean;
  support_cookies: boolean;
  load_resources: boolean;
};

export type DataForSEOTaskResult = {
  crawl_progress: string; // "finished"
  crawl_status: {
    max_crawl_pages: number;
    pages_in_queue: number;
    pages_crawled: number;
  };
  total_items_count: number;
  items_count: number;
  items: DataForSEOPagesItem[];
};

export type DataForSEOPagesItem = {
  resource_type: string;
  status_code: number;
  location: string | null;
  url: string;
  meta: {
    title: string;
    charset: number;
    follow: boolean;
    generator: string | null;
    htags: {
      h1?: string[];
      h2?: string[];
      h3?: string[];
      h4?: string[];
      h5?: string[];
    };
    description: string | null;
    favicon: string | null;
    meta_keywords: string | null;
    canonical: string | null;
    internal_links_count: number;
    external_links_count: number;
    inbound_links_count: number;
    images_count: number;
    images_size: number;
    scripts_count: number;
    scripts_size: number;
    stylesheets_count: number;
    stylesheets_size: number;
    title_length: number;
    description_length: number;
    render_blocking_scripts_count: number;
    render_blocking_stylesheets_count: number;
    cumulative_layout_shift: number;
    meta_title: string | null;
    content: {
      plain_text_size: number;
      plain_text_rate: number;
      plain_text_word_count: number;
      automated_readability_index: number;
      coleman_liau_readability_index: number;
      dale_chall_readability_index: number;
      flesch_kincaid_readability_index: number;
      smog_readability_index: number;
      description_to_content_consistency: number;
      title_to_content_consistency: number;
      meta_keywords_to_content_consistency: number | null;
    };
    deprecated_tags: string[] | null;
    duplicate_meta_tags: string[] | null;
    spell: unknown; // Ajusta el tipo si fuera necesario
    social_media_tags?: Record<string, string>;
  };
  page_timing: {
    time_to_interactive: number;
    dom_complete: number;
    largest_contentful_paint: number;
    first_input_delay: number;
    connection_time: number;
    time_to_secure_connection: number;
    request_sent_time: number;
    waiting_time: number;
    download_time: number;
    duration_time: number;
    fetch_start: number;
    fetch_end: number;
  };
  onpage_score: number;
  total_dom_size: number;
  custom_js_response: unknown;
  custom_js_client_exception: unknown;
  resource_errors: {
    errors: Array<{
      line: number;
      column: number;
      message: string;
      status_code: number;
    }> | null;
    warnings: Array<{
      line: number;
      column: number;
      message: string;
      status_code: number;
    }> | null;
  };
  broken_resources: boolean;
  broken_links: boolean;
  duplicate_title: boolean;
  duplicate_description: boolean;
  duplicate_content: boolean;
  click_depth: number;
  size: number;
  encoded_size: number;
  total_transfer_size: number;
  fetch_time: string; // "2022-06-28 12:51:45 +00:00"
  cache_control: {
    cachable: boolean;
    ttl: number;
  };
  checks: DataForSEOPagesChecks;
  content_encoding: string;
  media_type: string;
  server: string;
  is_resource: boolean;
  url_length: number;
  relative_url_length: number;
  last_modified: {
    header: string | null;
    sitemap: string | null;
    meta_tag: string | null;
  };
};

export type DataForSEOPagesChecks = {
  high_loading_time: boolean;
  canonical_to_broken: boolean;
  recursive_canonical: boolean;
  is_http: boolean;
  no_title: boolean;
  duplicate_title_tag: boolean;
  broken_links: boolean;
  links_relation_conflict: boolean; // => links_relation_conflict?
  canonical_to_redirect: boolean;
  canonical_chain: boolean;
  duplicate_content: boolean;

  duplicate_title: boolean;
  broken_resources: boolean;
  large_page_size: boolean;
  duplicate_description: boolean;
  no_description: boolean;
  no_image_alt: boolean;
  seo_friendly_url: boolean;
  flash: boolean;
  duplicate_meta_tags: boolean;
  no_h1_tag: boolean; // => no_h1_tags
  irrelevant_description: boolean;
  title_too_long: boolean;
  is_orphan_page: boolean;
  irrelevant_title: boolean;
  title_too_short: boolean;
  no_doctype: boolean;
  high_content_rate: boolean;
  low_character_count: boolean;
  high_character_count: boolean;
  low_readability_rate: boolean;
  deprecated_html_tags: boolean;
  lorem_ipsum: boolean;

  no_content_encoding: boolean;
  is_redirect: boolean;
  is_4xx_code: boolean;
  is_5xx_code: boolean;
  is_broken: boolean;
  is_www: boolean;
  is_https: boolean;
  high_waiting_time: boolean;
  has_micromarkup: boolean;
  has_micromarkup_errors: boolean;
  has_html_doctype: boolean;
  canonical: boolean;
  no_encoding_meta_tag: boolean;
  https_to_http_links: boolean;
  size_greater_than_3mb: boolean;
  meta_charset_consistency: boolean;
  has_meta_refresh_redirect: boolean;
  has_render_blocking_resources: boolean;
  redirect_chain: boolean;
  low_content_rate: boolean;
  small_page_size: boolean;
  no_image_title: boolean;
  no_favicon: boolean;
  frame: boolean;
  seo_friendly_url_characters_check: boolean;
  seo_friendly_url_dynamic_check: boolean;
  seo_friendly_url_keywords_check: boolean;
  seo_friendly_url_relative_length_check: boolean;
  has_links_to_redirects: boolean;
};

export type CriticalIssues = {
  high_loading_time: boolean;
  redirect_loop: boolean; // mapped from 'redirect_chain'
  canonical_to_broken: boolean;
  recursive_canonical: boolean;
  is_http: boolean;
  no_title: boolean;
  duplicate_title_tag: boolean;
  broken_links: boolean;
  links_relation_conflict: boolean; // mapped from is_link_relation_conflict
  canonical_to_redirect: boolean;
  canonical_chain: boolean;
  duplicate_content: boolean;
};

export type ImportantIssues = {
  duplicate_title: boolean;
  broken_resources: boolean;
  large_page_size: boolean;
  duplicate_description: boolean;
  no_description: boolean;
  no_image_alt: boolean;
  seo_friendly_url: boolean;
  flash: boolean;
  duplicate_meta_tags: boolean;
  no_h1_tags: boolean;
  irrelevant_description: boolean;
  title_too_long: boolean;
  is_orphan_page: boolean;
  irrelevant_title: boolean;
  title_too_short: boolean;
  no_doctype: boolean;
  high_content_rate: boolean;
  low_character_count: boolean;
  high_character_count: boolean;
  low_readability_rate: boolean;
  deprecated_html_tags: boolean;
  lorem_ipsum: boolean;
};

export type PageIssuesClassification = {
  url: string;

  critical: CriticalIssues;
  important: ImportantIssues;
};
