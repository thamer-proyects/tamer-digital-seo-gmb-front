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

interface ReferringDomain {
  domain: string;
  authority: number;
  backlinks: number;
  relevance: 'High' | 'Medium' | 'Low';
}

const referringDomains: ReferringDomain[] = [
  { domain: 'example.com', authority: 85, backlinks: 156, relevance: 'High' },
  { domain: 'blog.site.com', authority: 78, backlinks: 89, relevance: 'High' },
  { domain: 'news.portal.com', authority: 72, backlinks: 67, relevance: 'Medium' },
  { domain: 'tech.blog.com', authority: 68, backlinks: 45, relevance: 'High' },
  { domain: 'review.site.com', authority: 65, backlinks: 34, relevance: 'Medium' },
  { domain: 'forum.example.com', authority: 62, backlinks: 28, relevance: 'Low' },
  { domain: 'directory.com', authority: 58, backlinks: 23, relevance: 'Low' },
  { domain: 'social.network.com', authority: 55, backlinks: 19, relevance: 'Medium' },
  { domain: 'industry.news.com', authority: 52, backlinks: 15, relevance: 'High' },
  { domain: 'blog.platform.com', authority: 48, backlinks: 12, relevance: 'Medium' },
];

const indicators = [
  { label: 'Unique domains', value: '3,245', trend: '+12.5%', positive: true },
  { label: 'Spam domains', value: '2.3%', trend: '-0.8%', positive: true },
  { label: 'Average relevance', value: '78%', trend: '+4.2%', positive: true },
];

const getRelevanceColor = (relevance: ReferringDomain['relevance']) => {
  switch (relevance) {
    case 'High':
      return 'success';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'danger';
    default:
      return 'default';
  }
};

export const ReferringDomainsSection = memo(function ReferringDomainsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Domains Table */}
      <div className="lg:col-span-8">
        <RootCard>
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Top 10 Referring Domains</h3>
            <Table
              aria-label="Referring Domains"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>DOMAIN</TableColumn>
                <TableColumn>AUTHORITY</TableColumn>
                <TableColumn>BACKLINKS</TableColumn>
                <TableColumn>RELEVANCE</TableColumn>
              </TableHeader>

              <TableBody>
                {referringDomains.map((domain, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className="text-sm text-default-600">{domain.domain}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{domain.authority}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{domain.backlinks}</span>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getRelevanceColor(domain.relevance)} variant="flat">
                        {domain.relevance}
                      </Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </RootCard>
      </div>

      {/* Indicators */}
      <div className="lg:col-span-4">
        <RootCard className="h-full">
          <CardBody className="p-6">
            <h3 className="text-lg font-medium mb-4">Domain metrics</h3>
            <div className="space-y-6">
              {indicators.map((indicator, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-default-500">{indicator.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">{indicator.value}</span>
                    <span
                      className={`text-sm font-medium ${
                        indicator.positive ? 'text-success-600' : 'text-danger-600'
                      }`}
                    >
                      {indicator.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </RootCard>
      </div>
    </div>
  );
});
