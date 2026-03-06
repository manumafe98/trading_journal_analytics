'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboardIcon,
  ListOrderedIcon,
  BarChart3Icon,
  TargetIcon,
  BookOpenIcon,
  SettingsIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarNavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
}

function SidebarNavItem({ icon, label, active = false, href, onClick }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        transition-colors duration-200
        ${
          active
            ? 'bg-gray-100 text-gray-900 border-l-2 border-primary dark:bg-gray-900 dark:text-primary'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-50'
        }
      `}
    >
      <span className={active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { label: 'Dashboard', icon: <LayoutDashboardIcon className="h-4 w-4" />, href: '/dashboard' },
    { label: 'Trades', icon: <ListOrderedIcon className="h-4 w-4" />, href: '/dashboard/trades' },
    { label: 'Analytics', icon: <BarChart3Icon className="h-4 w-4" />, href: '/dashboard/analytics' },
    { label: 'Trading Plan', icon: <TargetIcon className="h-4 w-4" />, href: '/dashboard/plan' },
    { label: 'Psicotrading', icon: <BookOpenIcon className="h-4 w-4" />, href: '/dashboard/psychology' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-60 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          dark:border-gray-800 dark:bg-surface
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-gray-950">
              E
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50">
              EdgeLog
            </span>
          </Link>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 lg:hidden"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>


        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {navigation.map((item) => (
            <SidebarNavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              onClick={onClose}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
