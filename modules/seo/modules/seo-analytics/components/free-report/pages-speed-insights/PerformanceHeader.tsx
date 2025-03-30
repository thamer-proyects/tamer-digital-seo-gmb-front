import { Zap, Accessibility, CheckCircle, Search } from 'lucide-react';
import { MetricBadge } from './MetricBadge';
import useSeoAnalyticsStore from '../../../store/seoAnalyticsStore';
import { getBadgeColor } from '../../../utils/getBadgeColor';

export function PerformanceHeader() {
  const { selectedCategory, setSelectedCategory, freeAnalysisResponse } = useSeoAnalyticsStore();

  const handleSetCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const getScoreByCategoryAndStrategy = (strategy: string, category: string) => {
    if (strategy === 'mobile')
      return freeAnalysisResponse?.speed.mobile.find((c) => c.category === category)?.score ?? 0;
    return freeAnalysisResponse?.speed.desktop.find((c) => c.category === category)?.score ?? 0;
  };
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {['performance', 'accessibility', 'best-practices', 'seo'].map((category) => {
        const mobileScore = getScoreByCategoryAndStrategy('mobile', category);
        const desktopScore = getScoreByCategoryAndStrategy('desktop', category);
        let icon;
        if (category === 'performance') {
          icon = <Zap className="w-5 h-5" />;
        } else if (category === 'accessibility') {
          icon = <Accessibility className="w-5 h-5" />;
        } else if (category === 'best-practices') {
          icon = <CheckCircle className="w-5 h-5" />;
        } else {
          icon = <Search className="w-5 h-5" />;
        }

        return (
          <MetricBadge
            key={category}
            icon={icon}
            label={category.charAt(0).toUpperCase() + category.slice(1)}
            mobileScore={mobileScore}
            desktopScore={desktopScore}
            color={getBadgeColor(desktopScore, mobileScore, selectedCategory === category)}
            showDeviceIcons={true}
            onClick={() => handleSetCategory(category)}
          />
        );
      })}
    </div>
  );
}
