import React, { memo } from 'react';
import { CardBody, Progress } from '@heroui/react';
import { AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

interface PriorityIssue {
  title: string;
  description: string;
  impact: number;
  category: 'high' | 'medium' | 'low';
}

const priorityIssues: PriorityIssue[] = [
  {
    title: 'Canonicalization optimization',
    description:
      'Multiple pages with similar content lack appropriate canon labels.',
    impact: 85,
    category: 'high',
  },
  {
    title: 'Deep internal links',
    description: 'Some important pages require more than 4 clicks to be reached.',
    impact: 75,
    category: 'high',
  },
  {
    title: 'Hreflang implementation',
    description: 'Lack of reciprocity on Hreflang labels for international versions.',
    impact: 65,
    category: 'medium',
  },
  {
    title: 'Low quality backlinks',
    description: 'Presence of domain bonds with low authority.',
    impact: 60,
    category: 'medium',
  },
  {
    title: 'Structured marking',
    description: 'Lack of schema.org implementation on product pages.',
    impact: 45,
    category: 'low',
  },
];

const getIssueIcon = (category: PriorityIssue['category']) => {
  switch (category) {
    case 'high':
      return <AlertOctagon className="w-5 h-5 text-danger" />;
    case 'medium':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    case 'low':
      return <AlertCircle className="w-5 h-5 text-primary" />;
  }
};

const getProgressColor = (impact: number) => {
  if (impact >= 75) return 'danger';
  if (impact >= 50) return 'warning';
  return 'primary';
};

export const PrioritySection = memo(function PrioritySection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {priorityIssues.map((issue, index) => (
        <RootCard key={index}>
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              {getIssueIcon(issue.category)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold truncate">{issue.title}</h3>
                  <span className="text-sm font-medium text-default-500">
                    Impacto: {issue.impact}%
                  </span>
                </div>
                <p className="text-default-500 mb-4">{issue.description}</p>
                <Progress
                  value={issue.impact}
                  color={getProgressColor(issue.impact)}
                  size="sm"
                  radius="sm"
                  classNames={{
                    base: 'max-w-full',
                    track: 'drop-shadow-md border border-default',
                    indicator: 'bg-gradient-to-r',
                    label: 'tracking-wider font-medium text-default-600',
                    value: 'text-foreground font-semibold',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </RootCard>
      ))}
    </div>
  );
});
