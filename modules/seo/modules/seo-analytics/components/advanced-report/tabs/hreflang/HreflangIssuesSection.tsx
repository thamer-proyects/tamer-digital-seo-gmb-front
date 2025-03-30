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

interface HreflangIssue {
  url: string;
  type: 'error' | 'warning';
  issue: string;
  details: string;
}

const hreflangIssues: HreflangIssue[] = [
  {
    url: '/products/smartphone-x',
    type: 'error',
    issue: 'Language conflict',
    details: 'Multiple hreflangs pointing to the same language',
  },
  {
    url: '/blog/tech-news',
    type: 'error',
    issue: 'Non-reciprocal return',
    details: 'The English page does not link back to the Spanish one',
  },
  {
    url: '/services/consulting',
    type: 'warning',
    issue: 'Invalid language code',
    details: 'Using "en-uk" instead of "en-GB"',
  },
  {
    url: '/about/company',
    type: 'warning',
    issue: 'Missing x-default',
    details: 'No default version has been specified',
  },
];


const missingHreflangPages = [
  { url: '/blog/post-1', languages: ['fr', 'de'] },
  { url: '/products/item-2', languages: ['es', 'fr'] },
  { url: '/support/faq', languages: ['de', 'it'] },
  { url: '/contact', languages: ['fr', 'es', 'de'] },
];

export const HreflangIssuesSection = memo(function HreflangIssuesSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Issues Table */}
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Conflicts detected</h3>
          <Table
            aria-label="Problemas con hreflang"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>PROBLEM</TableColumn>
              <TableColumn>DETAILS</TableColumn>
            </TableHeader>
            <TableBody>
              {hreflangIssues.map((issue, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-sm text-default-600">{issue.url}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        color={issue.type === 'error' ? 'danger' : 'warning'}
                        variant="flat"
                      >
                        {issue.issue}
                      </Chip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500">{issue.details}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </RootCard>

      {/* Missing Hreflang Pages */}
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Pages their Hrefring</h3>
          <Table
            aria-label="Pigins their hreflang"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>Missing languages</TableColumn>
            </TableHeader>
            <TableBody>
              {missingHreflangPages.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-sm text-default-600">{page.url}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {page.languages.map((lang, i) => (
                        <Chip key={i} size="sm" variant="flat" className="capitalize">
                          {lang}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </RootCard>
    </div>
  );
});
