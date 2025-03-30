import { SeoScore } from './SeoScore';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import useSeoAnalyticsStore from '../../../store/seoAnalyticsStore';
import { CardBody } from '@heroui/react';
import RootCard from '@/components/ui/root-card';

const SeoOnPageSummary: React.FC = () => {
  const { freeAnalysisResponse } = useSeoAnalyticsStore();

  const externalLinksCount = freeAnalysisResponse?.seo?.page_metrics?.links_external ?? 0;
  const internalLinksCount = freeAnalysisResponse?.seo?.page_metrics?.links_internal ?? 0;
  const duplicateTitlesCount = freeAnalysisResponse?.seo?.page_metrics?.duplicate_title ?? 0;
  const duplicateDescriptionsCount =
    freeAnalysisResponse?.seo?.page_metrics?.duplicate_description ?? 0;
  const duplicateContentCount = freeAnalysisResponse?.seo?.page_metrics?.duplicate_content ?? 0;
  const brokenLinksCount = freeAnalysisResponse?.seo?.page_metrics?.broken_links ?? 0;
  const brokenResourcesCount = freeAnalysisResponse?.seo?.page_metrics?.broken_resources ?? 0;
  const nonIndexablePagesCount = freeAnalysisResponse?.seo?.page_metrics?.non_indexable ?? 0;

  const irrelevantDescriptionsCount =
    freeAnalysisResponse?.seo?.page_metrics?.checks?.irrelevant_description ?? 0;
  const noDescriptionCount = freeAnalysisResponse?.seo?.page_metrics?.checks?.no_description ?? 0;
  const shortTitlesCount = freeAnalysisResponse?.seo?.page_metrics?.checks?.title_too_short ?? 0;
  const longTitlesCount = freeAnalysisResponse?.seo?.page_metrics?.checks?.title_too_long ?? 0;
  const nonSeoFriendlyUrlsCount =
    freeAnalysisResponse?.seo?.page_metrics?.checks?.seo_friendly_url ?? 0;
  const lowContentRateCount =
    freeAnalysisResponse?.seo?.page_metrics?.checks?.low_content_rate ?? 0;
  const httpsToHttpLinksCount =
    freeAnalysisResponse?.seo?.page_metrics?.checks?.https_to_http_links ?? 0;

  const getClassByCount = (count: number) => {
    if (count === 0) return 'bg-green-400/10 text-green-400';
    if (count <= 2) return 'bg-yellow-400/10 text-yellow-400';
    return 'bg-red-400/10 text-red-400';
  };

  const getStatusIcon = (value: number, isNegative: boolean = true) => {
    if (isNegative) {
      if (value === 0) return <CheckCircle className="w-5 h-5 text-green-400" />;
      if (value <= 2) return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return value > 0 ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        <div className="grid lg:grid-cols-1 gap-3">
          <SeoScore
            score={freeAnalysisResponse?.seo?.page_metrics?.onpage_score ?? 0}
            pagesAnalyzed={freeAnalysisResponse?.seo?.crawl_status?.pages_crawled ?? 0}
            issuesFound={freeAnalysisResponse?.seo?.page_metrics?.total_issues ?? 0}
          />
          <RootCard className="p-6">
            <CardBody>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
                Best Practices
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">Redirect loop</span>
                  <div className="flex items-center gap-2">
                    {!freeAnalysisResponse?.seo.page_metrics.checks.redirect_loop ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">Frendly URLs</span>
                  <div className="flex items-center gap-2">
                    {freeAnalysisResponse?.seo.page_metrics.checks.seo_friendly_url ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </RootCard>
        </div>

        <RootCard className="grid grid-cols-1 gap-6 p-6 h-full">
          <CardBody>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Content Structure
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">External Links</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium bg-green-400/10 text-green-400`}
                    >
                      {externalLinksCount}
                    </span>
                    {getStatusIcon(externalLinksCount, false)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">Internal Links</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium bg-green-400/10 text-green-400`}
                    >
                      {internalLinksCount}
                    </span>
                    {getStatusIcon(internalLinksCount, false)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">
                    Duplicated Titles
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(duplicateTitlesCount)}`}
                    >
                      {duplicateTitlesCount}
                    </span>
                    {getStatusIcon(duplicateTitlesCount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">
                    Duplicated Descriptions
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(duplicateDescriptionsCount)}`}
                    >
                      {duplicateDescriptionsCount}
                    </span>
                    {getStatusIcon(duplicateDescriptionsCount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">
                    Duplicated Content
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(duplicateContentCount)}`}
                    >
                      {duplicateContentCount}
                    </span>
                    {getStatusIcon(duplicateContentCount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">Broken Links</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(brokenLinksCount)}`}
                    >
                      {brokenLinksCount}
                    </span>
                    {getStatusIcon(brokenLinksCount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">Broken Resources</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(brokenResourcesCount)}`}
                    >
                      {brokenResourcesCount}
                    </span>
                    {getStatusIcon(brokenResourcesCount)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-800 dark:text-gray-400">
                    Non-indexable pages
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(nonIndexablePagesCount)}`}
                    >
                      {nonIndexablePagesCount}
                    </span>
                    {getStatusIcon(nonIndexablePagesCount)}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </RootCard>

        <RootCard className="grid grid-cols-1 gap-6 p-6">
          <CardBody>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Issues and Warnings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">
                  Irrelevant Descriptions
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(irrelevantDescriptionsCount)}`}
                  >
                    {irrelevantDescriptionsCount}
                  </span>
                  {getStatusIcon(irrelevantDescriptionsCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">
                  Missing Meta Descriptions
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(noDescriptionCount)}`}
                  >
                    {noDescriptionCount}
                  </span>
                  {getStatusIcon(noDescriptionCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">Short Titles</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(shortTitlesCount)}`}
                  >
                    {shortTitlesCount}
                  </span>
                  {getStatusIcon(shortTitlesCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">Long Titles</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(longTitlesCount)}`}
                  >
                    {longTitlesCount}
                  </span>
                  {getStatusIcon(longTitlesCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">
                  Non SEO-Friendly URLs
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(nonSeoFriendlyUrlsCount)}`}
                  >
                    {nonSeoFriendlyUrlsCount}
                  </span>
                  {getStatusIcon(nonSeoFriendlyUrlsCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">Low Content Rate</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(lowContentRateCount)}`}
                  >
                    {lowContentRateCount}
                  </span>
                  {getStatusIcon(lowContentRateCount)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-gray-400">
                  HTTPS to HTTP Links
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-sm font-medium ${getClassByCount(httpsToHttpLinksCount)}`}
                  >
                    {httpsToHttpLinksCount}
                  </span>
                  {getStatusIcon(httpsToHttpLinksCount)}
                </div>
              </div>
            </div>
          </CardBody>
        </RootCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <RootCard className="grid md:grid-cols-1 gap-6 p-6">
          <CardBody>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Domain Info</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between ">
                <span className="text-gray-800 dark:text-gray-400">SSL Certificate</span>
                {freeAnalysisResponse?.seo.domain_info.ssl_info.valid_certificate ? (
                  <div className="flex gap-2">
                    <span className="text-green-400">Valid</span>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <span className="text-red-400">Invalid</span>
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-400">Robots.txt</span>
                {freeAnalysisResponse?.seo.domain_info.checks.robots_txt ? (
                  <span className="text-green-400">Present</span>
                ) : (
                  <span className="text-red-400">Missing</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-400">Sitemap</span>
                {freeAnalysisResponse?.seo.domain_info.checks.sitemap ? (
                  <span className="text-green-400">Found</span>
                ) : (
                  <span className="text-yellow-400">Not Found</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 dark:text-gray-400">Total indexed pages</span>

                <span className="text-gray-800 dark:text-gray-400 font-semibold">
                  {freeAnalysisResponse?.seo.domain_info.total_pages ?? 0}
                </span>
              </div>
            </div>
          </CardBody>
        </RootCard>

        <RootCard className="p-6  h-full">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Meta Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-400">Missing Meta Descriptions</span>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    freeAnalysisResponse?.seo.page_metrics.checks.no_description === 0
                      ? 'bg-green-400/10 text-green-400'
                      : (freeAnalysisResponse?.seo.page_metrics.checks.no_description ?? 0) <= 2
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'bg-red-400/10 text-red-400'
                  }`}
                >
                  {freeAnalysisResponse?.seo.page_metrics.checks.no_description || 0}
                </span>
                {getStatusIcon(freeAnalysisResponse?.seo.page_metrics.checks.no_description || 0)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-800 dark:text-gray-400">Title Tag Issues</span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-sm font-medium ${
                    (freeAnalysisResponse?.seo.page_metrics.checks.title_too_long || 0) +
                      (freeAnalysisResponse?.seo.page_metrics.checks.title_too_short || 0) ===
                    0
                      ? 'bg-green-400/10 text-green-400'
                      : (freeAnalysisResponse?.seo.page_metrics.checks.title_too_long || 0) +
                            (freeAnalysisResponse?.seo.page_metrics.checks.title_too_short || 0) <=
                          2
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'bg-red-400/10 text-red-400'
                  }`}
                >
                  {(freeAnalysisResponse?.seo.page_metrics.checks.title_too_long || 0) +
                    (freeAnalysisResponse?.seo.page_metrics.checks.title_too_short || 0)}
                </span>
                {getStatusIcon(
                  (freeAnalysisResponse?.seo.page_metrics.checks.title_too_long || 0) +
                    (freeAnalysisResponse?.seo.page_metrics.checks.title_too_short || 0),
                )}
              </div>
            </div>
          </div>
        </RootCard>
      </div>
    </div>
  );
};

export default SeoOnPageSummary;
