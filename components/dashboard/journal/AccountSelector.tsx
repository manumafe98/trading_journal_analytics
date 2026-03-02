'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon, TrendingUpIcon, TrendingDownIcon, WalletIcon, BarChart3Icon } from 'lucide-react';
import type { Account, Trade } from '@/lib/journal/types';
import { deriveAccountStats } from '@/lib/journal/storage';

interface Props {
    accounts: Account[];
    trades: Trade[];
    onSelect: (account: Account) => void;
    onAdd: (data: Omit<Account, 'id' | 'createdAt'>) => void;
    onDelete: (id: string) => void;
}

export function AccountSelector({ accounts, trades, onSelect, onAdd, onDelete }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [capital, setCapital] = useState('');
    const [currency, setCurrency] = useState('USD');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !capital) return;
        onAdd({ name: name.trim(), initialCapital: parseFloat(capital), currency });
        setName('');
        setCapital('');
        setCurrency('USD');
        setShowForm(false);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
            {/* Header */}
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 md:text-3xl">
                            Mis Cuentas
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Seleccioná una cuenta para ver tu journal de trading
                        </p>
                    </div>
                    <button
                        id="add-account-btn"
                        onClick={() => setShowForm(true)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary-500 hover:shadow-lg hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Nueva Cuenta
                    </button>
                </div>

                {/* Empty state */}
                {accounts.length === 0 && !showForm && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-24 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/20">
                            <WalletIcon className="h-8 w-8 text-primary-500" />
                        </div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
                            No tenés cuentas todavía
                        </h2>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                            Creá tu primera cuenta de trading para empezar a registrar tus operaciones
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-500"
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
                                    className="group relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700/50 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                    onClick={() => onSelect(account)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && onSelect(account)}
                                    id={`account-card-${account.id}`}
                                >
                                    {/* Delete */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete(account.id); }}
                                        className="absolute top-4 right-4 cursor-pointer rounded-lg p-1.5 text-gray-300 opacity-0 transition-all duration-150 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 group-hover:opacity-100"
                                        aria-label="Eliminar cuenta"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>

                                    {/* Account name + currency */}
                                    <div className="mb-4 flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30">
                                            <WalletIcon className="h-5 w-5 text-primary-500" />
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
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Balance actual</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                                            {account.currency} {stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                            {isProfit ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
                                            {isProfit ? '+' : ''}{stats.totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} P&L
                                        </span>
                                    </div>

                                    {/* Stats row */}
                                    <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
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

                                    {/* Hover arrow */}
                                    <div className="absolute bottom-5 right-5 text-primary-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
                            <h2 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-50">Nueva Cuenta</h2>
                            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Ingresá el nombre y el capital inicial</p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nombre de la cuenta
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ej: Cuenta Principal, Cuenta Cripto..."
                                        required
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Capital inicial
                                        </label>
                                        <input
                                            type="number"
                                            value={capital}
                                            onChange={(e) => setCapital(e.target.value)}
                                            placeholder="10000"
                                            min="0"
                                            step="0.01"
                                            required
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors"
                                        />
                                    </div>
                                    <div className="w-28">
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Moneda
                                        </label>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-colors cursor-pointer"
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
                                        className="flex-1 cursor-pointer rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-500"
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
