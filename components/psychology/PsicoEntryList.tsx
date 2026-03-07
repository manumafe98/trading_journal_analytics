'use client';

import { useState } from 'react';
import { PsicoEntry } from '@/data/analytics/types';
import { PsicoEntryCard } from './PsicoEntryCard';
import { PsicoEntryModal } from './PsicoEntryModal';

interface PsicoEntryListProps {
  entries: PsicoEntry[];
  onUpdate: (id: string, patch: Partial<PsicoEntry>) => void;
  onDelete: (id: string) => void;
}

export function PsicoEntryList({ entries, onUpdate, onDelete }: PsicoEntryListProps) {
  const [selectedEntry, setSelectedEntry] = useState<PsicoEntry | null>(null);

  return (
    <div className="w-full">
      <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {entries.map((entry) => (
          <div key={entry.id} className="snap-start">
            <PsicoEntryCard 
              entry={entry} 
              onClick={() => setSelectedEntry(entry)} 
            />
          </div>
        ))}
      </div>

      {selectedEntry && (
        <PsicoEntryModal 
          entry={selectedEntry} 
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)} 
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
