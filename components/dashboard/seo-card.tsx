import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SEOCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function SEOCard({ title, value, icon, className }: SEOCardProps) {
  return (
    <Card className={cn('bg-black/40 border-gray-800', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}
