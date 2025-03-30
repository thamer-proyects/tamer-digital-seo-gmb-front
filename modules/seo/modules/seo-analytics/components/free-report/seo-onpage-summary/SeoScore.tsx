import { Activity } from 'lucide-react';
import CircleProgress from '@/components/ui/circle-progress';
import RootCard from '@/components/ui/root-card';

interface SeoScoreProps {
  score: number;
  pagesAnalyzed: number;
  issuesFound: number;
}

export function SeoScore({ score, pagesAnalyzed, issuesFound }: Readonly<SeoScoreProps>) {
  return (
    <RootCard className="p-8">
      <div className="flex gap-2 items-center justify-center pb-3">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">SEO Score</h3>
        <Activity size={20} />
      </div>

      <div className="flex flex-col items-center mb-3">
        <CircleProgress percentage={score} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">Pages Analyzed</span>
          <span className="text-gray-600 dark:text-gray-200">{pagesAnalyzed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Issues Found</span>
          <span className={`text-${issuesFound > 0 ? 'red' : 'green'}-400`}>{issuesFound}</span>
        </div>
      </div>
    </RootCard>
  );
}
