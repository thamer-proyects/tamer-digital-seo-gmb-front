import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

const backlinkTypesData = [
  { label: 'Text Links', value: 65, color: '#4CAF50' },
  { label: 'Image Links', value: 20, color: '#2196F3' },
  { label: 'Redirects', value: 10, color: '#FFA726' },
  { label: 'Embedded Content', value: 5, color: '#9C27B0' },
];

const indicators = [
  { label: 'Text Links vs. Image Links', value: '3.25:1', trend: '+0.15', positive: true },
  { label: 'Multimedia Content', value: '5%', trend: '+1.2%', positive: true },
  { label: 'Redirects', value: '10%', trend: '-2.5%', positive: true },
];


export const BacklinksTypeSection = memo(function BacklinksTypeSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Types Distribution Chart */}
      <div className="lg:col-span-8">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Link type distribution</h3>
            <RootHorizontalBarChart
              data={backlinkTypesData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      {/* Type Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Metrics by type</h3>
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
