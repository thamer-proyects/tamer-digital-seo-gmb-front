import { AlertTriangle } from 'lucide-react';
import { Issue } from '../../../types/analysisResponse';

interface IssuesListProps {
  readonly issues: readonly Issue[] | undefined;
}

export function IssuesList({ issues }: IssuesListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-sm text-gray-700 dark:text-gray-300 mb-3">Top Issues</h3>
      <ul className="space-y-2 text-sm">
        {issues?.map((issue) => (
          <li
            key={issue.title}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-300"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span>{issue.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
