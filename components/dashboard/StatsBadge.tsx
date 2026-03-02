'use client';

const badgeStyles = {
    buy: 'bg-accent-info-bg text-accent-info dark:bg-accent-info/20 dark:text-blue-300',
    sell: 'bg-accent-danger-bg text-accent-danger dark:bg-accent-danger/20 dark:text-red-300',
    won: 'bg-accent-success-bg text-accent-success dark:bg-accent-success/20 dark:text-emerald-300',
    lost: 'bg-accent-danger-bg text-accent-danger dark:bg-accent-danger/20 dark:text-red-300',
    open: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
} as const;

type BadgeVariant = keyof typeof badgeStyles;

export function StatsBadge({ variant, label }: { variant: BadgeVariant; label?: string }) {
    const displayLabel = label ?? variant.charAt(0).toUpperCase() + variant.slice(1);

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[variant]}`}
        >
            {displayLabel}
        </span>
    );
}
