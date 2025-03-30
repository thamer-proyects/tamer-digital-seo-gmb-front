import { EPagesSpeedCategories } from '@/modules/seo/constants/pagesSpeedCateogories';
import { PerformanceCard } from './PerformanceCard';
import useSeoAnalyticsStore from '../../../store/seoAnalyticsStore';

const PagesSpeedInsights = () => {
  const { selectedCategory, freeAnalysisResponse } = useSeoAnalyticsStore();
  const mobileData = freeAnalysisResponse?.speed.mobile;
  const desktopData = freeAnalysisResponse?.speed.desktop;

  const mobileDataByCategory = mobileData?.find(
    (category: { category: string }) => category.category === selectedCategory,
  );
  const desktopDataByCategory = desktopData?.find(
    (category: { category: string }) => category.category === selectedCategory,
  );

  const categoryName = selectedCategory
    ? (EPagesSpeedCategories[selectedCategory as keyof typeof EPagesSpeedCategories] ??
      'Performance')
    : 'Performance';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <PerformanceCard
        type="mobile"
        score={mobileDataByCategory?.score ?? 0}
        metrics={mobileDataByCategory?.metrics}
        issues={mobileDataByCategory?.issues}
        audits={mobileDataByCategory?.audits}
        category={categoryName}
      />
      <PerformanceCard
        type="desktop"
        score={desktopDataByCategory?.score ?? 0}
        metrics={desktopDataByCategory?.metrics}
        issues={desktopDataByCategory?.issues}
        audits={desktopDataByCategory?.audits}
        category={categoryName}
      />
    </div>
  );
};

export default PagesSpeedInsights;
