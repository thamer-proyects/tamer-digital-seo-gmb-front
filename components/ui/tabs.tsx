'use client';

import { Tabs as NextUITabs, Tab } from '@heroui/react';

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  tabListClassName?: string;
  tabContentClassName?: string;
};

const Tabs: React.FC<TabsProps> = ({ tabs, tabListClassName, tabContentClassName }) => {
  return (
    <div className="w-full mx-auto">
      <NextUITabs
        aria-label="Dynamic tabs"
        className={`flex flex-col items-center ${tabListClassName}`}
        color="primary"
        variant="bordered"
        classNames={{
          tabList: 'bg- p-2 rounded-full gap-2',
          cursor: 'bg-gray-200 dark:bg-gray-700 rounded-full',
          tab: 'text-sm font-medium text-gray-400 data-[selected=true]:text-white',
          tabContent:
            'group-data-[selected=true]:text-black dark:group-data-[selected=true]:text-white',
          panel: `p-4 mt-4 rounded-lg shadow-md ${tabContentClassName}`,
        }}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} title={tab.label}>
            {tab.content}
          </Tab>
        ))}
      </NextUITabs>
    </div>
  );
};

export default Tabs;
