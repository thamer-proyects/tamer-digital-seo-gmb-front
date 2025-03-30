'use client';
import React, { memo } from 'react';
import { CardBody, Button } from '@heroui/react';
import { ChevronRight, Sliders, Link, Code2, Copy, Globe2, Zap, ExternalLink } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

interface QuickLink {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  issues: number;
}

const quickLinks: QuickLink[] = [
  {
    key: 'crawlability',
    title: 'Crawlability',
    description: 'Optimización del rastreo y presupuesto',
    icon: Sliders,
    issues: 3,
  },
  {
    key: 'internal-linking',
    title: 'Enlaces Internos',
    description: 'Estructura y distribución de enlaces',
    icon: Link,
    issues: 2,
  },
  {
    key: 'markup',
    title: 'Marcado',
    description: 'Implementación de datos estructurados',
    icon: Code2,
    issues: 4,
  },
  {
    key: 'canonicalization',
    title: 'Canonicalización',
    description: 'Gestión de contenido duplicado',
    icon: Copy,
    issues: 5,
  },
  {
    key: 'hreflang',
    title: 'Hreflang',
    description: 'SEO internacional y multilingüe',
    icon: Globe2,
    issues: 3,
  },
  {
    key: 'amp',
    title: 'AMP',
    description: 'Páginas móviles aceleradas',
    icon: Zap,
    issues: 2,
  },
  {
    key: 'backlinks',
    title: 'Backlinks',
    description: 'Perfil de enlaces entrantes',
    icon: ExternalLink,
    issues: 4,
  },
];

export const QuickLinksSection = memo(function QuickLinksSection() {
  const handleNavigate = (key: string) => {
    const tabElement = document.querySelector(`[role="tab"][data-key="${key}"]`) as HTMLElement;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {quickLinks.map((link) => {
        const Icon = link.icon;
        return (
          <RootCard key={link.key} className="h-full">
            <CardBody className="p-6">
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{link.title}</h3>
                    <p className="text-sm text-default-500">{link.description}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-danger">
                    {link.issues} {link.issues === 1 ? 'problema' : 'problemas'}
                  </span>
                  <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    endContent={<ChevronRight className="w-4 h-4" />}
                    onPress={() => handleNavigate(link.key)}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardBody>
          </RootCard>
        );
      })}
    </div>
  );
});
