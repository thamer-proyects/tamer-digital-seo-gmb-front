'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Search,
  Users,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@heroui/react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ThemeSwitcher } from '../theme-toggle/theme-toggle-button';
import { usePathname } from 'next/navigation';
import { SidebarItem } from './sidebar-item';

const menuItems = [
  {
    name: 'Analyzer',
    icon: BarChart3,
    href: '/seo/analysis',
    subItems: [
      { name: 'Free Report', href: '/seo/analysis/free' },
      { name: 'Pro Report', href: '/seo/analysis/advanced' },
    ],
  },
  { name: 'Optimizer', icon: Search, href: '/keywords' },
  { name: 'AI Content Generator', icon: Users, href: '/audience' },
  { name: 'Monthly Report', icon: Settings, href: '/monthly-report' },
  { name: 'SEO Guide', icon: Settings, href: '/guide' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isAnalyzerSubRoute = menuItems[0].subItems?.some((subItem) => subItem.href === pathname);

  return (
    <>
      <Button
        isIconOnly
        variant="ghost"
        className="fixed top-4 right-4 lg:hidden text-black dark:text-gray-200"
        onPress={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <div
        className={cn(
          'fixed inset-0 flex flex-col w-full bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-800 p-4 transition-transform duration-300 ease-in-out lg:w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isCollapsed && 'lg:translate-x-0 lg:w-64',
          isCollapsed && 'lg:w-20 lg:translate-x-0',
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          'fixed inset-0 flex flex-col w-full bg-white dark:bg-[#18181a] border-r border-gray-200 dark:border-gray-800 p-4 transition-all duration-300 ease-in-out lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          !isCollapsed && 'lg:translate-x-0 lg:w-64',
          isCollapsed && 'lg:w-20 lg:translate-x-0 lg:overflow-visible',
        )}
        style={{ maxHeight: '100dvh', overflowY: 'scroll' }}
      >
        <div className="flex items-center gap-2 px-2 py-8 lg:py-4 h-16 shrink-0">
          <BarChart3 className="h-8 w-8 lg:h-6 lg:w-6 text-green-400 shrink-0" />
          <Link href="/">
            <span
              className={cn(
                'text-2xl lg:text-lg font-bold text-black dark:text-gray-100',
                'transition-all duration-300 overflow-hidden',
                'whitespace-nowrap',
                isCollapsed
                  ? 'lg:opacity-0 lg:invisible lg:w-0'
                  : 'lg:opacity-100 lg:visible lg:w-auto',
              )}
            >
              SEO On-Page
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-4 lg:gap-4 justify-between h-full">
          <div className="flex-1 gap-3 mt-8 lg:mt-0 flex flex-col">
            {menuItems.map((item) => (
              <div key={item.href}>
                <SidebarItem
                  icon={item.icon}
                  label={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  collapsed={isCollapsed}
                />
                {item.subItems && isAnalyzerSubRoute && !isCollapsed && (
                  <div className="ml-6 border-l-2 border-gray-200 dark:border-gray-800">
                    {item.subItems.map((subItem) => (
                      <SidebarItem
                        key={subItem.href}
                        label={subItem.name}
                        href={subItem.href}
                        icon={item.icon}
                        onClick={() => setIsOpen(false)}
                        collapsed={isCollapsed}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col items-center gap-4">
            <ThemeSwitcher />
            <Button
              isIconOnly
              variant="ghost"
              className="hidden lg:flex text-black dark:text-gray-200"
              onPress={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
