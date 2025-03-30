'use client';
import { memo } from 'react';
import { CardBody, Button, Divider } from '@heroui/react';
import { ChevronRight, FileWarning } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface HttpStatusData {
  name: string;
  value: number;
  color: string;
  requests: number;
}

const httpStatusData: HttpStatusData[] = [
  { name: '2xx Success', value: 85, color: '#4CAF50', requests: 2450 },
  { name: '3xx Redirect', value: 10, color: '#FFA726', requests: 285 },
  { name: '4xx Client Error', value: 4, color: '#EF5350', requests: 115 },
  { name: '5xx Server Error', value: 1, color: '#E91E63', requests: 28 },
];

const indicators = [
  { label: 'Páginas con 2xx', value: '85%', trend: '+2.5%', positive: true },
  { label: 'Errores (4xx/5xx)', value: '5%', trend: '-1.2%', positive: true },
  { label: 'Redirecciones 3xx', value: '285', trend: '-15.3%', positive: true },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: HttpStatusData;
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
      <div className="space-y-0.5 text-sm text-default-500">
        <p>Requests: {data.requests.toLocaleString()}</p>
        <p>Percentage: {data.value}%</p>
      </div>
    </div>
  );
};

export const HttpStatusCard = memo(function HttpStatusCard() {
  const handleViewDetails = () => {
    const tabElement = document.querySelector(
      '[role="tab"][data-key="http_status_codes"]',
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
            <FileWarning className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">HTTP Status Codes</h3>
          </div>
          <Button
            size="sm"
            variant="light"
            color="primary"
            endContent={<ChevronRight className="w-4 h-4" />}
            onPress={handleViewDetails}
            className="min-w-[120px]"
          >
            Ir a HTTP Status
          </Button>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Chart Section with Legend */}
          <div className="lg:col-span-8 grid grid-cols-12 gap-4">
            {/* Donut Chart */}
            <div className="col-span-7 flex flex-col justify-center">
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={httpStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {httpStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Legend */}
            <div className="col-span-5 flex flex-col justify-center">
              <div className="space-y-3">
                {httpStatusData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-default-600 truncate">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block lg:col-span-1 flex justify-center">
            <Divider orientation="vertical" className="h-full mx-auto" />
          </div>

          {/* Indicators */}
          <div className="lg:col-span-3 flex items-center">
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
