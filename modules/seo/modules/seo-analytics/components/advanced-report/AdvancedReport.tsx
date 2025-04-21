'use client';
import { memo } from 'react';
import { TabTitle } from './TabTitle';
import { tabsData } from '../../constants/advancedReport';
import { Button, Card, CardBody, Tab, Tabs } from '@heroui/react';
import { AdvancedReportTabContent } from './tab-content/AdvancedReportTabContent';

export const AdvancedReport = memo(function AdvancedReport() {
  return (
    <div className="mx-auto h-screen min-h-screen overflow-auto">
      <Card>
        <CardBody className="p-6">
          <h1 className="text-2xl font-bold mb-6">SEO Advanced Report Dashboard</h1>
          <Tabs
            aria-label="SEO Advanced Report Options"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: 'gap-6',
              cursor: 'w-full bg-primary',
              tab: 'max-w-fit px-0 h-12',
              tabContent: 'group-data-[selected=true]:text-primary',
            }}
          >
            {tabsData.map((tab) => (
              <Tab key={tab.key} title={<TabTitle item={tab} />}>
                <AdvancedReportTabContent item={tab} />
              </Tab>
            ))}
          </Tabs>
          
        <Button
          className="fixed bottom-4 right-4 flex items-center gap-2 z-50"
          color="primary"
        
        >
          Download PDF
        </Button>
        </CardBody>
      </Card>
    </div>
  );
});
