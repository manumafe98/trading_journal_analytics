'use client';

import {
  BarChart3Icon,
  BookOpenIcon,
  PlusIcon,
  BellIcon,
  CalculatorIcon,
} from 'lucide-react';

interface DockItem {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
}

const dockItems: DockItem[] = [
  { icon: <BarChart3Icon className="h-4 w-4" />, label: 'Analytics' },
  { icon: <BookOpenIcon className="h-4 w-4" />, label: 'Journal' },
  { icon: <PlusIcon className="h-5 w-5" />, label: 'New Trade', primary: true },
  { icon: <BellIcon className="h-4 w-4" />, label: 'Alerts' },
  { icon: <CalculatorIcon className="h-4 w-4" />, label: 'Calculator' },
];

export function FloatingDock() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-60 flex justify-center px-4 lg:bottom-6">
      <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-2 py-2 shadow-floating-dock backdrop-blur-xl dark:border-gray-800 dark:bg-surface/90">
        {dockItems.map((item) =>
          item.primary ? (
            <button
              key={item.label}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-gray-950 shadow-neon-glow transition-all duration-200 hover:scale-110 hover:shadow-neon-glow-intense"
              title={item.label}
            >
              {item.icon}
            </button>
          ) : (
            <button
              key={item.label}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              title={item.label}
            >
              {item.icon}
            </button>
          )
        )}
      </div>
    </div>
  );
}
