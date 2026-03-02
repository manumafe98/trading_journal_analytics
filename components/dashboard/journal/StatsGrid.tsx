'use client';

import {
    DollarSignIcon, PercentIcon, TrendingUpIcon,
    TrendingDownIcon, BarChart3Icon, LayersIcon, ActivityIcon, ZapIcon,
} from 'lucide-react';

interface StatCard {
    id: string;
    label: string;
    value: string;
    sub?: string;
    positive?: boolean | null;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
}

interface Props {
    balance: number;
    initialCapital: number;
    totalPnl: number;
    winRate: number;
    totalTrades: number;
    openTrades: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    currency: string;
}

export function StatsGrid({
    balance, initialCapital, totalPnl, winRate, totalTrades,
    openTrades, avgWin, avgLoss, profitFactor, currency,
}: Props) {
    const pnlPct = initialCapital > 0 ? (totalPnl / initialCapital) * 100 : 0;
    const isProfit = totalPnl >= 0;

    const cards: StatCard[] = [
        {
            id: 'balance',
            label: 'Balance',
            value: `${currency} ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: `Capital inicial: ${currency} ${initialCapital.toLocaleString()}`,
            positive: null,
            icon: DollarSignIcon,
            iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            id: 'pnl',
            label: 'P&L Total',
            value: `${isProfit ? '+' : ''}${currency} ${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            sub: `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`,
            positive: isProfit,
            icon: isProfit ? TrendingUpIcon : TrendingDownIcon,
            iconBg: isProfit ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
        },
        {
            id: 'winrate',
            label: 'Win Rate',
            value: `${winRate.toFixed(1)}%`,
            sub: `${totalTrades} trades cerrados`,
            positive: winRate >= 50,
            icon: PercentIcon,
            iconBg: winRate >= 50 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
        },
        {
            id: 'trades',
            label: 'Trades',
            value: `${totalTrades}`,
            sub: `${openTrades} abiertos`,
            positive: null,
            icon: BarChart3Icon,
            iconBg: 'bg-violet-50 dark:bg-violet-900/20',
        },
        {
            id: 'avgwin',
            label: 'Avg. Ganancia',
            value: `+$${avgWin.toFixed(2)}`,
            positive: true,
            icon: ZapIcon,
            iconBg: 'bg-green-50 dark:bg-green-900/20',
        },
        {
            id: 'avgloss',
            label: 'Avg. Pérdida',
            value: `-$${avgLoss.toFixed(2)}`,
            positive: false,
            icon: ActivityIcon,
            iconBg: 'bg-red-50 dark:bg-red-900/20',
        },
        {
            id: 'pf',
            label: 'Profit Factor',
            value: isFinite(profitFactor) ? profitFactor.toFixed(2) : '∞',
            sub: profitFactor > 1 ? 'Positivo' : 'Negativo',
            positive: profitFactor >= 1,
            icon: LayersIcon,
            iconBg: profitFactor >= 1 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20',
        },
        {
            id: 'open',
            label: 'Posiciones abiertas',
            value: `${openTrades}`,
            positive: null,
            icon: LayersIcon,
            iconBg: 'bg-slate-50 dark:bg-slate-700/30',
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.id}
                        className="rounded-2xl bg-white dark:bg-gray-800 p-4 shadow-md dark:border dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{card.label}</span>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
                                <Icon className={`h-4 w-4 ${card.positive === true ? 'text-green-500'
                                        : card.positive === false ? 'text-red-500'
                                            : 'text-primary-500'
                                    }`} />
                            </div>
                        </div>
                        <div className={`text-lg font-bold leading-tight ${card.positive === true ? 'text-green-500'
                                : card.positive === false ? 'text-red-500'
                                    : 'text-gray-900 dark:text-gray-50'
                            }`}>
                            {card.value}
                        </div>
                        {card.sub && (
                            <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 truncate">{card.sub}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
