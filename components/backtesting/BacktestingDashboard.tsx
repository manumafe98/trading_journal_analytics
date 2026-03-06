'use client';

import { useState } from 'react';
import {
    ArrowLeftIcon, PlusIcon, FileTextIcon,
    FlaskConical, TrashIcon, TrendingUpIcon,
    TrendingDownIcon, WalletIcon, BarChart3Icon,
} from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { useJournalStore, deriveAccountStats } from '@/lib/journal/storage';
import { AddTradeModal } from '@/components/dashboard/journal/AddTradeModal';
import { ImportModal } from '@/components/dashboard/journal/PDFUploadModal';
import { DashboardOverview } from '@/components/dashboard/journal/DashboardOverview';
import { NotionTradeTable } from '@/components/dashboard/journal/NotionTradeTable';
import { PsychologyAnalysis } from '@/components/dashboard/journal/PsychologyAnalysis';
import { BacktestingDetailedStats } from '@/components/backtesting/BacktestingDetailedStats';
import type { Account } from '@/lib/journal/types';
import Link from 'next/link';

interface Props {
    investorId: string;
    investorName: string;
    accentColor: string;
}

// ── Account Selector for Backtesting ──────────────────────────────────────────
function BacktestingAccountSelector({
    accounts,
    trades,
    onSelect,
    onAdd,
    onDelete,
}: {
    accounts: Account[];
    trades: ReturnType<typeof useJournalStore>['store']['trades'];
    onSelect: (account: Account) => void;
    onAdd: (data: Omit<Account, 'id' | 'createdAt'>) => void;
    onDelete: (id: string) => void;
}) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [capital, setCapital] = useState('');
    const [currency, setCurrency] = useState('USD');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !capital) return;
        onAdd({ name: name.trim(), initialCapital: parseFloat(capital), currency });
        setName(''); setCapital(''); setCurrency('USD');
        setShowForm(false);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <FlaskConical className="h-3.5 w-3.5" />
                            Backtesting
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 md:text-3xl">
                            Cuentas de Backtesting
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Simulá estrategias sin afectar tu diario real
                        </p>
                    </div>
                    <button
                        id="add-bt-account-btn"
                        onClick={() => setShowForm(true)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-amber-400 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nueva Cuenta
                    </button>
                </div>

                {/* Empty state */}
                {accounts.length === 0 && !showForm && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-700/50 py-24 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
                            <FlaskConical className="h-8 w-8 text-amber-500" />
                        </div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
                            No tenés cuentas de backtesting
                        </h2>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                            Creá una cuenta para empezar a testar tus estrategias
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-amber-400"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Crear primera cuenta
                        </button>
                    </div>
                )}

                {/* Accounts grid */}
                {accounts.length > 0 && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {accounts.map((account) => {
                            const accountTrades = trades.filter((t) => t.accountId === account.id);
                            const stats = deriveAccountStats(accountTrades, account.initialCapital);
                            const isProfit = stats.totalPnl >= 0;

                            return (
                                <div
                                    key={account.id}
                                    className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-amber-100 dark:border-amber-700/30 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                    onClick={() => onSelect(account)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && onSelect(account)}
                                    id={`bt-account-card-${account.id}`}
                                >
                                    {/* Badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                            <FlaskConical className="h-2.5 w-2.5" />
                                            BT
                                        </span>
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(account.id); }}
                                        className="absolute top-4 right-4 cursor-pointer rounded-lg p-1.5 text-gray-300 opacity-0 transition-all duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 group-hover:opacity-100"
                                        aria-label="Eliminar cuenta"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>

                                    {/* Account name */}
                                    <div className="mb-4 mt-5 flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30">
                                            <WalletIcon className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-50 leading-tight">
                                                {account.name}
                                            </h3>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                Capital: {account.currency} {account.initialCapital.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Balance */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Balance simulado</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                                            {account.currency} {stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                            {isProfit ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
                                            {isProfit ? '+' : ''}{stats.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} P&L
                                        </span>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-auto grid grid-cols-3 gap-2 border-t border-amber-100 dark:border-amber-700/30 pt-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Trades</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{stats.totalTrades}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Win Rate</p>
                                            <p className={`font-semibold text-sm ${stats.winRate >= 50 ? 'text-green-500' : 'text-red-500'}`}>
                                                {stats.winRate.toFixed(0)}%
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Abiertos</p>
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{stats.openTrades}</p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-5 right-5 text-amber-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <BarChart3Icon className="h-4 w-4" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* New Account Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl animate-fade-in-up">
                            <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                                <FlaskConical className="h-3 w-3" />
                                Backtesting
                            </div>
                            <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-50">Nueva Cuenta</h2>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Ingresá el nombre y el capital inicial simulado</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre de la cuenta
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Estrategia EMA, Setup Breakout..."
                                        required
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Capital inicial (simulado)
                                        </label>
                                        <input
                                            type="number"
                                            value={capital}
                                            onChange={(e) => setCapital(e.target.value)}
                                            placeholder="10000"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
                                        />
                                    </div>
                                    <div className="w-28">
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Moneda
                                        </label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-50 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors cursor-pointer"
                                        >
                                            <option value="USD">USD</option>
                                            <option value="ARS">ARS</option>
                                            <option value="EUR">EUR</option>
                                            <option value="BTC">BTC</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 cursor-pointer rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-amber-400"
                                    >
                                        Crear cuenta
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Main BacktestingDashboard ──────────────────────────────────────────────────
export function BacktestingDashboard({ investorId, investorName, accentColor }: Props) {
    // Use a separate namespace: bt-{investorId}
    const { store, isLoaded, addAccount, deleteAccount, addTrade, addTrades,
        updateTrade,
        deleteTrade,
        updateAccount,
    } = useJournalStore(`bt-${investorId}`);

    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'table'>('overview');

    const account = selectedAccount
        ? store.accounts.find((a) => a.id === selectedAccount.id) ?? null
        : null;

    const accountTrades = account
        ? store.trades.filter((t) => t.accountId === account.id)
        : [];

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            </div>
        );
    }

    // ── Account Selector view ──────────────────────────────────────────────────
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
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span className="text-sm font-semibold text-amber-500">Backtesting</span>
                    </div>
                    <ThemeSwitch />
                </div>

                <BacktestingAccountSelector
                    accounts={store.accounts}
                    trades={store.trades}
                    onSelect={(a) => setSelectedAccount(a)}
                    onAdd={addAccount}
                    onDelete={deleteAccount}
                />
            </>
        );
    }

    // ── Inner backtesting account view ────────────────────────────────────────
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
                        Cuentas BT
                    </button>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <FlaskConical className="h-4 w-4 text-amber-500 shrink-0" />
                    <h1 className="font-semibold text-gray-900 dark:text-gray-50 truncate">{account.name}</h1>
                    <span className={`hidden sm:inline text-xs font-medium ${accentColor} opacity-80`}>· {investorName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        id="bt-upload-csv-btn"
                        onClick={() => setShowCSVModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-amber-400 hover:text-amber-600 dark:hover:border-amber-400 dark:hover:text-amber-400 hover:shadow-md"
                    >
                        <FileTextIcon className="h-4 w-4" />
                        Subir CSV
                    </button>
                    <button
                        id="bt-add-trade-btn"
                        onClick={() => setShowTradeModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-amber-400 hover:shadow-md hover:-translate-y-0.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nuevo Trade
                    </button>
                    <ThemeSwitch />
                </div>
            </div>

            {/* Backtesting badge bar */}
            <div className="flex items-center gap-2 border-b border-amber-100 dark:border-amber-700/30 bg-amber-50 dark:bg-amber-900/10 px-5 py-2">
                <FlaskConical className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Modo Backtesting — datos simulados, no afectan tu diario real
                </span>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="mx-auto flex max-w-[1600px] px-4 md:px-6 lg:px-8">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`whitespace-nowrap cursor-pointer border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${activeTab === 'overview'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            Resumen General
                        </button>
                        <button
                            onClick={() => setActiveTab('detailed')}
                            className={`whitespace-nowrap cursor-pointer border-b-2 py-4 px-1 text-sm font-semibold transition-colors ${activeTab === 'detailed'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            Análisis Detallado
                        </button>
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`whitespace-nowrap cursor-pointer border-b-2 py-4 px-1 text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === 'table'
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            Registro de Trades
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-600 dark:text-gray-300">
                                {accountTrades.length}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* View Content */}
            <div className="animate-fade-in-up">
                {activeTab === 'overview' && (
                    <DashboardOverview account={account} trades={accountTrades} />
                )}
                {activeTab === 'detailed' && (
                    <div className="mx-auto max-w-[1600px] px-4 pb-8 md:px-6 lg:px-8">
                        {/* We need to import BacktestingDetailedStats at the top */}
                        <BacktestingDetailedStats account={account} trades={accountTrades} />
                    </div>
                )}
                {activeTab === 'table' && (
                    <div className="mx-auto max-w-[1600px] px-4 py-6 pb-8 md:px-6 lg:px-8">
                        <NotionTradeTable
                            trades={accountTrades}
                            accountId={account.id}
                            onAdd={addTrade}
                            onUpdate={updateTrade}
                            onDelete={deleteTrade}
                        />
                        <div className="mt-8">
                            <PsychologyAnalysis
                                trades={accountTrades}
                                account={account}
                                onSaveProfile={(profile) => updateAccount(account.id, { psychologicalProfile: profile })}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showTradeModal && (
                <AddTradeModal
                    accountId={account.id}
                    onAdd={addTrade}
                    onClose={() => setShowTradeModal(false)}
                />
            )}
            {showCSVModal && (
                <ImportModal
                    accountId={account.id}
                    onImport={addTrade}
                    onImportMany={addTrades}
                    onClose={() => setShowCSVModal(false)}
                />
            )}
        </div>
    );
}
