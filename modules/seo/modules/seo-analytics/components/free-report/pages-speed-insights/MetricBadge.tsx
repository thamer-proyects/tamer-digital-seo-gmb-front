import { Button } from '@heroui/react';
import { Monitor, Smartphone } from 'lucide-react';

interface MetricBadgeProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly mobileScore: number;
  readonly desktopScore: number;
  readonly color: string;
  readonly showDeviceIcons?: boolean;
  readonly onClick: () => void;
}

export function MetricBadge({
  icon,
  label,
  mobileScore,
  desktopScore,
  color,
  showDeviceIcons = false,
  onClick,
}: MetricBadgeProps) {
  return (
    <Button onPress={onClick} className="min-w-fit h-auto p-0 m-0" radius="full" variant="light">
      <div className={`px-2 py-1 rounded-full flex items-center gap-1.5 ${color}`}>
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>

        {showDeviceIcons ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" />
              <span className="text-xs">{mobileScore}</span>
            </div>
            <span className="text-xs">/</span>
            <div className="flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span className="text-xs">{desktopScore}</span>
            </div>
          </div>
        ) : (
          <span className="text-xs">{mobileScore}/100</span>
        )}
      </div>
    </Button>
  );
}
