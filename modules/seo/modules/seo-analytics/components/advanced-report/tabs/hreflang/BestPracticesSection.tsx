import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Globe2, Link2, AlertTriangle, Languages } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const bestPractices = [
  {
    icon: Globe2,
    title: 'Implementación Correcta',
    description:
      'Las etiquetas hreflang son esenciales para sitios multilingües y orientados a diferentes regiones.',
    tips: [
      'Usa códigos de idioma ISO 639-1',
      'Incluye códigos de país cuando sea necesario',
      'Implementa enlaces recíprocos entre todas las versiones',
    ],
  },
  {
    icon: Link2,
    title: 'Enlaces Recíprocos',
    description: 'Todas las páginas alternativas deben enlazarse entre sí, incluyendo a sí mismas.',
    tips: [
      'Asegura que todas las URLs se enlacen mutuamente',
      'Incluye self-referencing hreflang',
      'Verifica la reciprocidad de los enlaces',
    ],
  },
  {
    icon: Languages,
    title: 'Uso de x-default',
    description:
      'La etiqueta x-default indica la versión por defecto cuando no hay coincidencia de idioma.',
    tips: [
      'Implementa x-default para la página principal',
      'Usa x-default para páginas de selección de idioma',
      'Mantén consistencia en su implementación',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Errores Comunes',
    description: 'Evita estos errores comunes en la implementación de hreflang.',
    tips: [
      'No uses códigos de idioma incorrectos',
      'Evita cadenas de redirección',
      'No olvides los enlaces recíprocos',
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
