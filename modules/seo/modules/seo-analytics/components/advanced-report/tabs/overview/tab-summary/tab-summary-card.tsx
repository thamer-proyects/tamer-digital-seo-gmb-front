'use client';
import { memo } from 'react';
import { CardBody, Button } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import { TabSummary } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';
import RootCard from '@/components/ui/root-card';

interface TabSummaryCardProps {
  summary: TabSummary;
  onViewDetails: (key: string) => void;
}

export const TabSummaryCard = memo(function TabSummaryCard({
  summary: { key, title, icon: Icon, indicators },
  onViewDetails,
}: TabSummaryCardProps) {
  return (
    <RootCard className="w-full">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={() => onViewDetails(key)}
            className="min-w-[120px]"
          >
        See details
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex flex-col items-start">
              <span className="text-sm text-default-500 mb-1">{indicator.label}</span>
              <span className="text-2xl font-semibold mb-1">{indicator.value}</span>
              {indicator.change !== undefined && (
                <span
                  className={`text-sm font-medium ${
                    indicator.change >= 0 ? 'text-success-600' : 'text-danger-600'
                  }`}
                >
                  {indicator.change >= 0 ? '+' : ''}
                  {indicator.change}%
                </span>
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </RootCard>
  );
});
