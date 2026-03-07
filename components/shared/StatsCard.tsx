'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  accent?: boolean;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  trend = 'neutral',
  subtitle,
  accent = false,
  className,
}: StatsCardProps) {
  const trendColors = {
    positive: 'text-emerald-500 dark:text-emerald-400',
    negative: 'text-red-500 dark:text-red-400',
    neutral: 'text-gray-400 dark:text-gray-500',
  };

  const iconBgColors = {
    positive: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400',
    negative: 'bg-red-500/10 text-red-500 dark:text-red-400',
    neutral: 'bg-gray-500/10 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-gray-700',
        className
      )}
    >
      {/* Subtle glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-gradient-to-br dark:from-primary/5 dark:to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <p
              className={cn(
                'text-2xl font-bold tracking-tight transition-colors duration-300',
                accent ? 'text-primary' : trendColors[trend],
                trend === 'neutral' && !accent && 'text-gray-900 dark:text-gray-50'
              )}
            >
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="mt-1 truncate text-[10px] leading-tight text-gray-400 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm',
            iconBgColors[trend].replace('/10', '/20')
          )}
        >
          {React.cloneElement(
            icon as React.ReactElement<{ className?: string }>,
            { className: cn('h-5 w-5', (icon as React.ReactElement<{ className?: string }>).props?.className) }
          )}
        </div>
      </div>
    </div>
  );
}
