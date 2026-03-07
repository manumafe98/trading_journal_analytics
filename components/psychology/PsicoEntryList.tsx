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
    <div className="w-full h-full relative group">
      {/* List Container with hidden scrollbars but scrollable content */}
      <div 
        className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-6 scrollbar-hide focus:outline-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {entries.map((entry) => (
          <div 
            key={entry.id} 
            className="snap-center sm:snap-start shrink-0 w-[85vw] sm:w-[400px] lg:w-[450px]"
          >
            <div className="transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl rounded-2xl h-full">
              <PsicoEntryCard 
                entry={entry} 
                onClick={() => setSelectedEntry(entry)} 
              />
            </div>
          </div>
        ))}
        {/* Spacer for last item to scroll fully padding */}
        <div className="w-4 shrink-0 sm:hidden"></div>
      </div>
      
      {/* Global CSS injected to safely hide the webkit scrollbar specifically for this container */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />

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
