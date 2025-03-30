import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Shield, Link2, Search, AlertTriangle } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const bestPractices = [
  {
    icon: Shield,
    title: 'Prevención de Contenido Duplicado',
    description:
      'Las etiquetas canónicas ayudan a evitar penalizaciones por contenido duplicado al indicar la versión preferida de una página.',
    tips: [
      'Implementa etiquetas canónicas en todas las páginas',
      'Asegúrate de que apunten a la URL correcta',
      'Mantén consistencia en la estructura de URLs',
    ],
  },
  {
    icon: Link2,
    title: 'Implementación Correcta',
    description:
      'Una implementación adecuada de las etiquetas canónicas es crucial para su efectividad.',
    tips: [
      'Usa URLs absolutas en las etiquetas canónicas',
      'Verifica que las URLs canónicas sean accesibles',
      'Evita cadenas de redirección en URLs canónicas',
    ],
  },
  {
    icon: Search,
    title: 'Optimización del Rastreo',
    description:
      'Las etiquetas canónicas ayudan a los motores de búsqueda a rastrear e indexar tu sitio de manera más eficiente.',
    tips: [
      'Consolida el valor SEO en la URL canónica',
      'Mejora la eficiencia del presupuesto de rastreo',
      'Facilita la indexación de contenido importante',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Errores Comunes a Evitar',
    description:
      'Conocer y evitar los errores comunes en la implementación de canonicalización es esencial.',
    tips: [
      'No uses múltiples etiquetas canónicas',
      'Evita canonicalizar a páginas de error',
      'No crees bucles de canonicalización',
    ],
  },
];

export const BestPracticesSection = memo(function BestPracticesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {bestPractices.map((practice, index) => {
        const Icon = practice.icon;
        return (
          <RootCard key={index} className="h-full">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{practice.title}</h3>
                  <p className="text-default-600 mb-4">{practice.description}</p>
                  <div className="space-y-2">
                    {practice.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-default-500">{tip}</span>
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
