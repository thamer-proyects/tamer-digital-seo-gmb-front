import {
  CriticalIssues,
  DataForSEOPagesItem,
  ImportantIssues,
  PageIssuesClassification,
} from '../types/advancedReport';

export function mapPagesItemToIssues(item: DataForSEOPagesItem): PageIssuesClassification {
  const checks = item.checks;

  const critical: CriticalIssues = {
    high_loading_time: checks.high_loading_time,

    redirect_loop: checks.redirect_chain,

    canonical_to_broken: checks.canonical_to_broken,
    recursive_canonical: checks.recursive_canonical,
    is_http: checks.is_http,
    no_title: checks.no_title,
    duplicate_title_tag: checks.duplicate_title_tag,
    broken_links: checks.broken_links,
    links_relation_conflict: checks.links_relation_conflict,
    canonical_to_redirect: checks.canonical_to_redirect,
    canonical_chain: checks.canonical_chain,
    duplicate_content: checks.duplicate_content,
  };

  const important: ImportantIssues = {
    duplicate_title: checks.duplicate_title,
    broken_resources: checks.broken_resources,
    large_page_size: checks.large_page_size,
    duplicate_description: checks.duplicate_description,
    no_description: checks.no_description,
    no_image_alt: checks.no_image_alt,
    seo_friendly_url: checks.seo_friendly_url,
    flash: checks.flash,
    duplicate_meta_tags: checks.duplicate_meta_tags,
    no_h1_tags: checks.no_h1_tag,
    irrelevant_description: checks.irrelevant_description,
    title_too_long: checks.title_too_long,
    is_orphan_page: checks.is_orphan_page,
    irrelevant_title: checks.irrelevant_title,
    title_too_short: checks.title_too_short,
    no_doctype: checks.no_doctype,
    high_content_rate: checks.high_content_rate,
    low_character_count: checks.low_character_count,
    high_character_count: checks.high_character_count,
    low_readability_rate: checks.low_readability_rate,
    deprecated_html_tags: checks.deprecated_html_tags,
    lorem_ipsum: checks.lorem_ipsum,
  };

  return {
    url: item.url,
    critical,
    important,
  };
}
