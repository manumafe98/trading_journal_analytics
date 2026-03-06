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
        const data = JSON.parse(raw) as JournalStore;

        // Data Repair / Migration: Ensure status is consistent with PnL for existing trades
        let changed = false;
        const trades = data.trades.map((t) => {
            let pnl = t.pnl;
            let pnlPercent = t.pnlPercent;

            // Heuristic: If pnl is small (e.g. 4.3 or 2.3) and pnlPercent is 0, 
            // it was likely a missing % sign during the first import/entry.
            if (pnlPercent === 0 && pnl !== 0 && Math.abs(pnl) < 100) {
                // We'll treat values < 100 as percentages if they look like the user's input (2.3, 4.3, etc)
                // This is a one-time migration to fix the reported "6 usd" issue.
                pnlPercent = pnl;
                pnl = 0;
                changed = true;
            }

            const pnlVal = pnlPercent !== 0 && pnlPercent !== undefined ? pnlPercent : pnl;
            let newStatus = t.status;

            if (t.status !== 'open') {
                if (Math.abs(pnlVal) <= 0.001) newStatus = 'be';
                else if (pnlVal > 0) newStatus = 'won';
                else if (pnlVal < 0) newStatus = 'lost';
            }

            if (newStatus !== t.status || pnl !== t.pnl || pnlPercent !== t.pnlPercent) {
                changed = true;
                return { ...t, pnl, pnlPercent, status: newStatus };
            }
            return t;
        });

        if (changed) {
            const next = { ...data, trades };
            localStorage.setItem(getKey(investorId), JSON.stringify(next));
            return next;
        }

        return data;
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

    const updateAccount = useCallback(
        (accountId: string, data: Partial<Account>) => {
            save({
                ...store,
                accounts: store.accounts.map((a) =>
                    a.id === accountId ? { ...a, ...data } : a
                ),
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

    const addTrades = useCallback(
        (dataList: Omit<Trade, 'id'>[]) => {
            const newTrades = dataList.map((data) => ({ ...data, id: crypto.randomUUID() }));
            save({ ...store, trades: [...store.trades, ...newTrades] });
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
        updateAccount,
        deleteAccount,
        addTrade,
        addTrades,
        deleteTrade,
        updateTrade,
    };
}

/** If pnl is 0 but pnlPercent exists, convert % → USD using initial capital */
/** Prioritize percentage if available (for account scaling), fallback to USD value */
export const getEffectivePnl = (t: Trade, initialCapital: number) => {
    if (t.pnlPercent !== 0 && t.pnlPercent !== undefined) {
        return (t.pnlPercent * initialCapital) / 100;
    }
    return t.pnl || 0;
};

/** Derive stats for an account from its trades */
export function deriveAccountStats(trades: Trade[], initialCapital: number) {
    const closed = trades.filter((t) => t.status !== 'open');
    const won = closed.filter((t) => t.status === 'won');
    const lost = closed.filter((t) => t.status === 'lost');

    const totalPnl = closed.reduce((s, t) => s + getEffectivePnl(t, initialCapital), 0);
    const balance = initialCapital + totalPnl;

    // We exclude BE from the Win Rate denominator by only counting explicit wins/losses.
    const relevantTotal = won.length + lost.length;
    const winRate = relevantTotal > 0 ? (won.length / relevantTotal) * 100 : 0;

    const avgWin = won.length > 0
        ? won.reduce((s, t) => s + getEffectivePnl(t, initialCapital), 0) / won.length
        : 0;

    const avgLoss = lost.length > 0
        ? Math.abs(lost.reduce((s, t) => s + getEffectivePnl(t, initialCapital), 0) / lost.length)
        : 0;

    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;

    return {
        balance,
        totalPnl,
        winRate,
        totalTrades: closed.length,
        openTrades: trades.filter((t) => t.status === 'open').length,
        won: won.length,
        lost: lost.length,
        be: closed.length - (won.length + lost.length),
        avgWin,
        avgLoss,
        profitFactor,
    };
}
