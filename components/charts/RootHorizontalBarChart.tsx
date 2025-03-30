'use client';
import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Divider } from '@heroui/react';

interface ChartDataItem {
  label: string;
  value: number;
  color: string;
}

interface RootHorizontalBarChartProps {
  data: ChartDataItem[];
  title?: string;
  subtitle?: string;
  height?: number;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  valueFormatter?: (value: number) => string;
}

const CustomTooltip = memo(({ active, payload, valueFormatter }: CustomTooltipProps) => {
  if (active && payload?.length) {
    const value = payload[0].value;
    const formattedValue = valueFormatter ? valueFormatter(value) : `${value}`;

    return (
      <div className="bg-content1 p-3 rounded-lg shadow-lg border border-default-200">
        <p className="text-sm font-medium">{payload[0].payload.label}</p>
        <p className="text-sm text-default-500">{formattedValue}</p>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

export const RootHorizontalBarChart = memo(function RootHorizontalBarChart({
  data,
  title,
  subtitle,
  height = 180,
  showLegend = true,
  valueFormatter = (value) => `${value}%`,
  className = '',
}: RootHorizontalBarChartProps) {
  const chartData = data.map((item) => ({
    label: item.label,
    value: item.value,
    color: item.color,
  }));

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div>
          {title && <h4 className="text-lg font-semibold text-foreground mb-2">{title}</h4>}
          {subtitle && <p className="text-sm text-default-500">{subtitle}</p>}
        </div>
      )}

      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={valueFormatter}
              tick={{ fontSize: 12 }}
            />
            <YAxis dataKey="label" type="category" hide={true} />
            <Tooltip
              content={<CustomTooltip valueFormatter={valueFormatter} />}
              cursor={{ fill: 'transparent' }} // Hace transparente el fondo del hover
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {chartData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <>
          <Divider className="mb-4" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 pt-4 mt-4">
            {chartData.map((item) => (
              <div key={item.label} className="flex items-start gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-1"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-default-600">
                  {item.label} ({valueFormatter(item.value)})
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

RootHorizontalBarChart.displayName = 'RootHorizontalBarChart';
