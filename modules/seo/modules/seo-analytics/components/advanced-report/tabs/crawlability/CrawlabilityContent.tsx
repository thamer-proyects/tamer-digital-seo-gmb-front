import React, { memo } from 'react';
import { CrawlBudgetSection } from './CrawlBudgetSection';
import { CrawlDepthSection } from './CrawlDepthSection';
import { HttpStatusSection } from './HttpStatusSection';
import { useAdvancedSeoReport } from '../../../../hooks/useAdvancedSeoReport';
import Loader from '@/components/ui/loader';

export const CrawlabilityContent = memo(function CrawlabilityContent() {
  const { data: seoReport, isLoading, error } = useAdvancedSeoReport();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !seoReport?.crawlabilityData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="error-message">Error al cargar los datos de rastreabilidad</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Análisis de Rastreabilidad
        </h1>
        <p className="text-default-600">
          Monitorea y optimiza cómo los motores de búsqueda rastrean tu sitio web para mejorar la
          indexación y visibilidad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Rastreo y Presupuesto</h2>
          </div>
          <CrawlBudgetSection crawlBudget={seoReport.crawlabilityData.crawlBudget} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Profundidad de Clics</h2>
          </div>
          <CrawlDepthSection clickDepth={seoReport.crawlabilityData.clickDepth} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Códigos de Estado HTTP</h2>
          </div>
          <HttpStatusSection httpStatus={seoReport.crawlabilityData.httpStatus} />
        </section>
      </div>
    </div>
  );
});
