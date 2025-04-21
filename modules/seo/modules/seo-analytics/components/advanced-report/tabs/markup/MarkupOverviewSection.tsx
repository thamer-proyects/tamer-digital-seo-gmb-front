import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

interface MarkupSummary {
  withMarkup: number;
  withoutMarkup: number;
}

interface MarkupType {
  type: string;
  percentage: number;
}

interface MarkupOverviewSectionProps {
  markupSummary: MarkupSummary;
  markupTypes: MarkupType[];
}

const COLORS = {
  withMarkup: '#4CAF50',
  withoutMarkup: '#EF5350',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="font-medium">{payload[0].payload.name}</span>
      </div>
      <p className="text-sm text-default-500">Pages: {payload[0].value}%</p>
    </div>
  );
};

export const MarkupOverviewSection = memo(function MarkupOverviewSection({
  markupSummary,
  markupTypes,
}: MarkupOverviewSectionProps) {
  const total = markupSummary.withMarkup + markupSummary.withoutMarkup;

  const distributionData = [
    {
      name: 'Marked',
      value: (markupSummary.withMarkup / total) * 100,
      color: COLORS.withMarkup,
    },
    {
      name: 'No marked',
      value: (markupSummary.withoutMarkup / total) * 100,
      color: COLORS.withoutMarkup,
    },
  ];

  const typesChartData = markupTypes.map((type) => ({
    label: type.type,
    value: type.percentage,
    color: '#4CAF50',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Marking distribution</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {distributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-default-600">
                    {entry.name} ({entry.value.toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </RootCard>
      </div>

      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Types of Marked</h3>
            <RootHorizontalBarChart
              data={typesChartData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
