import { useTheme } from 'next-themes';
import { Switch } from '@heroui/react';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const ThemeSwitcher = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      defaultSelected={resolvedTheme === 'dark'}
      size="lg"
      color="secondary"
      startContent={<Sun size={20} />}
      endContent={<Moon size={20} />}
      onValueChange={(isSelected) => {
        setTheme(isSelected ? 'dark' : 'light');
      }}
    />
  );
};
