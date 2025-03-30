import React, { memo } from 'react';

type TabItem = {
  icon: React.ElementType;
  title: string;
};

interface TabTitleProps {
  item: Pick<TabItem, 'icon' | 'title'>;
}

export const TabTitle = memo(function TabTitle({ item: { icon: Icon, title } }: TabTitleProps) {
  return (
    <div className="flex items-center gap-2">
      {typeof Icon === 'string' ? (
        <span className="icon-class">{Icon}</span>
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <span>{title}</span>
    </div>
  );
});
