import React, { memo } from 'react';
import { CrawlabilityCard } from '../tab-summary/crawlability-card';
import { InternalLinkingCard } from '../tab-summary/internal-linking-card';
import { MarkupCard } from '../tab-summary/markup-card';
import { HttpStatusCard } from '../tab-summary/http-status-card';
import { CanonicalizationCard } from '../tab-summary/canonicalization-card';
import { HreflangCard } from '../tab-summary/hreflang-card';
import { OffPageSeoCard } from '../tab-summary/offpage-seo-card';
import { TechnicalSeoCard } from '../tab-summary/technical-seo-card';
import { RecommendationsCallout } from '../recommendations/recommendations-callout';
import { tabSummariesData } from '@/modules/seo/modules/seo-analytics/mocks/advancedReportTabSummaries';

interface TabSummariesProps {
  onTabChange: (key: string) => void;
}

export const TabSummaries = memo(function TabSummaries({ onTabChange }: TabSummariesProps) {
  const recommendationsData = tabSummariesData.find((summary) => summary.key === 'recommendations');

  return (
    <div className="space-y-6">
      {/* Top Grid: Crawlability with Internal Linking and Markup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Crawlability Card - Left Side */}
        <div className="lg:col-span-5">
          <CrawlabilityCard />
        </div>

        {/* Internal Linking and Markup Cards - Right Side */}
        <div className="lg:col-span-7 grid grid-rows-2 gap-6">
          <InternalLinkingCard />
          <MarkupCard />
        </div>
      </div>

      {/* HTTP Status Card */}
      <div>
        <HttpStatusCard />
      </div>

      {/* Canonicalization, Hreflang, and Off-Page SEO Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canonicalization Card */}
        <div className="lg:col-span-1">
          <CanonicalizationCard />
        </div>

        {/* Hreflang Card */}
        <div className="lg:col-span-1">
          <HreflangCard />
        </div>

        {/* Off-Page SEO Card */}
        <div className="lg:col-span-1">
          <OffPageSeoCard />
        </div>
      </div>

      {/* Technical SEO and Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Technical SEO Card (AMP Links) - 4 columns */}
        <div className="lg:col-span-4">
          <TechnicalSeoCard />
        </div>

        {/* Recommendations Section - 8 columns */}
        {recommendationsData && (
          <div className="lg:col-span-8">
            <RecommendationsCallout summary={recommendationsData} onViewDetails={onTabChange} />
          </div>
        )}
      </div>
    </div>
  );
});
