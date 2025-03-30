'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Zap } from 'lucide-react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

interface AmpIndicator {
  label: string;
  value: string;
  color: string;
}

const ampCompatibilityData = [
  { label: 'Páginas con AMP', value: 65, color: '#4CAF50' },
  { label: 'Páginas sin AMP', value: 35, color: '#EF5350' },
];

const indicators: AmpIndicator[] = [
  {
    label: 'Enlaces AMP válidos',
    value: '92%',
    color: 'text-success-500',
  },
  {
    label: 'Errores AMP detectados',
    value: '15',
    color: 'text-warning-500',
  },
];

export const TechnicalSeoCard = memo(function TechnicalSeoCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector('[role="tab"][data-key="amp"]') as HTMLElement;
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
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">AMP Links</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a AMP Links
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
            <h4 className="text-base font-semibold mb-4">Distribución de Páginas AMP</h4>
            <RootHorizontalBarChart
              data={ampCompatibilityData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
