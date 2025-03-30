import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface AnchorTextData {
  name: string;
  value: number;
  color: string;
}

const anchorTextData: AnchorTextData[] = [
  { name: 'Palabra clave exacta', value: 25, color: '#4CAF50' },
  { name: 'Marca', value: 35, color: '#2196F3' },
  { name: 'Texto genérico', value: 30, color: '#FFA726' },
  { name: 'URL sin texto', value: 10, color: '#EF5350' },
];

const indicators = [
  { label: 'Texto ancla relevante', value: '60%', trend: '+3.2%', positive: true },
  { label: 'Texto genérico', value: '30%', trend: '-1.5%', positive: true },
  { label: 'Diversidad de anchor text', value: '85%', trend: '+2.8%', positive: true },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: AnchorTextData;
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
      <p className="text-sm text-default-500">Porcentaje: {data.value}%</p>
    </div>
  );
};

export const AnchorTextSection = memo(function AnchorTextSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Donut Chart */}
      <div className="lg:col-span-8">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución de Anchor Text</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={anchorTextData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {anchorTextData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {anchorTextData.map((entry, index) => (
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

      {/* Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Métricas de Anchor Text</h3>
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
