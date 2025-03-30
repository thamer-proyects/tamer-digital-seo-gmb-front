'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Link } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface InternalLinkStrength {
  name: string;
  value: number;
  color: string;
  links: number;
}

const linkStrengthData: InternalLinkStrength[] = [
  { name: 'Strong', value: 45, color: '#4CAF50', links: 1250 },
  { name: 'Medium', value: 35, color: '#FFA726', links: 980 },
  { name: 'Weak', value: 20, color: '#EF5350', links: 570 },
];

const indicators = [
  { label: 'Pages with Strong Links', value: '45%', trend: '+5.2%', positive: true },
  { label: 'Broken Internal Links', value: '23', trend: '-12.4%', positive: true },
  { label: 'Pages without Links', value: '8%', trend: '-3.1%', positive: true },
];

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
  }>;
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;

  return (
    <div className="flex justify-center gap-4 mt-2">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-default-600">
            {entry.value} ({linkStrengthData[index].value}%)
          </span>
        </div>
      ))}
    </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: InternalLinkStrength;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
        <span className="font-medium">{data.name} Links</span>
      </div>
      <div className="space-y-0.5 text-sm text-default-500">
        <p>Total Links: {data.links.toLocaleString()}</p>
        <p>Percentage: {data.value}%</p>
      </div>
    </div>
  );
};

export const InternalLinkingCard = memo(function InternalLinkingCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector(
      '[role="tab"][data-key="internal-linking"]',
    ) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <RootCard className="w-full h-full">
      <CardBody className="p-6 flex flex-col">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Internal Linking</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Internal Linking
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Donut Chart */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h4 className="text-base font-semibold mb-2">Fortaleza de Enlaces</h4>
            <p className="text-sm text-default-500 mb-4">Distribución por nivel de impacto</p>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={linkStrengthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {linkStrengthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} verticalAlign="bottom" height={24} />
                </PieChart>
              </ResponsiveContainer>
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
