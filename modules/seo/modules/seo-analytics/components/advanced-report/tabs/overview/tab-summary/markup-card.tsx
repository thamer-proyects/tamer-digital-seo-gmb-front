'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Code2 } from 'lucide-react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

const markupData = [
  { label: 'Schema.org', value: 85, color: '#4CAF50' },
  { label: 'Open Graph', value: 72, color: '#2196F3' },
  { label: 'Twitter Cards', value: 65, color: '#9C27B0' },
  { label: 'Dublin Core', value: 45, color: '#FF9800' },
];

const indicators = [
  { label: 'Páginas con marcado válido', value: '92%', trend: '+3.5%', positive: true },
  { label: 'Tipos implementados', value: '4/6', trend: '+1', positive: true },
  { label: 'Errores detectados', value: '15', trend: '-40%', positive: true },
];

export const MarkupCard = memo(function MarkupCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector('[role="tab"][data-key="markup"]') as HTMLElement;
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
            <Code2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Markup</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Markup
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Bar Chart Section */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex-1">
              <RootHorizontalBarChart
                data={markupData}
                title="Implementación de Marcado"
                subtitle="Porcentaje de implementación por tipo"
                height={140}
                valueFormatter={(value) => `${value}%`}
                showLegend={false}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
              {markupData.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-default-600">
                    {item.label} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block lg:col-span-1 flex justify-center">
            <Divider orientation="vertical" className="h-full mx-auto" />
          </div>

          {/* Indicators */}
          <div className="lg:col-span-6 flex items-center">
            <div className="space-y-4 w-full">
              {indicators.map((indicator, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-default-500">{indicator.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">{indicator.value}</span>
                    <span
                      className={`text-sm font-medium ${
                        indicator.positive ? 'text-success-600' : 'text-danger-600'
                      }`}
                    >
                      {indicator.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
