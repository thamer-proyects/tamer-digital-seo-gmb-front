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
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

interface CanonicalData {
  name: string;
  value: number;
  color: string;
}

const canonicalDistributionData = [
  { label: 'Sin etiquetas rel="canonical"', value: 35, color: '#EF5350' },
  { label: 'Con etiquetas self-canonical', value: 45, color: '#4CAF50' },
  { label: 'Canonical a otra página', value: 20, color: '#2196F3' },
];

const canonicalStatusData: CanonicalData[] = [
  { name: 'Implementación correcta', value: 75, color: '#4CAF50' },
  { name: 'Etiquetas duplicadas', value: 15, color: '#FFA726' },
  { name: 'Etiquetas faltantes', value: 10, color: '#EF5350' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: CanonicalData;
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

const pagesWithIssues = [
  { url: '/products/item-1', issue: 'Etiquetas canónicas duplicadas' },
  { url: '/blog/post-1', issue: 'Falta etiqueta canónica' },
  { url: '/services/web-design', issue: 'Canonical inválido' },
  { url: '/about/team', issue: 'Etiquetas canónicas duplicadas' },
];

export const CanonicalTagsSection = memo(function CanonicalTagsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución de Etiquetas Canónicas</h3>
            <RootHorizontalBarChart
              data={canonicalDistributionData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      {/* Status Distribution Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Estado de Implementación</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={canonicalStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {canonicalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {canonicalStatusData.map((entry, index) => (
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

      {/* Issues Table */}
      <div className="lg:col-span-12">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Páginas con Problemas</h3>
            <Table
              aria-label="Páginas con problemas de canonicalización"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>PROBLEMA</TableColumn>
              </TableHeader>
              <TableBody>
                {pagesWithIssues.map((page, index) => (
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
