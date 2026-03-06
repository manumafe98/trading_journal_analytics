'use client';

import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-surface lg:px-6">
      <ThemeSwitch />
    </header>
  );
}

