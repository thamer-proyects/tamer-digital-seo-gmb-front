import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';
import RootCard from '@/components/ui/root-card';

const qualityData = [
  { label: 'Alta Calidad', value: 45, color: '#4CAF50' },
  { label: 'Media Calidad', value: 35, color: '#FFA726' },
  { label: 'Baja Calidad', value: 20, color: '#EF5350' },
];

const indicators = [
  { label: 'Backlinks de Alta Autoridad', value: '45%', trend: '+5.2%', positive: true },
  { label: 'Backlinks Tóxicos', value: '8%', trend: '-2.1%', positive: true },
  { label: 'Relevancia Temática', value: '78%', trend: '+3.4%', positive: true },
];

export const BacklinksQualitySection = memo(function BacklinksQualitySection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Quality Distribution Chart */}
      <div className="lg:col-span-8">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución por Calidad</h3>
            <RootHorizontalBarChart
              data={qualityData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      {/* Quality Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Indicadores de Calidad</h3>
            <div className="space-y-6">
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
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
