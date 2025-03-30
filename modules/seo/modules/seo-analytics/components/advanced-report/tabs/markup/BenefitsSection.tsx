import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Search, Star, TrendingUp, MousePointerClick } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const benefits = [
  {
    icon: Search,
    title: 'Rich Snippets',
    description:
      'Enhance visibility in search results with rich snippets that highlight key information.',
    examples: [
      'Star ratings for products',
      'Prices and availability',
      'Breadcrumbs in search results',
    ],
  },
  {
    icon: Star,
    title: 'Better CTR',
    description:
      'Increase click-through rate (CTR) by displaying more relevant and engaging information in search results.',
    examples: [
      'Higher visibility in the SERP',
      'More detailed information',
      'Stand out from the competition',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Ranking Improvement',
    description:
      'Boost ranking by helping search engines better understand your site’s content.',
    examples: ['Better content comprehension', 'More accurate indexing', 'Enhanced relevance'],
  },
  {
    icon: MousePointerClick,
    title: 'User Experience',
    description:
      'Provide a better user experience by displaying relevant information directly in search results.',
    examples: [
      'More accessible information',
      'More informed decisions',
      'Less friction in search',
    ],
  },
];

export const BenefitsSection = memo(function BenefitsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <RootCard key={index} className="h-full">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-default-600 mb-4">{benefit.description}</p>
                  <div className="space-y-2">
                    {benefit.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-default-500">{example}</span>
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
