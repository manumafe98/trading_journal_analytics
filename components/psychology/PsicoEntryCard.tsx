'use client';

import { PsicoEntry } from '@/data/analytics/types';
import { sampleTrades } from '@/data/analytics/tradeJournalData';
import { format } from 'date-fns';

interface PsicoEntryCardProps {
  entry: PsicoEntry;
  onClick: () => void;
}

export function PsicoEntryCard({ entry, onClick }: PsicoEntryCardProps) {
  // A simple completion logic: check how many fields have content out of the most important 4 sections
  const hasA = entry.emotionBeforeChart.trim() !== '';
  const hasC = entry.emotionBeforeExecution.trim() !== '';
  const hasD = entry.emotionDuringTrade.trim() !== '';
  const hasE = entry.emotionAfterTrade.trim() !== '';
  
  const completedSections = [hasA, hasC, hasD, hasE].filter(Boolean).length;
  const progressPercent = (completedSections / 4) * 100;

  // Find preview text
  const previewText = 
    entry.emotionBeforeChart || 
    entry.emotionBeforeExecution || 
    entry.emotionDuringTrade || 
    entry.emotionAfterTrade || 
    '...';

  // Find linked trade if any
  const linkedTrade = sampleTrades.find(t => t.id === entry.linkedTradeId);

  // Format date safely
  const dateObj = new Date(entry.createdAt);
  const dateStr = isNaN(dateObj.getTime()) ? 'Unknown Date' : format(dateObj, 'MMM d, yyyy HH:mm');

  return (
    <div 
      onClick={onClick}
      className="group relative flex min-w-[280px] sm:min-w-[320px] max-w-[320px] shrink-0 cursor-pointer flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary-400 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-500/50"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {dateStr}
        </span>
        {entry.linkedTradeId ? (
          <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            {linkedTrade ? `${linkedTrade.pair} ${linkedTrade.direction}` : entry.linkedTradeId}
          </span>
        ) : (
          <span className="text-xs text-gray-400 dark:text-gray-600">Unlinked</span>
        )}
      </div>

      <div className="flex-1">
        <p className="line-clamp-3 text-sm text-gray-800 dark:text-gray-200">
          "{previewText}"
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div 
            className="h-full rounded-full bg-primary-500 transition-all" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">
          {completedSections}/4 Sections
        </span>
      </div>
    </div>
  );
}
