'use client';

import { useState, useEffect, useCallback } from 'react';
import type { JournalStore, Account, Trade } from './types';

const DEFAULT_STORE: JournalStore = { accounts: [], trades: [] };

function getKey(investorId: string): string {
    return `tj-${investorId}`;
}

function readStore(investorId: string): JournalStore {
    if (typeof window === 'undefined') return DEFAULT_STORE;
    try {
        const raw = localStorage.getItem(getKey(investorId));
        if (!raw) return DEFAULT_STORE;
        return JSON.parse(raw) as JournalStore;
    } catch {
        return DEFAULT_STORE;
    }
}

function writeStore(investorId: string, store: JournalStore): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getKey(investorId), JSON.stringify(store));
}

export function useJournalStore(investorId: string) {
    const [store, setStore] = useState<JournalStore>(DEFAULT_STORE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setStore(readStore(investorId));
        setIsLoaded(true);
    }, [investorId]);

    const save = useCallback(
        (next: JournalStore) => {
            writeStore(investorId, next);
            setStore(next);
        },
        [investorId],
    );

    const addAccount = useCallback(
        (data: Omit<Account, 'id' | 'createdAt'>) => {
            const account: Account = {
                ...data,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
            };
            save({ ...store, accounts: [...store.accounts, account] });
        },
        [store, save],
    );

    const deleteAccount = useCallback(
        (accountId: string) => {
            save({
                accounts: store.accounts.filter((a) => a.id !== accountId),
                trades: store.trades.filter((t) => t.accountId !== accountId),
            });
        },
        [store, save],
    );

    const addTrade = useCallback(
        (data: Omit<Trade, 'id'>) => {
            const trade: Trade = { ...data, id: crypto.randomUUID() };
            save({ ...store, trades: [...store.trades, trade] });
        },
        [store, save],
    );

    const deleteTrade = useCallback(
        (tradeId: string) => {
            save({ ...store, trades: store.trades.filter((t) => t.id !== tradeId) });
        },
        [store, save],
    );

    const updateTrade = useCallback(
        (tradeId: string, data: Partial<Trade>) => {
            save({
                ...store,
                trades: store.trades.map((t) =>
                    t.id === tradeId ? { ...t, ...data } : t,
                ),
            });
        },
        [store, save],
    );

    return {
        store,
        isLoaded,
        addAccount,
        deleteAccount,
        addTrade,
        deleteTrade,
        updateTrade,
    };
}

/** Derive stats for an account from its trades */
export function deriveAccountStats(trades: Trade[], initialCapital: number) {
    const closed = trades.filter((t) => t.status !== 'open');
    const won = closed.filter((t) => t.status === 'won');
    const totalPnl = closed.reduce((s, t) => s + t.pnl, 0);
    const balance = initialCapital + totalPnl;
    const winRate = closed.length > 0 ? (won.length / closed.length) * 100 : 0;
    const avgWin =
        won.length > 0 ? won.reduce((s, t) => s + t.pnl, 0) / won.length : 0;
    const lost = closed.filter((t) => t.status === 'lost');
    const avgLoss =
        lost.length > 0
            ? Math.abs(lost.reduce((s, t) => s + t.pnl, 0) / lost.length)
            : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;

    return {
        balance,
        totalPnl,
        winRate,
        totalTrades: closed.length,
        openTrades: trades.filter((t) => t.status === 'open').length,
        avgWin,
        avgLoss,
        profitFactor,
    };
}
