import React, { memo } from 'react';
import {
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RootCard from '@/components/ui/root-card';

const changesData = [
  { date: '2024-01', gained: 85, lost: 45 },
  { date: '2024-02', gained: 92, lost: 38 },
  { date: '2024-03', gained: 78, lost: 52 },
  { date: '2024-04', gained: 95, lost: 42 },
  { date: '2024-05', gained: 88, lost: 35 },
  { date: '2024-06', gained: 105, lost: 48 },
];

const recentChanges = [
  { domain: 'news.com', type: 'gained', date: '2024-06-15', authority: 75 },
  { domain: 'blog.example.com', type: 'lost', date: '2024-06-14', authority: 68 },
  { domain: 'tech.site.com', type: 'gained', date: '2024-06-13', authority: 82 },
  { domain: 'review.portal.com', type: 'lost', date: '2024-06-12', authority: 71 },
];

const indicators = [
  { label: 'Enlaces nuevos (mes)', value: '105', trend: '+8.2%', positive: true },
  { label: 'Enlaces perdidos (mes)', value: '48', trend: '-12.5%', positive: true },
  { label: 'Ratio ganados/perdidos', value: '2.18', trend: '+0.15', positive: true },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <p className="font-medium">{label}</p>
      <div className="space-y-1">
        <p className="text-sm text-success-600">Ganados: {payload[0].value}</p>
        <p className="text-sm text-danger-600">Perdidos: {payload[1].value}</p>
      </div>
    </div>
  );
};

export const BacklinksChangeSection = memo(function BacklinksChangeSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Changes Chart */}
      <div className="lg:col-span-8">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Enlaces Ganados vs. Perdidos</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={changesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="gained" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="lost" fill="#EF5350" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </RootCard>
      </div>

      {/* Change Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Métricas de Cambios</h3>
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

      {/* Recent Changes Table */}
      <div className="lg:col-span-12">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Cambios Recientes</h3>
            <Table
              aria-label="Cambios recientes en backlinks"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>DOMINIO</TableColumn>
                <TableColumn>TIPO</TableColumn>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>AUTORIDAD</TableColumn>
              </TableHeader>
              <TableBody>
                {recentChanges.map((change, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{change.domain}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={change.type === 'gained' ? 'success' : 'danger'}
                        variant="flat"
                      >
                        {change.type === 'gained' ? 'Ganado' : 'Perdido'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">{change.date}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{change.authority}</span>
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
