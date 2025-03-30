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
  relevance: 'Alta' | 'Media' | 'Baja';
}

const referringDomains: ReferringDomain[] = [
  { domain: 'example.com', authority: 85, backlinks: 156, relevance: 'Alta' },
  { domain: 'blog.site.com', authority: 78, backlinks: 89, relevance: 'Alta' },
  { domain: 'news.portal.com', authority: 72, backlinks: 67, relevance: 'Media' },
  { domain: 'tech.blog.com', authority: 68, backlinks: 45, relevance: 'Alta' },
  { domain: 'review.site.com', authority: 65, backlinks: 34, relevance: 'Media' },
  { domain: 'forum.example.com', authority: 62, backlinks: 28, relevance: 'Baja' },
  { domain: 'directory.com', authority: 58, backlinks: 23, relevance: 'Baja' },
  { domain: 'social.network.com', authority: 55, backlinks: 19, relevance: 'Media' },
  { domain: 'industry.news.com', authority: 52, backlinks: 15, relevance: 'Alta' },
  { domain: 'blog.platform.com', authority: 48, backlinks: 12, relevance: 'Media' },
];

const indicators = [
  { label: 'Dominios únicos', value: '3,245', trend: '+12.5%', positive: true },
  { label: 'Dominios spam', value: '2.3%', trend: '-0.8%', positive: true },
  { label: 'Relevancia promedio', value: '78%', trend: '+4.2%', positive: true },
];

const getRelevanceColor = (relevance: ReferringDomain['relevance']) => {
  switch (relevance) {
    case 'Alta':
      return 'success';
    case 'Media':
      return 'warning';
    case 'Baja':
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
            <h3 className="text-lg font-medium mb-4">Top 10 Dominios de Referencia</h3>
            <Table
              aria-label="Dominios de referencia"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>DOMINIO</TableColumn>
                <TableColumn>AUTORIDAD</TableColumn>
                <TableColumn>BACKLINKS</TableColumn>
                <TableColumn>RELEVANCIA</TableColumn>
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
            <h3 className="text-lg font-medium mb-4">Métricas de Dominios</h3>
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
