export interface Account {
    id: string;
    name: string;
    initialCapital: number;
    currency: string;
    createdAt: string;
}

export type TradeSide = 'Buy' | 'Sell';
export type TradeStatus = 'won' | 'lost' | 'open';
export type AssetClass = 'Stock' | 'Crypto' | 'Forex' | 'Futures' | 'Options' | 'Other';
export type TradeResult = 'TP' | 'SL' | 'BE';
export type TradeStyle = 'DAY' | 'SWING' | 'SCALP';
export type TradeSession = 'Asia' | 'London' | 'New York' | 'Other';

export interface Trade {
    id: string;
    accountId: string;
    symbol: string;
    assetClass: AssetClass;
    side: TradeSide;
    entryPrice: number;
    exitPrice: number | null;
    quantity: number;
    entryDate: string;
    exitDate: string | null;
    pnl: number;
    pnlPercent: number;
    stopLoss?: number;
    takeProfit?: number;
    notes?: string;
    status: TradeStatus;

    // ── Extended fields (from Notion PDF or manual) ──
    strategy?: string;        // e.g. 'Red', 'Blue', 'ICT'
    rrObtained?: number;      // actual R:R achieved, e.g. 1.25
    result?: TradeResult;     // 'TP' | 'SL' | 'BE'
    riskPercent?: number;     // % of account risked, e.g. 2.5
    riskUsd?: number;         // risk in USD, e.g. 200
    style?: TradeStyle;       // 'DAY' | 'SWING' | 'SCALP'
    session?: TradeSession;   // 'Asia' | 'London' | 'New York' | 'Other'
    entryTime?: string;       // 'HH:mm'
    feelingNotes?: string;    // ¿Cómo me siento?
    errorNotes?: string;      // Errores/Revisión
    executionNotes?: string;  // ¿Ejecución?
    source?: 'manual' | 'pdf';

    // ── Notion Table columns ──
    executable?: boolean;          // Ejecutable — is the trade setup valid?
    htfDirection?: 'Long' | 'Short' | 'Neutral'; // Dirección HTF
    ltfDirection?: 'Long' | 'Short' | 'Neutral'; // Dirección LTF
    pullback?: boolean;            // Pullback occurrence
    entryType?: string;            // Entrada — e.g. 'OB', 'BOS', 'FVG'
    targetPrice?: number;          // Target price level
    targetMax?: number;            // Target Max — highest level reached
    targetMaxFinal?: number;       // Target Max Final
    proud?: boolean;               // Orgulloso — proud of the trade?
    wouldReenter?: boolean;        // ¿Volvería a entrar?
    howContinued?: string;         // ¿Cómo siguió el precio?
    management?: string;           // Gestión — management notes
    correctManagement?: boolean;   // Gestión Correcta
    againstChecklist?: string;     // En contra/Checklist — what went against plan
}

export interface JournalStore {
    accounts: Account[];
    trades: Trade[];
}
