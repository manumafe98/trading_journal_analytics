import { JournalTrade } from '@/data/analytics/types';
import { sampleTrades } from '@/data/analytics/tradeJournalData';

interface TradeLinkerProps {
  selectedTradeId?: string;
  onChange: (tradeId: string | undefined) => void;
  className?: string;
}

export function TradeLinker({ selectedTradeId, onChange, className = '' }: TradeLinkerProps) {
  const selectedTrade = sampleTrades.find((t) => t.id === selectedTradeId);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Link to a trade (optional — can be added later)
      </label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <select
          value={selectedTradeId || ''}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="w-full sm:w-64 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="">-- No trade linked --</option>
          {sampleTrades.map((trade) => (
            <option key={trade.id} value={trade.id}>
              {trade.id} - {trade.pair} {trade.direction}
            </option>
          ))}
        </select>
        
        {selectedTradeId && !selectedTrade && (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
            Trade not found
          </span>
        )}
        
        {selectedTrade && (
          <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
            {selectedTrade.pair} • {selectedTrade.direction} • {selectedTrade.date}
          </span>
        )}
      </div>
    </div>
  );
}
