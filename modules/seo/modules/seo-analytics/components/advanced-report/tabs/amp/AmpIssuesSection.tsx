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

interface AmpIssue {
  url: string;
  type: 'error' | 'warning';
  issue: string;
  details: string;
}

const ampIssues: AmpIssue[] = [
  {
    url: '/blog/latest-post',
    type: 'error',
    issue: 'Etiqueta no permitida',
    details: 'Uso de <script> personalizado no permitido',
  },
  {
    url: '/products/featured',
    type: 'error',
    issue: 'CSS invalido',
    details: '!important no está permitido en AMP',
  },
  {
    url: '/news/tech-update',
    type: 'warning',
    issue: 'Rendimiento',
    details: 'Tiempo de carga superior a 2 segundos',
  },
  {
    url: '/about/team',
    type: 'warning',
    issue: 'Imagen sin dimensiones',
    details: 'Falta width y height en imagen',
  },
];

const nonCompliantPages = [
  { url: '/blog/post-1', issues: ['CSS no válido', 'Scripts externos'] },
  { url: '/products/item-2', issues: ['Imágenes sin optimizar'] },
  { url: '/news/article-3', issues: ['Formulario no válido'] },
  { url: '/services/main', issues: ['Iframe no permitido', 'CSS excede límite'] },
];

export const AmpIssuesSection = memo(function AmpIssuesSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* AMP Issues Table */}
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Problemas Detectados</h3>
          <Table
            aria-label="Problemas con AMP"
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
              {ampIssues.map((issue, index) => (
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

      {/* Non-Compliant Pages */}
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Páginas No Conformes con AMP</h3>
          <Table
            aria-label="Páginas no conformes con AMP"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>PROBLEMAS</TableColumn>
            </TableHeader>
            <TableBody>
              {nonCompliantPages.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-sm text-default-600">{page.url}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {page.issues.map((issue, i) => (
                        <Chip key={i} size="sm" variant="flat" color="danger">
                          {issue}
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
