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

interface NavigationDepthProps {
  navigationDepth: {
    depthDistribution: Array<{
      depth: string;
      percentage: number | null;
    }>;
    deepestPages: Array<{
      url: string;
      clicks: number | null;
    }>;
  };
}

const COLORS = ['#4CAF50', '#2196F3', '#FFA726', '#EF5350'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="font-medium">{payload[0].payload.depth}</span>
      </div>
      <p className="text-sm text-default-500">Páginas: {payload[0].payload.percentage}%</p>
    </div>
  );
};

export const ClickDepthSection = memo(function ClickDepthSection({
  navigationDepth,
}: NavigationDepthProps) {
  const depthData = navigationDepth.depthDistribution.map((item, index) => ({
    depth: item.depth,
    percentage: item.percentage || 0,
    color: COLORS[index],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                    dataKey="percentage"
                  >
                    {depthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {depthData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-default-600">
                    {entry.depth} ({entry.percentage}%)
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
            <h3 className="text-lg font-medium mb-4">Páginas más Profundas</h3>
            <Table aria-label="Páginas más profundas" classNames={{ wrapper: 'shadow-none' }}>
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>CLICS</TableColumn>
              </TableHeader>
              <TableBody>
                {navigationDepth.deepestPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{page.url}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-danger">{page.clicks || 0}</span>
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
