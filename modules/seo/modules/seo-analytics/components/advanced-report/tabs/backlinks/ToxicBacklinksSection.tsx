import React, { memo } from 'react';
import {
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
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
import { FileDown } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

interface ToxicBacklink {
  domain: string;
  url: string;
  toxicityScore: number;
  reason: string;
}

const toxicBacklinksData = [
  { date: '2024-01', toxic: 45 },
  { date: '2024-02', toxic: 38 },
  { date: '2024-03', toxic: 52 },
  { date: '2024-04', toxic: 42 },
  { date: '2024-05', toxic: 35 },
  { date: '2024-06', toxic: 48 },
];

const toxicBacklinks: ToxicBacklink[] = [
  { domain: 'spam-site.com', url: '/link1', toxicityScore: 85, reason: 'Spam content' },
  { domain: 'link-farm.net', url: '/page2', toxicityScore: 78, reason: 'Link farm' },
  { domain: 'bad-seo.com', url: '/post3', toxicityScore: 92, reason: 'Manipulative linking' },
  { domain: 'pbn-network.org', url: '/article4', toxicityScore: 88, reason: 'PBN detected' },
];

const indicators = [
  { label: 'Total backlinks tóxicos', value: '156' },
  { label: 'Impacto en ranking', value: 'Moderado' },
  { label: 'Tendencia', value: '-12.5%', positive: true },
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
      <p className="text-sm text-default-500">Enlaces tóxicos: {payload[0].value}</p>
    </div>
  );
};

export const ToxicBacklinksSection = memo(function ToxicBacklinksSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Toxic Backlinks Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RootCard>
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Evolución de Backlinks Tóxicos</h3>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<FileDown className="w-4 h-4" />}
                >
                  Generar archivo disavow
                </Button>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={toxicBacklinksData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="toxic"
                      stroke="#EF5350"
                      strokeWidth={2}
                      dot={{ fill: '#EF5350' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </RootCard>
        </div>

        {/* Indicators */}
        <div className="lg:col-span-4">
          <RootCard className="h-full">
            <CardBody className="p-6">
              <h3 className="text-lg font-medium mb-6">Métricas de Toxicidad</h3>
              <div className="space-y-6">
                {indicators.map((indicator, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-default-500">{indicator.label}</span>
                    {'positive' in indicator ? (
                      <span
                        className={`text-base font-medium ${
                          indicator.positive ? 'text-success-600' : 'text-danger-600'
                        }`}
                      >
                        {indicator.value}
                      </span>
                    ) : (
                      <span className="text-base font-semibold">{indicator.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </RootCard>
        </div>
      </div>

      {/* Toxic Backlinks Table */}
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Enlaces Tóxicos Detectados</h3>
          <Table
            aria-label="Enlaces tóxicos"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>DOMINIO</TableColumn>
              <TableColumn>URL</TableColumn>
              <TableColumn>TOXICIDAD</TableColumn>
              <TableColumn>RAZÓN</TableColumn>
            </TableHeader>
            <TableBody>
              {toxicBacklinks.map((link, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-sm text-default-600">{link.domain}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500">{link.url}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={link.toxicityScore > 80 ? 'danger' : 'warning'}
                      variant="flat"
                    >
                      {link.toxicityScore}%
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-danger">{link.reason}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </RootCard>
    </div>
  );
});
