import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

const backlinksData = [
  { name: 'Total Backlinks', value: 12500, color: '#4CAF50' },
  { name: 'Dominios Únicos', value: 3200, color: '#2196F3' },
];

const followTypeData = [
  { label: 'Dofollow', value: 75, color: '#4CAF50' },
  { label: 'Nofollow', value: 25, color: '#FFA726' },
];

const geoDistributionData = [
  { label: 'Estados Unidos', value: 45, color: '#4CAF50' },
  { label: 'Reino Unido', value: 25, color: '#2196F3' },
  { label: 'España', value: 15, color: '#9C27B0' },
  { label: 'Otros', value: 15, color: '#FF9800' },
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
        <span className="font-medium">{data.name}</span>
      </div>
      <p className="text-sm text-default-500">Total: {data.value.toLocaleString()}</p>
    </div>
  );
};

export const BacklinksOverviewSection = memo(function BacklinksOverviewSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Total Backlinks Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Total de Backlinks y Dominios</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={backlinksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {backlinksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </RootCard>
      </div>

      {/* Follow Type Distribution */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución por Tipo de Follow</h3>
            <RootHorizontalBarChart
              data={followTypeData}
              height={140}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      {/* Geographic Distribution */}
      <div className="lg:col-span-12">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución Geográfica</h3>
            <RootHorizontalBarChart
              data={geoDistributionData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
