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
    executable?: string;           // Ejecutable — 'Sí' | 'No'
    htfDirection?: string;         // Dirección HTF — 'Long' | 'Short' | 'Lateral'
    ltfDirection?: string;         // Dirección LTF
    pullback?: string;             // Pullback — '0.38' | '0.5' | '0.61' | '0.7'
    entryType?: string;            // Entrada — 'Diagonal 1m' | 'Diagonal 30s' | 'Limit'
    targetPrice?: string;          // Target — texto libre (e.g. 'OB 1.1050')
    targetMax?: string;            // Target Max — texto libre
    targetMaxFinal?: string;       // Target Max Final — 'Sí' | 'No'
    durationText?: string;         // Duración manual — e.g. '2h30m', '45min'
    proud?: string;                // Orgulloso — 'Sí' | 'No'
    wouldReenter?: string;         // ¿Volvería a entrar? — 'Sí' | 'No'
    howContinued?: string;         // ¿Cómo siguió el precio?
    management?: string;           // Gestión
    correctManagement?: string;    // Gestión Correcta — EMA option
    againstChecklist?: string;     // En contra/Checklist
}

export interface JournalStore {
    accounts: Account[];
    trades: Trade[];
}
