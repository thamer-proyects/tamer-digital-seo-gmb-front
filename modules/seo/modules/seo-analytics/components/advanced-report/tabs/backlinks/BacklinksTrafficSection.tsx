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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import RootCard from '@/components/ui/root-card';

const trafficData = [
  { date: '2024-01', visits: 1250 },
  { date: '2024-02', visits: 1480 },
  { date: '2024-03', visits: 1320 },
  { date: '2024-04', visits: 1650 },
  { date: '2024-05', visits: 1820 },
  { date: '2024-06', visits: 1580 },
];

const topTrafficBacklinks = [
  { domain: 'news.com', traffic: 450, conversion: 3.2 },
  { domain: 'blog.site.com', traffic: 380, conversion: 2.8 },
  { domain: 'review.portal.com', traffic: 320, conversion: 4.1 },
  { domain: 'forum.example.com', traffic: 280, conversion: 1.9 },
];

const indicators = [
  { label: 'Tráfico total', value: '9,850', trend: '+15.2%', positive: true },
  { label: 'Tasa de conversión', value: '2.8%', trend: '+0.5%', positive: true },
  { label: 'Tiempo en página', value: '2:45', trend: '+0:15', positive: true },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
      <p className="font-medium">{label}</p>
      <p className="text-sm text-default-500">Visitas: {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export const BacklinksTrafficSection = memo(function BacklinksTrafficSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Traffic Chart */}
      <div className="lg:col-span-8">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Evolución del Tráfico por Backlinks</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={{ fill: '#4CAF50' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </RootCard>
      </div>

      {/* Traffic Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Métricas de Tráfico</h3>
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

      {/* Top Traffic Sources */}
      <div className="lg:col-span-12">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Top Backlinks por Tráfico</h3>
            <Table
              aria-label="Backlinks por tráfico"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>DOMINIO</TableColumn>
                <TableColumn>TRÁFICO MENSUAL</TableColumn>
                <TableColumn>TASA DE CONVERSIÓN</TableColumn>
              </TableHeader>
              <TableBody>
                {topTrafficBacklinks.map((link, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{link.domain}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{link.traffic}</span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        color={link.conversion > 3 ? 'success' : 'warning'}
                        variant="flat"
                      >
                        {link.conversion}%
                      </Chip>
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
