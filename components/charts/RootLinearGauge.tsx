import { memo } from 'react';

interface RootLinearGaugeProps {
  value: number;
  topValue?: number;
  height?: number;
  className?: string;
}

interface GaugeLevel {
  label: string;
  color: string;
  range: [number, number];
}

const gaugeLevels: GaugeLevel[] = [
  { label: 'Poor', color: '#FF4D4D', range: [0, 20] },
  { label: 'Fair', color: '#FFA64D', range: [20, 40] },
  { label: 'Normal', color: '#FFD700', range: [40, 60] },
  { label: 'Good', color: '#90EE90', range: [60, 80] },
  { label: 'Excellent', color: '#4CAF50', range: [80, 100] },
];

export const RootLinearGauge = memo(function RootLinearGauge({
  value,
  topValue,
  height = 12,
  className = '',
}: RootLinearGaugeProps) {
  const currentLevel =
    gaugeLevels.find((level) => value >= level.range[0] && value <= level.range[1]) ||
    gaugeLevels[0];

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative w-full rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div className="absolute inset-0 flex">
          {gaugeLevels.map((level, index) => (
            <div
              key={index}
              style={{
                backgroundColor: level.color,
                width: `${level.range[1] - level.range[0]}%`,
              }}
              className="h-full first:rounded-l-full last:rounded-r-full"
            />
          ))}
        </div>

        {/* Top Sites Average Marker */}
        {topValue !== undefined && (
          <div
            className="absolute top-0 h-full transition-all duration-500 ease-out"
            style={{ left: `${topValue}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 h-6 w-2 bg-white/80 rounded shadow-md" />
          </div>
        )}

        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ left: `${value}%` }}
        >
          <div
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-[6px] border-l-transparent
                        border-r-[6px] border-r-transparent
                        border-t-[8px] border-white
                        filter drop-shadow-lg"
          />

          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-4 h-4 rounded-full bg-white border-2 border-gray-800
                        shadow-[0_0_8px_rgba(0,0,0,0.3)]
                        flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-4">
        {gaugeLevels.map((level, index) => (
          <div
            key={index}
            className={`text-xs font-medium ${
              level === currentLevel ? 'text-foreground' : 'text-default-500'
            }`}
          >
            {level.label}
          </div>
        ))}
      </div>
    </div>
  );
});
