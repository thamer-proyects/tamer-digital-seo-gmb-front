'use client';
import React, { memo } from 'react';
import {
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface ClickDepthData {
  distribution: Array<{
    depth: string;
    percentage: number;
  }>;
  deepestPages: Array<{
    url: string;
    clicks: number;
  }>;
}

interface CrawlDepthSectionProps {
  clickDepth: ClickDepthData;
}

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
      <p className="text-sm text-default-500">Páginas: {data.value}%</p>
    </div>
  );
};

export const CrawlDepthSection = memo(function CrawlDepthSection({
  clickDepth,
}: CrawlDepthSectionProps) {
  const depthData = clickDepth.distribution.map((item) => ({
    name: item.depth,
    value: item.percentage,
    color: getDepthColor(item.depth),
  }));

  function getDepthColor(depth: string) {
    switch (depth) {
      case '1 clic':
        return '#4CAF50';
      case '2 clics':
        return '#2196F3';
      case '3 clics':
        return '#FFA726';
      default:
        return '#EF5350';
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Donut Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución de Profundidad</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={depthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {depthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {depthData.map((entry, index) => (
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

      {/* Deep Pages Table */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Páginas más Profundas</h3>
            <Table aria-label="Páginas más profundas">
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>CLICS</TableColumn>
              </TableHeader>
              <TableBody>
                {clickDepth.deepestPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{page.url}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-danger">{page.clicks}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
