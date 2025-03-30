import React, { memo } from 'react';
import {
  CardBody,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@heroui/react';
import RootCard from '@/components/ui/root-card';

const duplicateGroups = [
  {
    canonical: '/products/smartphone-x',
    duplicates: [
      '/products/smartphone-x?color=black',
      '/products/smartphone-x?size=large',
      '/products/smartphone-x?ref=home',
    ],
  },
  {
    canonical: '/blog/seo-guide',
    duplicates: [
      '/blog/seo-guide?utm_source=newsletter',
      '/blog/seo-guide?lang=es',
      '/blog/seo-guide/print',
    ],
  },
];

export const DuplicateContentSection = memo(function DuplicateContentSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {duplicateGroups.map((group, index) => (
        <RootCard key={index}>
          <CardBody className="p-6">
            {/* ... (contenido previo igual) */}
            <Table
              aria-label="URLs duplicadas"
              classNames={{
                wrapper: 'shadow-none',
              }}
            >
              <TableHeader>
                <TableColumn>URL</TableColumn>
                <TableColumn>TYPE</TableColumn>
              </TableHeader>
              <TableBody>
                <>
                  <TableRow>
                    <TableCell>
                      <span className="text-sm font-medium text-success">{group.canonical}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-success">Canonical URL</span>
                    </TableCell>
                  </TableRow>
                  {group.duplicates.map((url) => (
                    <TableRow key={url}>
                      <TableCell>
                        <span className="text-sm text-default-600">{url}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-warning">Duplicate</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              </TableBody>
            </Table>
          </CardBody>
        </RootCard>
      ))}
    </div>
  );
});
