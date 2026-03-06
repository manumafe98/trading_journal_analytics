'use client';

export function NavItem({
    icon: Icon,
    label,
    active = false,
    onClick,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active?: boolean;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
        cursor-pointer transition-colors
        ${active
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }
      `}
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
        </button>
    );
}
