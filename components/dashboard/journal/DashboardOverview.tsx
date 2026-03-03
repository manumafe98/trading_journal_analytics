'use client';

import { useMemo } from 'react';
import {
    TrendingUpIcon, TrendingDownIcon, TargetIcon, ActivityIcon,
    ZapIcon, BarChart2Icon, AlertTriangleIcon, ShieldCheckIcon,
} from 'lucide-react';
import { EquityCurveChart } from './charts/EquityCurveChart';
import { WinLossDonut } from './charts/WinLossDonut';
import { MonthlyPLChart } from './charts/MonthlyPLChart';
import { StreakCards } from './charts/StreakCards';
import { MonthlyProgressChart } from './charts/MonthlyProgressChart';
import type { Trade, Account } from '@/lib/journal/types';
import { deriveAccountStats } from '@/lib/journal/storage';

interface Props {
    account: Account;
    trades: Trade[];
}

// ── Mini stat card ─────────────────────────────────────────────────────────────
function KpiCard({
    label, value, sub, icon: Icon, color = 'blue', trend,
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ComponentType<{ className?: string }>;
    color?: 'blue' | 'green' | 'red' | 'amber' | 'violet' | 'sky';
    trend?: 'up' | 'down' | 'neutral';
}) {
    const colorMap = {
        blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500' },
        green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', icon: 'text-green-500' },
        red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', icon: 'text-red-500' },
        amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500' },
        violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400', icon: 'text-violet-500' },
        sky: { bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400', icon: 'text-sky-500' },
    };
    const c = colorMap[color];

    return (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:border dark:border-gray-700/50 flex items-start gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className={`rounded-xl p-2.5 ${c.bg} shrink-0`}>
                <Icon className={`h-5 w-5 ${c.icon}`} />
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 truncate">{label}</p>
                <p className={`text-xl font-bold truncate ${c.text}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5 truncate">{sub}</p>}
            </div>
            {trend && (
                <div className="ml-auto shrink-0">
                    {trend === 'up' && <TrendingUpIcon className="h-4 w-4 text-green-400" />}
                    {trend === 'down' && <TrendingDownIcon className="h-4 w-4 text-red-400" />}
                </div>
            )}
        </div>
    );
}

// ── Recent trades mini-table ───────────────────────────────────────────────────
function RecentTradesTable({ trades }: { trades: Trade[] }) {
    const recent = [...trades]
        .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
        .slice(0, 8);

    if (recent.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-xs text-gray-400 gap-1">
                <BarChart2Icon className="h-8 w-8 mb-2 opacity-30" />
                <span>No hay trades registrados aún</span>
                <span className="opacity-60">Agregá trades desde la pestaña Backtesting</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                        {['Par', 'Fecha', 'Dirección', 'RR', 'Resultado', 'P&L'].map((h) => (
                            <th key={h} className="py-2 px-3 text-left font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {recent.map((t) => {
                        const isLong = t.side === 'Buy';
                        const pnlPos = t.pnl >= 0;
                        const resultColor = t.result === 'TP' ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                            : t.result === 'SL' ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                                : t.result === 'BE' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
                                    : 'text-gray-400 bg-gray-50 dark:bg-gray-700/40';
                        return (
                            <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                <td className="py-2.5 px-3 font-semibold text-gray-800 dark:text-gray-200">{t.symbol || '—'}</td>
                                <td className="py-2.5 px-3 text-gray-500">{t.entryDate}</td>
                                <td className="py-2.5 px-3">
                                    <span className={`inline-flex items-center gap-1 font-medium ${isLong ? 'text-sky-600' : 'text-violet-600'}`}>
                                        {isLong ? '▲ Long' : '▼ Short'}
                                    </span>
                                </td>
                                <td className="py-2.5 px-3 text-gray-600 dark:text-gray-400">
                                    {t.rrObtained != null ? `${t.rrObtained}R` : '—'}
                                </td>
                                <td className="py-2.5 px-3">
                                    {t.result ? (
                                        <span className={`inline-block rounded-md px-2 py-0.5 font-semibold text-[10px] ${resultColor}`}>
                                            {t.result}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">—</span>
                                    )}
                                </td>
                                <td className={`py-2.5 px-3 font-bold tabular-nums ${pnlPos ? 'text-green-600' : 'text-red-500'}`}>
                                    {pnlPos ? '+' : ''}{t.pnl.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function DashboardOverview({ account, trades }: Props) {
    const stats = useMemo(
        () => deriveAccountStats(trades, account.initialCapital),
        [trades, account.initialCapital],
    );

    const closedTrades = trades.filter((t) => t.status !== 'open');
    const pnlTrend: 'up' | 'down' | 'neutral' = stats.totalPnl > 0 ? 'up' : stats.totalPnl < 0 ? 'down' : 'neutral';
    const bestSymbol = useMemo(() => {
        const bySymbol: Record<string, number> = {};
        closedTrades.forEach((t) => {
            bySymbol[t.symbol] = (bySymbol[t.symbol] ?? 0) + t.pnl;
        });
        const sorted = Object.entries(bySymbol).sort(([, a], [, b]) => b - a);
        return sorted[0] ? { symbol: sorted[0][0], pnl: sorted[0][1] } : null;
    }, [closedTrades]);

    return (
        <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 space-y-6">

            {/* ── KPI row ── */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                <KpiCard
                    label="Balance"
                    value={`${account.currency} ${stats.balance.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    sub={`Capital inicial: ${account.currency} ${account.initialCapital.toLocaleString('es')}`}
                    icon={BarChart2Icon}
                    color="blue"
                    trend={pnlTrend}
                />
                <KpiCard
                    label="P&L Total"
                    value={`${stats.totalPnl >= 0 ? '+' : ''}${account.currency} ${stats.totalPnl.toFixed(2)}`}
                    sub={`${stats.totalPnl >= 0 ? '+' : ''}${((stats.totalPnl / account.initialCapital) * 100).toFixed(2)}% del capital`}
                    icon={stats.totalPnl >= 0 ? TrendingUpIcon : TrendingDownIcon}
                    color={stats.totalPnl >= 0 ? 'green' : 'red'}
                    trend={pnlTrend}
                />
                <KpiCard
                    label="Win Rate"
                    value={`${stats.winRate.toFixed(1)}%`}
                    sub={`${closedTrades.filter((t) => t.status === 'won').length} / ${closedTrades.length} trades cerrados`}
                    icon={TargetIcon}
                    color={stats.winRate >= 50 ? 'green' : 'amber'}
                />
                <KpiCard
                    label="Profit Factor"
                    value={stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
                    sub={stats.profitFactor >= 1.5 ? 'Excelente' : stats.profitFactor >= 1 ? 'Positivo' : 'Negativo'}
                    icon={ShieldCheckIcon}
                    color={stats.profitFactor >= 1.5 ? 'green' : stats.profitFactor >= 1 ? 'sky' : 'red'}
                />
                <KpiCard
                    label="Trades Totales"
                    value={String(stats.totalTrades)}
                    sub={`${stats.openTrades} abierto${stats.openTrades !== 1 ? 's' : ''}`}
                    icon={ActivityIcon}
                    color="violet"
                />
                <KpiCard
                    label="Ganancia Prom."
                    value={`+${account.currency} ${stats.avgWin.toFixed(2)}`}
                    sub="Por trade ganado"
                    icon={TrendingUpIcon}
                    color="green"
                />
                <KpiCard
                    label="Pérdida Prom."
                    value={`-${account.currency} ${Math.abs(stats.avgLoss).toFixed(2)}`}
                    sub="Por trade perdido"
                    icon={TrendingDownIcon}
                    color="red"
                />
                <KpiCard
                    label="Mejor Par"
                    value={bestSymbol ? bestSymbol.symbol : '—'}
                    sub={bestSymbol ? `+$${bestSymbol.pnl.toFixed(2)} P&L` : 'Sin datos'}
                    icon={ZapIcon}
                    color="amber"
                />
            </div>

            {/* ── Alert banners (only if data warrants it) ── */}
            {stats.winRate < 40 && closedTrades.length >= 5 && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-5 py-4">
                    <AlertTriangleIcon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Win Rate bajo ({stats.winRate.toFixed(0)}%)</p>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                            Tu win rate está por debajo del 40%. Revisá tus entradas y criterios de selectividad.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Equity curve ── */}
            <EquityCurveChart trades={trades} initialCapital={account.initialCapital} />

            {/* ── 3-col: WinLoss + MonthlyPL + Streaks ── */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <WinLossDonut trades={trades} />
                <MonthlyPLChart trades={trades} />
                <StreakCards trades={trades} />
            </div>

            {/* ── Progreso mensual ── */}
            <MonthlyProgressChart trades={trades} />

            {/* ── Recent trades ── */}
            <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:border dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Trades Recientes</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Últimos 8 trades de la cuenta</p>
                    </div>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {trades.length} total
                    </span>
                </div>
                <RecentTradesTable trades={trades} />
            </div>
        </div>
    );
}
