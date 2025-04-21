import React, { memo } from 'react';
import { MarkupOverviewSection } from './MarkupOverviewSection';
import { StructuredDataSection, MarkupError } from './StructuredDataSection';
import { BenefitsSection } from './BenefitsSection';
import { useAdvancedSeoReport } from '../../../../hooks/useAdvancedSeoReport';
import Loader from '@/components/ui/loader';

type SeoReportData = {
  data: {
    markupData: {
      markupSummary: {
        withMarkup: number;
        withoutMarkup: number;
      };
      markupTypes: Array<{
        type: string;
        percentage: number;
      }>;
      structuredData: {
        elements: Array<{
          type: string;
          valid: number;
          invalid: number;
          total: number;
        }>;
      };
      markupErrors: MarkupError[];
    };
  };
  isLoading: boolean;
  error: any;
};

export const MarkupContent = memo(function MarkupContent() {
  const { data: seoReport, isLoading, error } = useAdvancedSeoReport() as SeoReportData;

  if (isLoading) {
    return <Loader />;
  }

  if (error || !seoReport?.markupData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="error-message">Error loading markup data</div>
      </div>
    );
  }

  const { markupData } = seoReport;

  return (
    <div className="p-6 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Structured marking analysis
        </h1>
        <p className="text-default-600">
        Optimizes the implementation of structured data to improve visibility in
          Search results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Marking summary</h2>
          </div>
          <MarkupOverviewSection
            markupSummary={markupData.markupSummary}
            markupTypes={markupData.markupTypes}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Structured data</h2>
          </div>
          <StructuredDataSection
            structuredData={markupData.structuredData}
            markupErrors={markupData.markupErrors}
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Benefits and impact</h2>
          </div>
          <BenefitsSection />
        </section>
      </div>
    </div>
  );
});
