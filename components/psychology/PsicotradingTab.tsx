'use client';

import { usePsicoEntries } from '../../hooks/usePsicoEntries';
import { PsicoEntryForm } from './PsicoEntryForm';
import { PsicoEntryList } from './PsicoEntryList';

export function PsicotradingTab() {
  const { entries, createEntry, updateEntry, deleteEntry, isLoaded } = usePsicoEntries();

  if (!isLoaded) return <div className="p-8 text-center text-gray-500">Loading journal...</div>;

  return (
    <div className="space-y-12">
      <section>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">New Journal Entry</h2>
          <PsicoEntryForm 
            onSubmit={(data) => {
              createEntry(data);
              // scroll to entries
              document.getElementById('recent-entries')?.scrollIntoView({ behavior: 'smooth' });
            }} 
          />
        </div>
      </section>

      {entries.length > 0 && (
        <section id="recent-entries" className="scroll-mt-6">
           <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Entries</h2>
           <PsicoEntryList 
             entries={entries} 
             onUpdate={updateEntry} 
             onDelete={deleteEntry} 
           />
        </section>
      )}
    </div>
  );
}
