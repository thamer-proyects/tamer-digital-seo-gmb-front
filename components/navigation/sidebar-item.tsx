import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { Button } from '@heroui/react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  onClick?: () => void;
  collapsed?: boolean;
}

export function SidebarItem({
  icon: Icon,
  label,
  href,
  onClick,
  collapsed,
}: Readonly<SidebarItemProps>) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} onClick={onClick} className="block">
      <Button
        variant="ghost"
        className={cn(
          'w-full bg-transparent border-none transition-all duration-300',
          'justify-start gap-3 text-lg lg:text-base py-6 lg:py-2',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          'group relative',
          isActive
            ? 'bg-primary dark:bg-primary/20 text-white'
            : 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
        )}
      >
        <div className="relative flex items-center gap-3 w-full lg:w-auto">
          <Icon
            className={cn(
              'h-6 w-6 lg:h-5 lg:w-5 transition-transform shrink-0',
              'text-current group-hover:scale-110',
              isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300',
              collapsed && 'lg:mx-auto',
            )}
          />
          {!collapsed && (
            <span
              className={cn(
                'transition-opacity duration-300 text-sm font-medium',
                'lg:group-hover:opacity-100',
                collapsed ? 'lg:hidden' : 'opacity-100',
              )}
            >
              {label}
            </span>
          )}
        </div>
        {collapsed && (
          <span
            className={cn(
              'absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-2 rounded-md',
              'bg-white dark:bg-gray-800 text-sm font-medium',
              'shadow-md opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200 pointer-events-none',
              'whitespace-nowrap z-50',
            )}
          >
            {label}
          </span>
        )}
      </Button>
    </Link>
  );
}
