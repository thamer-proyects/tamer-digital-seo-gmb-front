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

interface StructuredDataElement {
  type: string;
  valid: number;
  invalid: number;
  total: number;
}

export interface MarkupError {
  url: string;
  type: string;
  errors: Array<{
    severity: string;
    description: string;
  }>;
}

interface StructuredDataSectionProps {
  structuredData: {
    elements: StructuredDataElement[];
  };
  markupErrors: MarkupError[];
}

export const StructuredDataSection = memo(function StructuredDataSection({
  structuredData,
  markupErrors,
}: StructuredDataSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Implemented elements</h3>
          <Table
            aria-label="Elementos de datos estructurados"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>VALID</TableColumn>
              <TableColumn>INVALID</TableColumn>
              <TableColumn>TOTAL</TableColumn>
            </TableHeader>
            <TableBody>
              {structuredData.elements.map((element, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-sm font-medium">{element.type}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-success">{element.valid}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-danger">{element.invalid}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{element.total}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </RootCard>

      <RootCard>
        <CardBody className="p-6">
          <h3 className="text-lg font-medium mb-4">Errores de Marcado</h3>
          <Table
            aria-label="Errores de marcado"
            classNames={{
              wrapper: 'shadow-none',
            }}
          >
            <TableHeader>
              <TableColumn>URL</TableColumn>
              <TableColumn>ERROR</TableColumn>
            </TableHeader>
            <TableBody>
              {markupErrors.flatMap((error, index) =>
                error.errors.map((err, errIndex) => (
                  <TableRow key={`${index}-${errIndex}`}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-default-600">{error.url}</span>
                        <span className="text-xs text-default-400">{error.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          color={err.severity === 'error' ? 'danger' : 'warning'}
                          variant="flat"
                        >
                          {err.severity === 'error' ? 'Error' : 'Warning'}
                        </Chip>
                        <span className="text-sm text-default-500">{err.description}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </CardBody>
      </RootCard>
    </div>
  );
});
