'use client';
import { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Activity } from 'lucide-react';
import { SiteHealthRing } from '../site-health';
import { TabSummaries } from '../tab-summaries';
import RootCard from '@/components/ui/root-card';
import { OverviewHeaderProps } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';

export const OverviewHeader = memo(function OverviewHeader({ siteHealth }: OverviewHeaderProps) {
  const handleTabChange = (key: string) => {
    const tabElement = document.querySelector(`[role="tab"][data-key="${key}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <SiteHealthRing siteHealth={siteHealth} />
        </div>

        <div className="lg:col-span-8">
          <RootCard className="h-full">
            <CardBody className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Estado General del Sitio</h2>
                  <p className="text-default-500">Auditoría SEO y Análisis de Rendimiento</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-default-600 leading-relaxed">
                  Este reporte presenta una visión integral del estado de tu sitio web, basado en
                  métricas SEO on-page y off-page. Cada sección destaca áreas clave que afectan tu
                  rendimiento en los motores de búsqueda.
                </p>
                <p className="text-sm text-default-500">
                  Explora cada sección para obtener recomendaciones detalladas y mejoras
                  específicas.
                </p>
              </div>
            </CardBody>
          </RootCard>
        </div>
      </div>

      <div>
        <TabSummaries onTabChange={handleTabChange} />
      </div>
    </div>
  );
});
