'use client';

import {
    TrendingUpIcon,
    TrendingDownIcon,
    DollarSignIcon,
    PercentIcon,
    BarChart3Icon,
    LayersIcon,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'total-balance': DollarSignIcon,
    'monthly-pnl': BarChart3Icon,
    'win-rate': PercentIcon,
    'open-positions': LayersIcon,
};

export function SummaryCard({
    id,
    label,
    value,
    delta,
    trending,
    iconBg,
}: {
    id: string;
    label: string;
    value: string;
    delta: string;
    trending: 'up' | 'down';
    iconBg: string;
}) {
    const Icon = iconMap[id] ?? DollarSignIcon;

    return (
        <div className="rounded-xl bg-white p-6 shadow-md transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 dark:border dark:border-gray-700/50 dark:bg-gray-800 dark:shadow-none dark:hover:border-gray-600 animate-fade-in-up">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                    <Icon className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                </div>
            </div>

            <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-50">
                {value}
            </div>

            <div className="flex items-center gap-1">
                <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${trending === 'up'
                        ? 'text-accent-success'
                        : 'text-accent-danger'
                        }`}
                >
                    {trending === 'up' ? (
                        <TrendingUpIcon className="h-3.5 w-3.5" />
                    ) : (
                        <TrendingDownIcon className="h-3.5 w-3.5" />
                    )}
                    {delta}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">vs last month</span>
            </div>
        </div>
    );
}
