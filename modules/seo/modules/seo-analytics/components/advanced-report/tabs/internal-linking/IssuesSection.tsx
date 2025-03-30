import React, { memo } from 'react';
import {
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
} from '@heroui/react';
import RootCard from '@/components/ui/root-card';

interface DetectedIssues {
  criticalErrors: Array<{
    url: string;
    description: string;
  }>;
  warnings: Array<{
    url: string;
    description: string;
  }>;
  notices: Array<{
    url: string;
    description: string;
  }>;
}

interface IssuesSectionProps {
  detectedIssues: DetectedIssues;
}

const getChipColor = (category: string) => {
  switch (category) {
    case 'Critical errors':
      return 'danger';
    case 'Warnings':
      return 'warning';
    case 'Notices':
      return 'primary';
    default:
      return 'default';
  }
};

export const IssuesSection = memo(function IssuesSection({ detectedIssues }: IssuesSectionProps) {
  const issueGroups = [
    {
      category: 'Critical errors',
      issues: detectedIssues.criticalErrors,
      type: 'error',
    },
    {
      category: 'Warnings',
      issues: detectedIssues.warnings,
      type: 'warning',
    },
    {
      category: 'Notices',
      issues: detectedIssues.notices,
      type: 'info',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {issueGroups.map(({ category, issues, type }) => (
        <RootCard key={category} className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">{category}</h3>
            <Table aria-label={`Tabla de ${category}`} classNames={{ wrapper: 'shadow-none' }}>
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
              </TableHeader>
              <TableBody>
                {issues.map((issue, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{issue.url}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getChipColor(category)} variant="flat">
                        {type === 'error' ? 'Error' : type === 'warning' ? 'Warnings' : 'Notices'}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">{issue.description}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </RootCard>
      ))}
    </div>
  );
});
