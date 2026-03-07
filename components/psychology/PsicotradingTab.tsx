'use client';

import { usePsicoEntries } from '../../hooks/usePsicoEntries';
import { PsicoEntryForm } from './PsicoEntryForm';
import { PsicoEntryList } from './PsicoEntryList';

export function PsicotradingTab() {
  const { entries, createEntry, updateEntry, deleteEntry, isLoaded } = usePsicoEntries();

  if (!isLoaded) return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-2xl border border-gray-100 bg-white/50 p-8 text-center dark:border-gray-800/50 dark:bg-gray-900/20">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your journal...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12 pb-12">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-400">
              New Journal Entry
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Document your psychological state before, during, and after trades.
            </p>
          </div>
        </div>
        
        <div className="rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-xl p-4 sm:p-8 shadow-sm dark:border-gray-800/80 dark:bg-gray-900/50">
          <PsicoEntryForm 
            onSubmit={(data) => {
              createEntry(data);
              setTimeout(() => {
                document.getElementById('recent-entries')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }} 
          />
        </div>
      </section>

      {entries.length > 0 && (
        <section id="recent-entries" className="scroll-mt-8 space-y-6">
           <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <span className="text-primary-500">📖</span> Recent Entries
             </h2>
             <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 ring-1 ring-primary-500/20">
               {entries.length} entries
             </span>
           </div>
           
           <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/50 dark:bg-gray-900/20 md:p-6">
             <PsicoEntryList 
               entries={entries} 
               onUpdate={updateEntry} 
               onDelete={deleteEntry} 
             />
           </div>
        </section>
      )}
    </div>
  );
}
