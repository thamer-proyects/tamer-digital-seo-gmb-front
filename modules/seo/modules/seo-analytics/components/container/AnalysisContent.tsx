import useSeoAnalyticsStore from '../../store/seoAnalyticsStore';
import AdvancedReportCallToAction from '../advanced-report/AdvancedReportCallToAction';
import { PerformanceHeader } from '../free-report/pages-speed-insights/PerformanceHeader';
import PagesSpeedInsights from '../free-report/pages-speed-insights/PagesSpeedInsights';
import SeoOnPageSummary from '../free-report/seo-onpage-summary/SeoOnPageSummary';
import Tabs from '@/components/ui/tabs';
import { Button, Link } from '@heroui/react';
import { generateFreeReportPDF } from '@/modules/seo/utils/generateFreeReport';
import { useContext } from 'react';
import { LoadingContext } from '@/store/loadingContext';
import { redirect } from 'next/navigation';

const AnalysisContent = () => {
  const { freeAnalysisResponse, urlToAnalyze } = useSeoAnalyticsStore();
  const { setLoading, setMessage } = useContext(LoadingContext);

  if (!freeAnalysisResponse) return redirect('/seo/analysis');

  const tabs = [
    {
      id: 'pages-speed-insights',
      label: 'Pages Speed Insights',
      content: (
        <div className="flex flex-col w-full h-[85vh]">
          <PerformanceHeader />
          <div className="grid grid-cols-1 w-full gap-6">
            <PagesSpeedInsights />
          </div>
        </div>
      ),
    },
    {
      id: 'seo-onpage-summary',
      label: 'SEO On-Page Summary',
      content: (
        <div className="flex flex-wrap gap-6 justify-between w-full h-[85vh]">
          <div className="flex-1 min-w-[300px] mt-3">
            <SeoOnPageSummary />
            <AdvancedReportCallToAction />
          </div>
        </div>
      ),
    },
  ];

  return (
    freeAnalysisResponse && (
      <div className="w-full">
        <div className=" text-center py-4 px-6 mb-4 ">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Analysis results for:
          </h2>
          <Link className="text-sm md:text-base text-blue-400 truncate">{urlToAnalyze}</Link>
        </div>

        <Tabs tabs={tabs} />

        <Button
          className="fixed bottom-4 right-4 flex items-center gap-2 z-50"
          color="primary"
          onPress={async () => {
            try {
              setLoading(true);
              setMessage('Creating pdf free report');
              generateFreeReportPDF(freeAnalysisResponse);
            } catch (e) {
              console.log(`Error generating free report ${e}`);
            } finally {
              setLoading(false);
            }
          }}
        >
          Download PDF
        </Button>
      </div>
    )
  );
};

export default AnalysisContent;
