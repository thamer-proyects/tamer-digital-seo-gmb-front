import React, { memo } from 'react';
import { AdvancedReportTabData } from '../../../types/advancedReportTabs';
import { OverviewHeader } from '../tabs/overview/overview-header/overview-header';
import { BacklinksContent } from '../tabs/backlinks/BacklinksContent';
import { CanonicalizationContent } from '../tabs/canonicalization/CanonicalizationContent';
import { CrawlabilityContent } from '../tabs/crawlability/CrawlabilityContent';
import { InternalLinkingContent } from '../tabs/internal-linking/InternalLinkingContent';
import { MarkupContent } from '../tabs/markup/MarkupContent';
import { RecommendationsContent } from '../tabs/recommendations/RecommendationsContent';

interface AdvancedReportTabContentProps {
  item: Pick<AdvancedReportTabData, 'heading' | 'description' | 'key'>;
}

export const AdvancedReportTabContent = memo(function TabContent({
  item: { key, heading, description },
}: AdvancedReportTabContentProps) {
  const mockSiteHealth = {
    score: 78,
    topSitesAverage: 92,
  };

  if (key === 'overview') {
    return <OverviewHeader siteHealth={mockSiteHealth} />;
  }

  if (key === 'crawlability') {
    return <CrawlabilityContent />;
  }

  if (key === 'internal-linking') {
    return <InternalLinkingContent />;
  }

  if (key === 'markup') {
    return <MarkupContent />;
  }

  if (key === 'canonicalization') {
    return <CanonicalizationContent />;
  }

  if (key === 'backlinks') {
    return <BacklinksContent />;
  }

  if (key === 'recommendations') {
    return <RecommendationsContent />;
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
});
