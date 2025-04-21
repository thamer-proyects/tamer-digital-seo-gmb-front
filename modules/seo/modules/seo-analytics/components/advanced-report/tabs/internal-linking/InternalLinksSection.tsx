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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import RootCard from '@/components/ui/root-card';

interface InternalLinksSectionProps {
  incomingLinks: Array<{
    url: string;
    count: number;
  }>;
  linkDistribution: Array<{
    strength: string;
    percentage: number | null;
  }>;
  problematicPages: Array<{
    url: string;
    issue: string;
  }>;
}

const COLORS = {
  strong: '#4CAF50',
  medium: '#FFA726',
  weak: '#EF5350',
};

const CustomBarTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <p className="font-medium">{payload[0].payload.url}</p>
      <p className="text-sm text-default-500">Incoming links: {payload[0].value}</p>
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="font-medium">{payload[0].payload.strength}</span>
      </div>
      <p className="text-sm text-default-500">Percentage: {payload[0].payload.percentage}%</p>
    </div>
  );
};

export const InternalLinksSection = memo(function InternalLinksSection({
  incomingLinks,
  linkDistribution,
  problematicPages,
}: InternalLinksSectionProps) {
  const distributionData = linkDistribution.map((item) => ({
    strength:
      item.strength === 'strong'
        ? 'Enlaces fuertes'
        : item.strength === 'medium'
          ? 'Enlaces medios'
          : 'Enlaces débiles',
    percentage: item.percentage || 0,
    color: COLORS[item.strength as keyof typeof COLORS],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Internal internal links</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomingLinks} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="url"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </RootCard>
      </div>

      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Link distribution</h3>
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
                    dataKey="percentage"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {distributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-default-600">
                    {entry.strength} ({entry.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </RootCard>
      </div>

      <div className="lg:col-span-12">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Problematic pages</h3>
            <Table aria-label="Páginas problemáticas" classNames={{ wrapper: 'shadow-none' }}>
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>PROBLEM</TableColumn>
              </TableHeader>
              <TableBody>
                {problematicPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{page.url}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-danger">{page.issue}</span>
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
