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
    issue: 'Conflicto de idioma',
    details: 'Múltiples hreflangs apuntando al mismo idioma',
  },
  {
    url: '/blog/tech-news',
    type: 'error',
    issue: 'Retorno no recíproco',
    details: 'La página en inglés no enlaza de vuelta a la española',
  },
  {
    url: '/services/consulting',
    type: 'warning',
    issue: 'Código de idioma inválido',
    details: 'Uso de "en-uk" en lugar de "en-GB"',
  },
  {
    url: '/about/company',
    type: 'warning',
    issue: 'Falta x-default',
    details: 'No se ha especificado una versión por defecto',
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
          <h3 className="text-lg font-medium mb-4">Conflictos Detectados</h3>
          <Table
            aria-label="Problemas con hreflang"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>PROBLEMA</TableColumn>
              <TableColumn>DETALLES</TableColumn>
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
          <h3 className="text-lg font-medium mb-4">Páginas sin Hreflang</h3>
          <Table
            aria-label="Páginas sin hreflang"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>IDIOMAS FALTANTES</TableColumn>
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
