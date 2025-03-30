import { Check, AlertCircle } from 'lucide-react';

interface MetricRowProps {
  label: string;
  value: string;
  status: 'success' | 'warning';
}

// Función para determinar el color basado en el estado y el valor
function getColor(status: 'success' | 'warning', value: string): string {
  if (status === 'success' || value === 'Pass') {
    return 'text-green-500';
  }
  if (value === 'Fail') {
    return 'text-red-500';
  }
  return 'text-yellow-500';
}

export function MetricRow({ label, value, status }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-800 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-800 dark:text-gray-300">{value}</span>
        {status === 'success' || value === 'Pass' ? (
          <Check className={`w-4 h-4 ${getColor(status, value)}`} />
        ) : (
          <AlertCircle className={`w-4 h-4 ${getColor(status, value)}`} />
        )}
      </div>
    </div>
  );
}
