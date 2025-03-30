'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, Globe2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import RootCard from '@/components/ui/root-card';

interface OffPageIndicator {
  label: string;
  value: string;
  color: string;
}

const backlinksQualityData = [
  { name: 'Alta', value: 450, color: '#4CAF50' },
  { name: 'Media', value: 850, color: '#FFA726' },
  { name: 'Baja', value: 320, color: '#EF5350' },
];

const indicators: OffPageIndicator[] = [
  {
    label: 'Total de backlinks',
    value: '1,620',
    color: 'text-success-500',
  },
  {
    label: 'Backlinks tóxicos',
    value: '15%',
    color: 'text-warning-500',
  },
  {
    label: 'Mentions without links',
    value: '342',
    color: 'text-danger-500',
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
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
        <span className="font-medium">Calidad {data.name}</span>
      </div>
      <p className="text-sm text-default-500">Enlaces: {data.value.toLocaleString()}</p>
    </div>
  );
};

export const OffPageSeoCard = memo(function OffPageSeoCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector(
      '[role="tab"][data-key="off_page_seo"]',
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
            <Globe2 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-foreground">Off-Page SEO</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a Off-Page SEO
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
        <div className="space-y-4">
          <Divider className="mb-4" />
          <div>
            <h4 className="text-base font-semibold mb-2">Backlinks quality</h4>
            <p className="text-sm text-default-500 mb-4">Distribution by quality level</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={backlinksQualityData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {backlinksQualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <Divider className="my-4" />
            <div className="flex justify-center gap-6">
              {backlinksQualityData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-1"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-default-600">
                    Quality {entry.name} ({entry.value})
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
