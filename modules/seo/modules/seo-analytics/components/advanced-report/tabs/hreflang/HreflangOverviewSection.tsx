import React, { memo } from 'react';
import { CardBody, Progress } from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface HreflangData {
  name: string;
  value: number;
  color: string;
}

const hreflangStatusData: HreflangData[] = [
  { name: 'Correct Implementation', value: 75, color: '#4CAF50' },
  { name: 'Conflicts Detected', value: 15, color: '#FFA726' },
  { name: 'Not Implemented', value: 10, color: '#EF5350' },
];

const languageMetrics = [
  { language: 'Spanish (es)', pages: 85, coverage: 95 },
  { language: 'English (en)', pages: 82, coverage: 92 },
  { language: 'French (fr)', pages: 78, coverage: 88 },
  { language: 'German (de)', pages: 75, coverage: 85 },
];


interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: HreflangData;
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
      <p className="text-sm text-default-500">Pages: {data.value}%</p>
    </div>
  );
};

export const HreflangOverviewSection = memo(function HreflangOverviewSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Status Distribution Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Implementation status</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hreflangStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {hreflangStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {hreflangStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-default-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </RootCard>
      </div>

      {/* Language Coverage */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Language coverage</h3>
            <div className="space-y-6">
              {languageMetrics.map((lang, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-default-600">{lang.language}</span>
                    <span className="text-sm font-medium">{lang.coverage}%</span>
                  </div>
                  <Progress
                    value={lang.coverage}
                    size="sm"
                    radius="sm"
                    classNames={{
                      base: 'w-full',
                      indicator: 'bg-primary',
                    }}
                  />
                  <p className="text-xs text-default-500">{lang.pages} implemented pages</p>
                </div>
              ))}
            </div>
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
