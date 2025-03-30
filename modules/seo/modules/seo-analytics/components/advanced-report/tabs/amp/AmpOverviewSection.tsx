import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

const ampStatusData = [
  { label: 'Páginas con AMP', value: 65, color: '#4CAF50' },
  { label: 'Páginas sin AMP', value: 35, color: '#EF5350' },
];

const ampErrorsData = [
  { label: 'Errores de validación', value: 45, color: '#FF6B6B' },
  { label: 'Problemas de rendimiento', value: 35, color: '#4ECDC4' },
  { label: 'Errores de marcado', value: 20, color: '#45B7D1' },
];

export const AmpOverviewSection = memo(function AmpOverviewSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* AMP Status Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Estado de Implementación AMP</h3>
            <RootHorizontalBarChart
              data={ampStatusData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      {/* AMP Errors Chart */}
      <div className="lg:col-span-6">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución de Errores AMP</h3>
            <RootHorizontalBarChart
              data={ampErrorsData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
