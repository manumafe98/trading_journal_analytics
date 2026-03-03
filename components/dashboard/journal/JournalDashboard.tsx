'use client';

import { useState } from 'react';
import { ArrowLeftIcon, PlusIcon, FileTextIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { useJournalStore, deriveAccountStats } from '@/lib/journal/storage';
import { AccountSelector } from './AccountSelector';
import { AddTradeModal } from './AddTradeModal';
import { PDFUploadModal } from './PDFUploadModal';
import { StatsGrid } from './StatsGrid';
import { NotionTradeTable } from './NotionTradeTable';
import { ReglasSection } from './ReglasSection';
import { TradingPlanSection } from './TradingPlanSection';
import { DashboardOverview } from './DashboardOverview';
import { EquityCurveChart } from './charts/EquityCurveChart';
import { DrawdownChart } from './charts/DrawdownChart';
import { WinLossDonut } from './charts/WinLossDonut';
import { MonthlyPLChart } from './charts/MonthlyPLChart';
import { PLDistributionChart } from './charts/PLDistributionChart';
import { SymbolPerformanceChart } from './charts/SymbolPerformanceChart';
import { DayOfWeekChart } from './charts/DayOfWeekChart';
import { RiskRewardScatter } from './charts/RiskRewardScatter';
import { SessionChart } from './charts/SessionChart';
import { DirectionStatsChart } from './charts/DirectionStatsChart';
import { StreakCards } from './charts/StreakCards';
import { RRStatsCard } from './charts/RRStatsCard';
import { DurationChart } from './charts/DurationChart';
import { MonthlyProgressChart } from './charts/MonthlyProgressChart';
import type { Account } from '@/lib/journal/types';
import Link from 'next/link';

interface Props {
    investorId: string;
    investorName: string;
    accentColor: string;
}

export function JournalDashboard({ investorId, investorName, accentColor }: Props) {
    const { store, isLoaded, addAccount, deleteAccount, addTrade, deleteTrade, updateTrade } = useJournalStore(investorId);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'backtesting' | 'reglas' | 'tradingplan'>('dashboard');

    const account = selectedAccount
        ? store.accounts.find((a) => a.id === selectedAccount.id) ?? null
        : null;

    const accountTrades = account
        ? store.trades.filter((t) => t.accountId === account.id)
        : [];

    const stats = account
        ? deriveAccountStats(accountTrades, account.initialCapital)
        : null;

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    // ───────────────────── Account Selector view ─────────────────────
    if (!account) {
        return (
            <>
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Portada
                        </Link>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className={`text-sm font-semibold ${accentColor}`}>{investorName}</span>
                    </div>
                    <ThemeSwitch />
                </div>

                <AccountSelector
                    accounts={store.accounts}
                    trades={store.trades}
                    onSelect={(a) => setSelectedAccount(a)}
                    onAdd={addAccount}
                    onDelete={deleteAccount}
                />
            </>
        );
    }

    // ─────────────────────── Dashboard view ──────────────────────────
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            {/* Top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-5 py-3 gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        onClick={() => setSelectedAccount(null)}
                        className="cursor-pointer inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors whitespace-nowrap"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Cuentas
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <h1 className="font-semibold text-gray-900 dark:text-gray-50 truncate">{account.name}</h1>
                    <span className={`hidden sm:inline text-xs font-medium ${accentColor} opacity-80`}>· {investorName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        id="upload-pdf-btn"
                        onClick={() => setShowPDFModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 hover:shadow-md"
                    >
                        <FileTextIcon className="h-4 w-4" />
                        Subir PDF
                    </button>

                    <button
                        id="add-trade-btn"
                        onClick={() => setShowTradeModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-500 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nuevo Trade
                    </button>
                    <ThemeSwitch />
                </div>
            </div>
            {/* Tab navigation */}
            <div className="sticky top-[57px] z-10 flex items-center gap-1 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-5">
                {([
                    { key: 'dashboard', label: 'Dashboard' },
                    { key: 'backtesting', label: 'Backtesting' },
                    { key: 'reglas', label: 'Reglas' },
                    { key: 'tradingplan', label: 'Trading Plan' },
                ] as const).map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`cursor-pointer px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${activeTab === tab.key
                            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content — switches based on active tab */}
            {activeTab === 'dashboard' && <DashboardOverview account={account} trades={accountTrades} />}
            {activeTab === 'reglas' && <ReglasSection investorName={investorName} />}
            {activeTab === 'tradingplan' && <TradingPlanSection investorName={investorName} />}
            {activeTab === 'backtesting' && (
                <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 lg:px-8 space-y-6">

                    {stats && (
                        <StatsGrid
                            balance={stats.balance}
                            initialCapital={account.initialCapital}
                            totalPnl={stats.totalPnl}
                            winRate={stats.winRate}
                            totalTrades={stats.totalTrades}
                            openTrades={stats.openTrades}
                            avgWin={stats.avgWin}
                            avgLoss={stats.avgLoss}
                            profitFactor={stats.profitFactor}
                            currency={account.currency}
                        />
                    )}

                    {/* ── Análisis Base ── */}
                    <EquityCurveChart trades={accountTrades} initialCapital={account.initialCapital} />
                    <DrawdownChart trades={accountTrades} initialCapital={account.initialCapital} />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <WinLossDonut trades={accountTrades} />
                        <MonthlyPLChart trades={accountTrades} />
                        <PLDistributionChart trades={accountTrades} />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <SymbolPerformanceChart trades={accountTrades} />
                        <DayOfWeekChart trades={accountTrades} />
                    </div>

                    <RiskRewardScatter trades={accountTrades} />

                    {/* ── Análisis Avanzado ── */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Análisis Avanzado
                        </span>
                        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <StreakCards trades={accountTrades} />
                        <RRStatsCard trades={accountTrades} />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <DirectionStatsChart trades={accountTrades} />
                        <SessionChart trades={accountTrades} />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <DurationChart trades={accountTrades} />
                        <MonthlyProgressChart trades={accountTrades} />
                    </div>

                    <NotionTradeTable
                        trades={accountTrades}
                        accountId={account.id}
                        onAdd={addTrade}
                        onUpdate={updateTrade}
                        onDelete={deleteTrade}
                    />
                </div>
            )}

            {/* Modals */}
            {showTradeModal && (
                <AddTradeModal
                    accountId={account.id}
                    onAdd={addTrade}
                    onClose={() => setShowTradeModal(false)}
                />
            )}

            {showPDFModal && (
                <PDFUploadModal
                    accountId={account.id}
                    onImport={addTrade}
                    onClose={() => setShowPDFModal(false)}
                />
            )}
        </div>
    );
}
