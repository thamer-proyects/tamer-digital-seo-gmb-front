import React, { memo } from 'react';
import { BacklinksOverviewSection } from './BacklinksOverviewSection';
import { BacklinksQualitySection } from './BacklinksQualitySection';
import { AnchorTextSection } from './AnchorTextSection';
import { ReferringDomainsSection } from './ReferringDomainsSection';
import { ToxicBacklinksSection } from './ToxicBacklinksSection';
import { BacklinksTypeSection } from './BacklinksTypeSection';
import { BacklinksTrafficSection } from './BacklinksTrafficSection';
import { BacklinksChangeSection } from './BacklinksChangeSection';

export const BacklinksContent = memo(function BacklinksContent() {
  return (
    <div className="p-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Análisis de Backlinks
        </h1>
        <p className="text-default-600">
          Analiza y optimiza el perfil de enlaces entrantes para mejorar la autoridad y el
          posicionamiento de tu sitio.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Overview Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Resumen General</h2>
          </div>
          <BacklinksOverviewSection />
        </section>

        {/* Quality Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Calidad de Backlinks</h2>
          </div>
          <BacklinksQualitySection />
        </section>

        {/* Anchor Text Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Distribución de Anchor Text</h2>
          </div>
          <AnchorTextSection />
        </section>

        {/* Referring Domains Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Dominios de Referencia</h2>
          </div>
          <ReferringDomainsSection />
        </section>

        {/* Toxic Backlinks Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Backlinks Tóxicos</h2>
          </div>
          <ToxicBacklinksSection />
        </section>

        {/* Backlinks Type Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Tipos de Backlinks</h2>
          </div>
          <BacklinksTypeSection />
        </section>

        {/* Traffic Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Tráfico por Backlinks</h2>
          </div>
          <BacklinksTrafficSection />
        </section>

        {/* Changes Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Enlaces Nuevos vs. Perdidos</h2>
          </div>
          <BacklinksChangeSection />
        </section>
      </div>
    </div>
  );
});
