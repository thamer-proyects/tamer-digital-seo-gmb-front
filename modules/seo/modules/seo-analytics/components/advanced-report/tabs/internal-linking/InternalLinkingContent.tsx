import React, { memo } from 'react';
import { InternalLinksSection } from './InternalLinksSection';
import { ClickDepthSection } from './ClickDepthSection';
import { IssuesSection } from './IssuesSection';
import { useAdvancedSeoReport } from '../../../../hooks/useAdvancedSeoReport';
import Loader from '@/components/ui/loader';

interface IncomingLinkTier {
  tier: string;
  count: number;
}

interface ProblematicPage {
  url: string;
  type: string;
}

const transformIncomingLinks = (links: IncomingLinkTier[]) => {
  return links.map((link) => ({
    url: link.tier,
    count: link.count,
  }));
};

const transformProblematicPages = (pages: ProblematicPage[]) => {
  return pages.map((page) => ({
    url: page.url,
    issue: page.type,
  }));
};

export const InternalLinkingContent = memo(function InternalLinkingContent() {
  const { data: seoReport, isLoading, error } = useAdvancedSeoReport();

  if (isLoading) {
    return <Loader />;
  }

  if (error || !seoReport?.internalLinkingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="error-message">Error loading internal linking data</div>
      </div>
    );
  }

  const { internalLinkingData } = seoReport;

  return (
    <div className="p-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Análisis de Enlaces Internos
        </h1>
        <p className="text-default-600">
          Optimiza la estructura de enlaces internos de tu sitio para mejorar la navegación y
          distribución del valor SEO.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Enlaces y Distribución</h2>
          </div>
          <InternalLinksSection
            incomingLinks={transformIncomingLinks(internalLinkingData.incomingLinks)}
            linkDistribution={internalLinkingData.linkDistribution}
            problematicPages={transformProblematicPages(internalLinkingData.problematicPages)}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Profundidad de Navegación</h2>
          </div>
          <ClickDepthSection navigationDepth={internalLinkingData.navigationDepth} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Problemas Detectados</h2>
          </div>
          <IssuesSection detectedIssues={internalLinkingData.detectedIssues} />
        </section>
      </div>
    </div>
  );
});
