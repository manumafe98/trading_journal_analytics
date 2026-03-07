import { useState, useEffect } from 'react';
import { PsicoEntry } from '@/data/analytics/types';

const STORAGE_KEY = 'psico_entries_v1';

export function usePsicoEntries() {
  const [entries, setEntries] = useState<PsicoEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load psico entries:', err);
    }
    setIsLoaded(true);
  }, []);

  const saveEntries = (newEntries: PsicoEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const createEntry = (data: Omit<PsicoEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEntry: PsicoEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveEntries([newEntry, ...entries]);
    return newEntry;
  };

  const updateEntry = (id: string, patch: Partial<PsicoEntry>) => {
    const newEntries = entries.map((entry) =>
      entry.id === id
        ? { ...entry, ...patch, updatedAt: new Date().toISOString() }
        : entry
    );
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter((entry) => entry.id !== id));
  };

  const linkTradeToEntry = (entryId: string, tradeId: string | undefined) => {
    updateEntry(entryId, { linkedTradeId: tradeId });
  };

  return {
    entries,
    isLoaded,
    createEntry,
    updateEntry,
    deleteEntry,
    linkTradeToEntry,
  };
}
