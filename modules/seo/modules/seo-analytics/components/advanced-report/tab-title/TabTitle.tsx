import { memo } from 'react';

interface TabTitleProps {
  item: { icon: React.ElementType; title: string };
}

export const TabTitle = memo(function TabTitle({ item: { icon: Icon, title } }: TabTitleProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5" />
      <span>{title}</span>
    </div>
  );
});
