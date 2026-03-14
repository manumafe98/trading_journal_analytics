'use client';

import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onOpenSidebar: () => void;
}

export function TopBar({ onOpenSidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200/50 bg-white/70 backdrop-blur-xl px-4 dark:border-white/[0.05] dark:bg-black/20 lg:px-6">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onOpenSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-1 justify-end">
        <ThemeSwitch />
      </div>
    </header>
  );
}
