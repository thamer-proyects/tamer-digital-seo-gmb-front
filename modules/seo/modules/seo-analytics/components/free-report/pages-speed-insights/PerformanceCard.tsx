import { Smartphone, Monitor } from 'lucide-react';
import { CardBody, CardHeader, Divider } from '@heroui/react';
import { ScoreCard } from './ScoreCard';
import { MetricRow } from './MetricRow';
import { IssuesList } from './IssuesList';
import { Issue, Metric } from '../../../types/analysisResponse';
import RootCard from '@/components/ui/root-card';

interface PerformanceCardProps {
  type: 'mobile' | 'desktop';
  score: number;
  category: string;
  metrics: Metric[] | undefined;
  issues: Issue[] | undefined;
  audits: Record<string, any> | undefined;
}

export function PerformanceCard({
  type,
  score,
  metrics,
  issues,
  category,
  audits,
}: Readonly<PerformanceCardProps>) {
  const performanceMetricsData = [
    {
      label: 'First Contentful Paint',
      value: metrics?.find((metric) => metric.name === 'First Contentful Paint')?.value ?? '-',
    },
    { label: 'Speed Index', value: audits?.['speed-index']?.displayValue ?? '-' },
    { label: 'Time To Interactive', value: audits?.['interactive']?.displayValue ?? '-' },
    {
      label: 'First Meaningful Paint',
      value: audits?.['first-meaningful-paint']?.displayValue ?? '-',
    },
    { label: 'First CPU Idle', value: audits?.['first-cpu-idle']?.displayValue ?? '-' },
    {
      label: 'Estimated Input Latency',
      value: audits?.['estimated-input-latency']?.displayValue ?? '-',
    },
  ];

  const getStatusByScore = (score: number) => {
    return score >= 70 ? 'success' : 'warning';
  };

  return (
    <RootCard className="w-full">
      <CardHeader className="flex items-center justify-center gap-2 py-6 ">
        {type === 'mobile' ? (
          <Smartphone className="w-5 h-5 text-blue-400" />
        ) : (
          <Monitor className="w-5 h-5 text-blue-400" />
        )}
        <h2 className="text-xl text-gray-800 dark:text-gray-100">
          {type === 'mobile' ? 'Mobile' : 'Desktop'} {category}
        </h2>
      </CardHeader>

      <CardBody className="px-6 pb-6">
        <div className="flex flex-col items-center mb-8">
          <ScoreCard score={score} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            {type === 'mobile'
              ? 'Simulated mobile network and CPU throttling'
              : 'Standard desktop conditions'}
          </p>
        </div>

        {metrics && (
          <div className="space-y-2 text-sm">
            {category === 'performance'
              ? performanceMetricsData.map((metric) => (
                  <MetricRow
                    key={`${metric.label}.${metric.value}`}
                    label={metric.label}
                    value={metric.value}
                    status={getStatusByScore(score)}
                  />
                ))
              : metrics.map((metric) => (
                  <MetricRow
                    key={`${metric.name}.${metric.value}`}
                    label={metric.name}
                    value={metric.value}
                    status={getStatusByScore(metric.score)}
                  />
                ))}
          </div>
        )}

        <Divider className="my-4" />
        <IssuesList issues={issues} />
      </CardBody>
    </RootCard>
  );
}
