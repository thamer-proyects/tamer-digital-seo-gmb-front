'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Sliders } from 'lucide-react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

interface CrawlabilityIndicator {
  label: string;
  value: string | number;
  color: string;
}

const wastedBudgetData = [
  { label: 'Duplicate pages', value: 35, color: '#FF6B6B' },
  { label: 'Blocked resources', value: 25, color: '#4ECDC4' },
  { label: 'Non canonical urls', value: 20, color: '#45B7D1' },
  { label: 'Redirections', value: 15, color: '#96CEB4' },
];

const indicators: CrawlabilityIndicator[] = [
  {
    label: 'Tracked pages',
    value: '92%',
    color: 'text-success-500',
  },
  {
    label: 'Blocked pages',
    value: '5%',
    color: 'text-warning-500',
  },
  {
    label: 'Critical errors',
    value: 23,
    color: 'text-danger-500',
  },
];

export const CrawlabilityCard = memo(function CrawlabilityCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector(
      '[role="tab"][data-key="crawlability"]',
    ) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <RootCard className="w-full h-full">
      <CardBody className="p-6 flex flex-col">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Crawlability</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Crawlability
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4 mb-8">
          {indicators.map((indicator, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-default-500">{indicator.label}</span>
              <span className={`text-base font-semibold ${indicator.color}`}>
                {indicator.value}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <Divider className="mb-4" />
        <div className="flex-1 flex flex-col justify-center">
          <RootHorizontalBarChart
            data={wastedBudgetData}
            title="Tracking budget"
            subtitle="Dispressed budget distribution"
            height={180}
            valueFormatter={(value) => `${value}%`}
          />
        </div>
      </CardBody>
    </RootCard>
  );
});
