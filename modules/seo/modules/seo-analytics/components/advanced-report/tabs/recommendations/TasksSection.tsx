import React, { memo } from 'react';
import { CardBody, Checkbox } from '@heroui/react';
import { Code2, Link, Globe2, ExternalLink } from 'lucide-react';
import RootCard from '@/components/ui/root-card';

interface TaskGroup {
  category: string;
  icon: React.ElementType;
  tasks: {
    title: string;
    description: string;
    completed: boolean;
  }[];
}

const taskGroups: TaskGroup[] = [
  {
    category: 'Marcado y Estructura',
    icon: Code2,
    tasks: [
      {
        title: 'Implementar Schema.org en productos',
        description: 'Añadir marcado estructurado Product para todas las páginas de productos.',
        completed: false,
      },
      {
        title: 'Corregir errores de validación',
        description: 'Resolver problemas detectados en la validación de datos estructurados.',
        completed: true,
      },
    ],
  },
  {
    category: 'Enlaces Internos',
    icon: Link,
    tasks: [
      {
        title: 'Optimizar estructura de navegación',
        description: 'Reducir la profundidad de clic para páginas importantes.',
        completed: false,
      },
      {
        title: 'Corregir enlaces rotos',
        description: 'Actualizar o eliminar enlaces internos que devuelven error 404.',
        completed: true,
      },
    ],
  },
  {
    category: 'Internacionalización',
    icon: Globe2,
    tasks: [
      {
        title: 'Implementar hreflang correctamente',
        description: 'Asegurar reciprocidad en todas las versiones de idioma.',
        completed: false,
      },
      {
        title: 'Añadir x-default',
        description: 'Implementar la versión por defecto para usuarios sin coincidencia.',
        completed: false,
      },
    ],
  },
  {
    category: 'Backlinks',
    icon: ExternalLink,
    tasks: [
      {
        title: 'Generar archivo disavow',
        description: 'Crear y enviar archivo de desautorización para enlaces tóxicos.',
        completed: false,
      },
      {
        title: 'Contactar dominios de calidad',
        description: 'Iniciar outreach para obtener backlinks de sitios relevantes.',
        completed: false,
      },
    ],
  },
];

export const TasksSection = memo(function TasksSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {taskGroups.map((group, index) => {
        const Icon = group.icon;
        return (
          <RootCard key={index} className="h-full">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{group.category}</h3>
              </div>

              <div className="space-y-6">
                {group.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex gap-3">
                    <Checkbox
                      defaultSelected={task.completed}
                      color="primary"
                      classNames={{
                        label: 'text-sm',
                      }}
                    >
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-default-500">{task.description}</p>
                      </div>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </CardBody>
          </RootCard>
        );
      })}
    </div>
  );
});
