import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Globe2, Link2, AlertTriangle, Languages } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const bestPractices = [
  {
    icon: Globe2,
    title: 'Correct Implementation',
    description:
      'Hreflang tags are essential for multilingual websites and those targeting different regions.',
    tips: [
      'Use ISO 639-1 language codes',
      'Include country codes when necessary',
      'Implement reciprocal links between all versions',
    ],
  },
  {
    icon: Link2,
    title: 'Reciprocal Links',
    description: 'All alternative pages must link to each other, including to themselves.',
    tips: [
      'Ensure all URLs link to each other',
      'Include self-referencing hreflang',
      'Verify link reciprocity',
    ],
  },
  {
    icon: Languages,
    title: 'Using x-default',
    description:
      'The x-default tag indicates the default version when there is no language match.',
    tips: [
      'Implement x-default for the main page',
      'Use x-default for language selection pages',
      'Maintain consistency in implementation',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Common Errors',
    description: 'Avoid these common errors in hreflang implementation.',
    tips: [
      'Don\'t use incorrect language codes',
      'Avoid redirect chains',
      'Don\'t forget reciprocal links',
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
