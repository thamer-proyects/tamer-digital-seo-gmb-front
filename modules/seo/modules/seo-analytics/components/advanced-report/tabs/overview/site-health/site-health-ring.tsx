'use client';
import React, { memo } from 'react';
import { CardBody, Divider } from '@heroui/react';
import { Activity } from 'lucide-react';
import { SiteHealth } from '@/modules/seo/modules/seo-analytics/types/advancedReportTabs';
import RootCard from '@/components/ui/root-card';
import { RootLinearGauge } from '@/components/charts/RootLinearGauge';

interface SiteHealthRingProps {
  siteHealth: SiteHealth;
}

export const SiteHealthRing = memo(function SiteHealthRing({ siteHealth }: SiteHealthRingProps) {
  const { score, topSitesAverage } = siteHealth;

  return (
    <RootCard className="h-full">
      <CardBody className="flex flex-col justify-center items-center gap-6 p-8">
        <div className="flex items-center gap-2.5">
          <Activity className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">Site Health</h3>
        </div>

        <div className="w-full space-y-6">
          <div className="space-y-4">
            <RootLinearGauge value={score} topValue={topSitesAverage} height={12} />

            {/* Legend */}
            <div className="flex justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-gray-800" />
                </div>
                <span className="text-sm text-default-500">Your Score: {score}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-4 bg-white/80 rounded" />
                <span className="text-sm text-default-500">Top Sites: {topSitesAverage}%</span>
              </div>
            </div>
          </div>

          <Divider />
          {/* Additional Info */}
          <div>
            <p className="text-sm text-center text-default-600">
              {score >= topSitesAverage
                ? 'Your site is performing above average! Keep up the good work.'
                : `There's room for improvement. Top sites score ${topSitesAverage - score}% higher.`}
            </p>
          </div>
        </div>
      </CardBody>
    </RootCard>
  );
});
