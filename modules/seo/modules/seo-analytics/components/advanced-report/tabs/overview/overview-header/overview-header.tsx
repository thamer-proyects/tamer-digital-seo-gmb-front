'use client';
import { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Activity } from 'lucide-react';
import { SiteHealthRing } from '../site-health';
import { TabSummaries } from '../tab-summaries';
import RootCard from '@/components/ui/root-card';
import { OverviewHeaderProps } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';
import { RecommendationsCallout } from '../recommendations/recommendations-callout';
import { tabSummariesData } from '@/modules/seo/modules/seo-analytics/mocks/advancedReportTabSummaries';
export const OverviewHeader = memo(function OverviewHeader({ siteHealth }: OverviewHeaderProps) {
  const recommendationsData = tabSummariesData.find((summary) => summary.key === 'recommendations');
  
  const handleTabChange = (key: string) => {
    const tabElement = document.querySelector(`[role="tab"][data-key="${key}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <div className="space-y-8">
        {/* Recommendations Section - MOVED TO TOP */}
        {recommendationsData && (
         <div className="lg:col-span-8 w-full">
           <RecommendationsCallout summary={recommendationsData} onViewDetails={handleTabChange} />
         </div>
       )}
   
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
        <div className="lg:col-span-4">
          <SiteHealthRing siteHealth={siteHealth} />
        </div>

        <div className="lg:col-span-8">
          <RootCard className="h-full">
            <CardBody className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">General Site Status</h2>
                  <p className="text-default-500">SEO Audit and Performance Analysis</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-default-600 leading-relaxed">
                  This report provides a comprehensive overview of your website's status, based on
                  on-page and off-page SEO metrics. Each section highlights key areas that impact
                  your search engine performance.
                </p>
                <p className="text-sm text-default-500">
                  Explore each section for detailed recommendations and specific improvements.
                </p>
              </div>
            </CardBody>
          </RootCard>
        </div>
      </div>

      <div>
        <TabSummaries onTabChange={handleTabChange} />
      </div>
    </div>
  );
});
