'use client';

import {
    LayoutDashboardIcon,
    CandlestickChartIcon,
    ArrowUpRightIcon,
    SettingsIcon,
    HelpCircleIcon,
    PieChartIcon,
    SearchIcon,
    XIcon,
} from 'lucide-react';
import { NavItem } from './NavItem';

export function DashboardSidebar({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          bg-white p-5 shadow-lg transition-transform duration-300
          dark:bg-gray-900 dark:shadow-none dark:border-r dark:border-gray-700
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-md lg:dark:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Close button (mobile) */}
                <button
                    onClick={onClose}
                    aria-label="Close sidebar"
                    className="absolute right-4 top-4 rounded-lg p-1.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                >
                    <XIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Logo */}
                <div className="mb-8 flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 font-bold text-white">
                        T
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        TradeView
                    </span>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        aria-label="Search trades"
                        className="h-9 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6">
                    <div>
                        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Menu
                        </div>
                        <div className="space-y-1">
                            <NavItem icon={LayoutDashboardIcon} label="Dashboard" active />
                            <NavItem icon={CandlestickChartIcon} label="Trades" />
                            <NavItem icon={ArrowUpRightIcon} label="Positions" />
                            <NavItem icon={PieChartIcon} label="Analytics" />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Apps
                        </div>
                        <div className="space-y-1">
                            <NavItem icon={SettingsIcon} label="Settings" />
                            <NavItem icon={HelpCircleIcon} label="Support" />
                        </div>
                    </div>
                </nav>

                {/* Upgrade card */}
                <div className="mt-auto rounded-xl bg-gradient-to-br from-primary-100 via-primary-200 to-primary-300/30 p-4 dark:from-primary-800/50 dark:via-primary-900/50 dark:to-gray-800/30">
                    <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                        Upgrade to Pro
                    </h3>
                    <p className="mb-3 text-xs text-gray-600 dark:text-white/70">
                        Unlock advanced analytics and unlimited trade tracking
                    </p>
                    <button className="h-9 w-full cursor-pointer rounded-lg bg-gray-900 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                        Upgrade Now
                    </button>
                </div>
            </aside>
        </>
    );
}
