'use client';
import { memo } from 'react';
import { CardBody, Button } from '@heroui/react';
import { ArrowRight, Users, Rocket, Star, BarChart as ChartBar, Globe, Target } from 'lucide-react';
import { TabSummary } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';
import RootCard from '@/components/ui/root-card';

interface RecommendationsCalloutProps {
  summary: TabSummary;
  onViewDetails: (key: string) => void;
}

export const RecommendationsCallout = memo(function RecommendationsCallout({
  summary: { key, title, icon: Icon },
  onViewDetails,
}: RecommendationsCalloutProps) {
  return (
    <RootCard className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
      <CardBody className="p-8">
        <div className="h-full flex flex-col justify-between gap-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Icon className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <p className="text-lg text-default-600">
              Power your online presence and reach new heights!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-3 gap-x-4">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-success-50 dark:bg-success-900/20 flex-shrink-0">
                  <Rocket className="w-5 h-5 text-success-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">Greater visibility</h4>
                  <p className="text-xs text-default-500 truncate">TOP AND Google</p>
                </div>
              </div>
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-primary-50 dark:bg-primary-900/20 flex-shrink-0">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">More traffic</h4>
                  <p className="text-xs text-default-500 truncate">Qualified visits</p>
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-warning-50 dark:bg-warning-900/20 flex-shrink-0">
                  <Star className="w-5 h-5 text-warning-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">Best experience</h4>
                  <p className="text-xs text-default-500 truncate">Optimized site</p>
                </div>
              </div>
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-success-50 dark:bg-success-900/20 flex-shrink-0">
                  <ChartBar className="w-5 h-5 text-success-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">More conversions</h4>
                  <p className="text-xs text-default-500 truncate">Effective sales</p>
                </div>
              </div>
            </div>

            {/* Columna 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-secondary-50 dark:bg-secondary-900/20 flex-shrink-0">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">Global range</h4>
                  <p className="text-xs text-default-500 truncate"> World Market</p>
                </div>
              </div>
              <div className="flex items-center gap-2 h-[72px]">
                <div className="p-2 rounded-full bg-purple-50 dark:bg-purple-900/20 flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm">Competitive advantage</h4>
                  <p className="text-xs text-default-500 truncate">Lead Your Industry</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <Button
              size="lg"
              color="primary"
              className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
              endContent={<ArrowRight className="w-6 h-6" />}
              onPress={() => onViewDetails(key)}
            >
             Optimize my website now
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-default-600">
               Get a personalized action plan
              </p>
              <p className="text-xs text-default-500">
               Don't wait any longer! Every day without optimizing is a lost opportunity
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
