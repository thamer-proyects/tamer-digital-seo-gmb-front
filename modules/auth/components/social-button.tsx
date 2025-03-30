import { Button } from '@heroui/react';
import { Chrome } from 'lucide-react';

interface SocialButtonProps {
  label: string;
  onClick: () => void;
}

export function SocialButton({ label, onClick }: Readonly<SocialButtonProps>) {
  return (
    <Button
      type="button"
      onPress={onClick}
      className="w-full bg-transparent border-gray-700 hover:bg-gray-800 text-white"
    >
      <Chrome className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );
}
