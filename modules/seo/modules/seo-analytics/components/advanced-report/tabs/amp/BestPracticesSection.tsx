import React, { memo } from 'react';
import { CardBody } from '@heroui/react';
import { Zap, Gauge, Code2, AlertTriangle } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

const bestPractices = [
  {
    icon: Zap,
    title: 'Optimización de Rendimiento',
    description:
      'Las páginas AMP están diseñadas para cargar instantáneamente y ofrecer una experiencia rápida.',
    tips: [
      'Optimiza las imágenes para AMP',
      'Minimiza el uso de CSS personalizado',
      'Utiliza componentes AMP predefinidos',
    ],
  },
  {
    icon: Gauge,
    title: 'Validación AMP',
    description: 'Asegura que tus páginas AMP cumplan con todas las especificaciones requeridas.',
    tips: [
      'Usa el validador AMP oficial',
      'Corrige errores de validación',
      'Mantén actualizada la biblioteca AMP',
    ],
  },
  {
    icon: Code2,
    title: 'Implementación Correcta',
    description: 'Sigue las mejores prácticas para una implementación efectiva de AMP.',
    tips: [
      'Implementa el marcado correcto',
      'Enlaza las versiones AMP y no-AMP',
      'Configura el seguimiento analytics',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Errores Comunes',
    description: 'Evita estos errores frecuentes en la implementación de AMP.',
    tips: [
      'No uses JavaScript personalizado',
      'Evita CSS no permitido',
      'No omitas atributos requeridos',
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
