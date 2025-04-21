'use client';
import React, { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Globe2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface HreflangIndicator {
  label: string;
  value: string;
  color: string;
}

const hreflangData = [
  { name: 'Pages with valid hreflang', value: 75, color: '#4CAF50' },
  { name: 'Páginas sin hreflang', value: 25, color: '#EF5350' },
];

const indicators: HreflangIndicator[] = [
  {
    label: 'Pages with valid hreflang',
    value: '75%',
    color: 'text-success-500',
  },
  {
    label: 'Conflicts detected',
    value: '23',
    color: 'text-warning-500',
  },
  {
    label: 'Pages their hrefring',
    value: '25%',
    color: 'text-danger-500',
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      color: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-medium">{data.name}</span>
      </div>
      <p className="text-sm text-default-500">Percentage: {data.value}%</p>
    </div>
  );
};

export const HreflangCard = memo(function HreflangCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector('[role="tab"][data-key="hreflang"]') as HTMLElement;
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
            <Globe2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Hreflang</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Hreflang
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
          <div className="">
            <h4 className="text-base font-semibold mb-4">
             Hreflang implementation distribution
            </h4>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hreflangData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {hreflangData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <Divider className="my-4" />

            {/* Legend */}
            <div className="flex justify-center gap-6">
              {hreflangData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-1"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-default-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
