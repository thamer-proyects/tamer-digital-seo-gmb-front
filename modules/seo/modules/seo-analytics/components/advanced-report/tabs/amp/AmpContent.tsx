import React, { memo } from 'react';
import { AmpOverviewSection } from './AmpOverviewSection';
import { AmpIssuesSection } from './AmpIssuesSection';
import { BestPracticesSection } from './BestPracticesSection';

export const AmpContent = memo(function AmpContent() {
  return (
    <div className="p-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Análisis de Implementación AMP
        </h1>
        <p className="text-default-600">
          Optimiza la implementación de páginas AMP para mejorar la experiencia móvil y el
          rendimiento en búsquedas.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Overview Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Estado General</h2>
          </div>
          <AmpOverviewSection />
        </section>

        {/* Issues Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Problemas Detectados</h2>
          </div>
          <AmpIssuesSection />
        </section>

        {/* Best Practices Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Mejores Prácticas</h2>
          </div>
          <BestPracticesSection />
        </section>
      </div>
    </div>
  );
});
