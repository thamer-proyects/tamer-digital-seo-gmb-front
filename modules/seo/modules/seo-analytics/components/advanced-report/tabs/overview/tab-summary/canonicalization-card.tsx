'use client';
import React, { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Copy } from 'lucide-react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

interface CanonicalizationIndicator {
  label: string;
  value: string;
  color: string;
}

const canonicalData = [
  { label: 'Sin etiquetas rel="canonical"', value: 35, color: '#EF5350' },
  { label: 'Con etiquetas self-canonical', value: 65, color: '#4CAF50' },
];

const indicators: CanonicalizationIndicator[] = [
  {
    label: 'Pages with rel = "canonical"',
    value: '85%',
    color: 'text-success-500',
  },
  {
    label: 'Duplicate labels',
    value: '4.5%',
    color: 'text-warning-500',
  },
  {
    label: 'Canonicity errors',
    value: '156',
    color: 'text-danger-500',
  },
];

export const CanonicalizationCard = memo(function CanonicalizationCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector(
      '[role="tab"][data-key="canonicalization"]',
    ) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <RootCard className="w-full h-full">
      <CardBody className="p-6">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Copy className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Canonicalization</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Canonicalization
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
        <div>
          <Divider className="mb-4" />
          <div>
            <h4 className="text-base font-semibold mb-4">Canonicalization distribution</h4>
            <RootHorizontalBarChart
              data={canonicalData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
