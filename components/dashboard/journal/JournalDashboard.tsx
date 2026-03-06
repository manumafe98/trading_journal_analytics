'use client';

import { useState } from 'react';
import { ArrowLeftIcon, PlusIcon, FileTextIcon } from 'lucide-react';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';
import { useJournalStore } from '@/lib/journal/storage';
import { AccountSelector } from './AccountSelector';
import { AddTradeModal } from './AddTradeModal';
import { ImportModal } from './PDFUploadModal';
import { DashboardOverview } from './DashboardOverview';
import type { Account } from '@/lib/journal/types';
import Link from 'next/link';


interface Props {
    investorId: string;
    investorName: string;
    accentColor: string;
}

export function JournalDashboard({ investorId, investorName, accentColor }: Props) {
    const { store, isLoaded, addAccount, deleteAccount, addTrade, addTrades, deleteTrade, updateTrade } = useJournalStore(investorId);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    const account = selectedAccount
        ? store.accounts.find((a) => a.id === selectedAccount.id) ?? null
        : null;

    const accountTrades = account
        ? store.trades.filter((t) => t.accountId === account.id)
        : [];


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
                        id="import-trades-btn"
                        onClick={() => setShowImportModal(true)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 hover:shadow-md"
                    >
                        <FileTextIcon className="h-4 w-4" />
                        Importar CSV/MD
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
            <DashboardOverview account={account} trades={accountTrades} />


            {/* Modals */}
            {showTradeModal && (
                <AddTradeModal
                    accountId={account.id}
                    onAdd={addTrade}
                    onClose={() => setShowTradeModal(false)}
                />
            )}

            {showImportModal && (
                <ImportModal
                    accountId={account.id}
                    onImport={addTrade}
                    onImportMany={addTrades}
                    onClose={() => setShowImportModal(false)}
                />
            )}
        </div>
    );
}
