import { memo } from 'react';
import { CanonicalTagsSection } from './CanonicalTagsSection';
import { DuplicateContentSection } from './DuplicateContentSection';
import { BestPracticesSection } from './BestPracticesSection';

export const CanonicalizationContent = memo(function CanonicalizationContent() {
  return (
    <div className="p-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Canonicalization Analysis
        </h1>
        <p className="text-default-600">
          Optimize the implementation of canonical tags to avoid duplicate content issues and
          improve SEO.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Canonical Tags Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Canonical Tags Status</h2>
          </div>
          <CanonicalTagsSection />
        </section>

        {/* Duplicate Content Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Duplicate Content</h2>
          </div>
          <DuplicateContentSection />
        </section>

        {/* Best Practices Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Best Practices</h2>
          </div>
          <BestPracticesSection />
        </section>
      </div>
    </div>
  );
});
