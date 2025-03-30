import { cn } from '@/lib/utils';

interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function RootLayout({ children, className }: RootLayoutProps) {
  return <div className={cn('container w-full relative', className)}>{children}</div>;
}
