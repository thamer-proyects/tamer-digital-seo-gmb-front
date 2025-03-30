import React, { memo } from 'react';
import { HreflangOverviewSection } from './HreflangOverviewSection';
import { HreflangIssuesSection } from './HreflangIssuesSection';
import { BestPracticesSection } from './BestPracticesSection';

export const HreflangContent = memo(function HreflangContent() {
  return (
    <div className="p-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
          Hreflang Implementation Analysis
        </h1>
        <p className="text-default-600">
          Optimize the implementation of hreflang tags to improve international SEO and the
          experience of multilingual users.
        </p>
      </div>
  
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Overview Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">General Status</h2>
          </div>
          <HreflangOverviewSection />
        </section>
  
        {/* Issues Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Detected Issues</h2>
          </div>
          <HreflangIssuesSection />
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
