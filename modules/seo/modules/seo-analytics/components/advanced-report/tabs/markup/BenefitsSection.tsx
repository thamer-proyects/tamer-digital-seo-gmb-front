import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Search, Star, TrendingUp, MousePointerClick } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const benefits = [
  {
    icon: Search,
    title: 'Rich Snippets',
    description:
      'Mejora la visibilidad en los resultados de búsqueda con fragmentos enriquecidos que destacan información clave.',
    examples: [
      'Estrellas de valoración para productos',
      'Precios y disponibilidad',
      'Breadcrumbs en los resultados',
    ],
  },
  {
    icon: Star,
    title: 'Mejor CTR',
    description:
      'Aumenta la tasa de clics (CTR) al mostrar información más relevante y atractiva en los resultados de búsqueda.',
    examples: [
      'Mayor visibilidad en la SERP',
      'Información más detallada',
      'Destaca entre la competencia',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Posicionamiento',
    description:
      'Mejora el posicionamiento al ayudar a los motores de búsqueda a entender mejor el contenido de tu sitio.',
    examples: ['Mejor comprensión del contenido', 'Indexación más precisa', 'Relevancia mejorada'],
  },
  {
    icon: MousePointerClick,
    title: 'Experiencia de Usuario',
    description:
      'Proporciona una mejor experiencia al usuario al mostrar información relevante directamente en los resultados.',
    examples: [
      'Información más accesible',
      'Decisiones más informadas',
      'Menor fricción en la búsqueda',
    ],
  },
];

export const BenefitsSection = memo(function BenefitsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <RootCard key={index} className="h-full">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-default-600 mb-4">{benefit.description}</p>
                  <div className="space-y-2">
                    {benefit.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-default-500">{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </RootCard>
        );
      })}
    </div>
  );
});
