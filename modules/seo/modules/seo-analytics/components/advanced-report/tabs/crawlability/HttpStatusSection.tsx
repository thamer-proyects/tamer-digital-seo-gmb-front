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
  Chip,
} from '@heroui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import RootCard from '@/components/ui/root-card';

interface HttpStatusData {
  distribution: Array<{
    code: string;
    percentage: number;
  }>;
  errorPages: Array<{
    url: string;
    status: number;
    message: string;
  }>;
}

interface HttpStatusSectionProps {
  httpStatus: HttpStatusData;
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
      <p className="text-sm text-default-500">Porcentaje: {data.value}%</p>
    </div>
  );
};

export const HttpStatusSection = memo(function HttpStatusSection({
  httpStatus,
}: HttpStatusSectionProps) {
  const statusData = httpStatus.distribution.map((item) => ({
    name: getStatusName(item.code),
    value: item.percentage,
    color: getStatusColor(item.code),
  }));

  function getStatusName(code: string) {
    switch (code) {
      case '2xx':
        return '2xx Success';
      case '3xx':
        return '3xx Redirect';
      case '4xx':
        return '4xx Client Error';
      case '5xx':
        return '5xx Server Error';
      default:
        return code;
    }
  }

  function getStatusColor(code: string | number): string {
    if (typeof code === 'string') {
      switch (code) {
        case '2xx':
          return '#4CAF50';
        case '3xx':
          return '#FFA726';
        case '4xx':
          return '#EF5350';
        case '5xx':
          return '#E91E63';
        default:
          return '#999999';
      }
    }
    return getChipColor(code);
  }

  function getChipColor(
    code: number,
  ): 'primary' | 'default' | 'secondary' | 'success' | 'warning' | 'danger' {
    if (code >= 500) return 'danger';
    if (code >= 400) return 'warning';
    if (code >= 300) return 'secondary';
    return 'success';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución de Códigos HTTP</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {statusData.map((entry, index) => (
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

      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Páginas con Error</h3>
            <Table aria-label="Páginas con error">
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>MENSAJE</TableColumn>
              </TableHeader>
              <TableBody>
                {httpStatus.errorPages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{page.url}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getChipColor(page.status)} variant="flat">
                        {page.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">{page.message}</span>
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
