import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Shield, Link2, Search, AlertTriangle } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const bestPractices = [
  {
    icon: Shield,
    title: 'Duplicate Content Prevention',
    description:
      'Canonical tags help prevent penalties for duplicate content by indicating the preferred version of a page.',
    tips: [
      'Implement canonical tags on all pages',
      'Ensure they point to the correct URL',
      'Maintain consistency in URL structure',
    ],
  },
  {
    icon: Link2,
    title: 'Correct Implementation',
    description: 'Proper implementation of canonical tags is crucial for their effectiveness.',
    tips: [
      'Use absolute URLs in canonical tags',
      'Verify that canonical URLs are accessible',
      'Avoid redirect chains in canonical URLs',
    ],
  },
  {
    icon: Search,
    title: 'Crawl Optimization',
    description: 'Canonical tags help search engines crawl and index your site more efficiently.',
    tips: [
      'Consolidate SEO value on the canonical URL',
      'Improve crawl budget efficiency',
      'Facilitate indexing of important content',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Common Errors to Avoid',
    description:
      'Knowing and avoiding common errors in canonicalization implementation is essential.',
    tips: [
      'Do not use multiple canonical labels',
      'Avoid canonicalize error pages',
      'Do not create canonicalization loops',
    ],
  },
];

export const BestPracticesSection = memo(function BestPracticesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {bestPractices.map((practice, index) => {
        const Icon = practice.icon;
        return (
          <RootCard key={index} className="h-full">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                  <p className="text-default-600 mb-4">{practice.description}</p>
                  <div className="space-y-2">
                    {practice.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-default-500">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </RootCard>
        );
      })}
    </div>
  );
});
