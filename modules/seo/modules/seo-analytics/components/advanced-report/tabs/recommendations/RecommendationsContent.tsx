import React, { memo } from 'react';
import { PrioritySection } from './PrioritySection';
import { TasksSection } from './TasksSection';
import { QuickLinksSection } from './QuickLinksSection';

export const RecommendationsContent = memo(function RecommendationsContent() {
  return (
    <div className="p-6 space-y-12">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
        Final recommendations
        </h1>
        <p className="text-default-600">
         Detailed Action Plan based on the complete SEO analysis to improve performance
          and visibility of your site.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-12">
        {/* Priority Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold"> Priorities</h2>
          </div>
          <PrioritySection />
        </section>

        {/* Tasks Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Plan of action</h2>
          </div>
          <TasksSection />
        </section>

        {/* Quick Links Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-semibold">Fast links</h2>
          </div>
          <QuickLinksSection />
        </section>
      </div>
    </div>
  );
});
