'use client';
import React, { memo } from 'react';
import { CardBody, Progress } from '@heroui/react';
import RootCard from '@/components/ui/root-card';
import { RootHorizontalBarChart } from '@/components/charts/RootHorizontalBarChart';

// Define the WastedBudgetItem interface to match the API response
interface WastedBudgetItem {
  name: string;
  percentage: number;
  levels?: {
    level25: boolean;
    level50: boolean;
    level75: boolean;
    level100: boolean;
  };
}

interface CrawlProgress {
  progress: number;
  crawled: number;
  blocked: number;
}

interface CrawlBudgetSectionProps {
  crawlBudget: {
    wastedBudget: WastedBudgetItem[];
    crawlProgress: CrawlProgress;
  };
}

export const CrawlBudgetSection = memo(function CrawlBudgetSection({
  crawlBudget,
}: CrawlBudgetSectionProps) {
  const wastedBudgetData = crawlBudget.wastedBudget.map((item) => ({
    label: item.name,
    value: item.percentage,
    color: '#FF6B6B',
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Distribución del Presupuesto Desperdiciado</h3>
            <RootHorizontalBarChart
              data={wastedBudgetData}
              height={180}
              valueFormatter={(value) => `${value}%`}
            />
          </CardBody>
        </RootCard>
      </div>

      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6 justify-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Páginas Rastreadas</h3>
                <p className="text-sm text-default-500 mb-4">Porcentaje de páginas accesibles</p>
                <Progress
                  size="lg"
                  radius="sm"
                  classNames={{
                    base: 'max-w-md',
                    track: 'drop-shadow-md border border-default',
                    indicator: 'bg-gradient-to-r from-primary-500 to-primary-400',
                    label: 'tracking-wider font-medium text-default-600',
                    value: 'text-primary-500 font-semibold',
                  }}
                  value={crawlBudget.crawlProgress.progress}
                  showValueLabel={true}
                  label="Progreso de rastreo"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-500">Páginas rastreadas</span>
                  <span className="text-sm font-semibold">
                    {crawlBudget.crawlProgress.crawled}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-default-500">Páginas bloqueadas</span>
                  <span className="text-sm font-semibold text-danger">
                    {crawlBudget.crawlProgress.blocked}%
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
