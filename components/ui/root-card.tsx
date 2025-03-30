import { Card } from '@heroui/react';
import { ReactNode } from 'react';

interface RootCardContentProps {
  children: ReactNode;
  className?: string;
}

export default function RootCard({ children, className }: Readonly<RootCardContentProps>) {
  return (
    <Card
      className={`border border-gray-700 bg-background/60 dark:bg-default-100/50 ${className ?? ''}`}
      isBlurred
    >
      {children}
    </Card>
  );
}
