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
    category: 'Marked and structure',
    icon: Code2,
    tasks: [
      {
        title: 'Implement schema.org in products',
        description: 'Add structured product marked for all products pages.',
        completed: false,
      },
      {
        title: 'Correct validation errors',
        description: 'Solve problems detected in structured data validation.',
        completed: true,
      },
    ],
  },
  {
    category: 'Internal links',
    icon: Link,
    tasks: [
      {
        title: 'Optimize navigation structure',
        description: 'Reduce click depth for important pages.',
        completed: false,
      },
      {
        title: 'Correct broken links',
        description: 'Update or delete internal links that return error 404.',
        completed: true,
      },
    ],
  },
  {
    category: 'Internationalization',
    icon: Globe2,
    tasks: [
      {
        title: 'Implement Hreflang correctly',
        description: 'Ensure reciprocity in all language versions.',
        completed: false,
      },
      {
        title: 'Añadir x-default',
        description: 'Implement the default version for users without coincidence.',
        completed: false,
      },
    ],
  },
  {
    category: 'Backlinks',
    icon: ExternalLink,
    tasks: [
      {
        title: 'Generate Disavow file',
        description: 'Create and send disavow file for toxic links.',
        completed: false,
      },
      {
        title: 'Contact quality domains',
        description: 'Start outreach to obtain relevant sites backlinks.',
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
