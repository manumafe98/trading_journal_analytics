// ── Trade Journal Entry Interface ─────────────────────────────────────────────
// Field names translated from Spanish originals:
// Fecha → date, Hora Ejecucion → executionTime, Activo → asset/pair,
// Direccion → direction, Estilo → style, Estrategia → strategy,
// Riesgo → risk, Resultado → result, P&L → pnl, Comision → commission,
// Duracion → duration, RR → riskReward

export enum TradeResult {
  TakeProfit = 'Take Profit',
  StopLoss = 'Stop Loss',
  BreakEven = 'Break Even',
}

export enum TradeDirection {
  Long = 'LONG',
  Short = 'SHORT',
}

export enum TradeStyle {
  Scalping = 'SCALPING',
  Day = 'DAY',
  Swing = 'SWING',
}

export enum StreakType {
  Win = 'win',
  Loss = 'loss',
  None = 'none',
}

export interface JournalTrade {
  id: string;
  date: string;            // Original: Fecha — ISO date string "YYYY-MM-DD"
  executionTime: string;   // Original: Hora Ejecucion — "HHmm" or "HH:mm" format (Argentina UTC-3)
  pair: string;            // Original: Activo — e.g. "AUD/NZD"
  direction: TradeDirection; // Original: Direccion
  style: TradeStyle;       // Original: Estilo
  strategy: string;        // Original: Estrategia — e.g. "BLUE", "RED", "GREEN"
  risk: number;            // Original: Riesgo — percentage e.g. 1.0 = 1%
  result: TradeResult;     // Original: Resultado
  pnl: number | null;      // Original: P&L — in dollars, null if missing
  commission: number;      // Original: Comision — in dollars
  swap: number;            // Original: Swap — overnight fees/credit in dollars
  duration: string;        // Original: Duracion — "Xh Ym" format
  riskReward: number;      // Original: RR — e.g. 2.5 means 1:2.5
}

// ── Analytics Output Interfaces ──────────────────────────────────────────────

export interface GeneralSummary {
  total_trades: number;
  total_wins: number;
  total_losses: number;
  total_break_even: number;
  win_rate: number;
  average_rr: number;
  total_net_pnl: number;
  average_pnl_per_trade: number;
  largest_win: number;
  largest_loss: number;
  average_duration_minutes: number;
  profit_factor: number;
}

export interface StreaksData {
  longest_win_streak: number;
  longest_loss_streak: number;
  current_streak: {
    type: StreakType;
    count: number;
  };
}

export interface PairStats {
  pair: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
  low_sample?: boolean;
}

export interface CurrencyStats {
  currency: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  low_sample?: boolean;
}

export interface DayStats {
  day: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
}

export interface HourStats {
  hour: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  low_sample?: boolean;
}

export interface SessionStats {
  session: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
}

export interface StyleStats {
  style: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
  average_duration_minutes: number;
}

export interface StrategyStats {
  strategy: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
}

export interface DirectionStats {
  direction: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
  average_rr: number;
}

export interface RiskLevelStats {
  risk_level: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
}

export interface RiskAnalysis {
  average_risk_percent: number;
  by_risk_level: RiskLevelStats[];
}

export interface MonthStats {
  month: string;
  total_trades: number;
  win_rate: number;
  net_pnl: number;
}

export interface MonthlyPerformance {
  data: MonthStats[];
  best_month: MonthStats;
  worst_month: MonthStats;
}

export interface CommissionImpact {
  total_commissions: number;
  percent_of_gross_pnl: number;
  average_commission_per_trade: number;
}

export interface SwapImpact {
  total_swap: number;
  percent_of_gross_pnl: number;
  average_swap_per_trade: number;
}

export interface AnalyticsSection<T> {
  data: T;
  summary: string;
}

export interface FullAnalytics {
  general_summary: AnalyticsSection<GeneralSummary>;
  streaks: AnalyticsSection<StreaksData>;
  best_pairs: AnalyticsSection<PairStats[]>;
  worst_pairs: AnalyticsSection<PairStats[]>;
  best_currencies: AnalyticsSection<CurrencyStats[]>;
  worst_currencies: AnalyticsSection<CurrencyStats[]>;
  best_days: AnalyticsSection<DayStats[]>;
  worst_days: AnalyticsSection<DayStats[]>;
  best_hours: AnalyticsSection<HourStats[]>;
  worst_hours: AnalyticsSection<HourStats[]>;
  sessions: AnalyticsSection<SessionStats[]>;
  styles: AnalyticsSection<StyleStats[]>;
  strategies: AnalyticsSection<StrategyStats[]>;
  direction: AnalyticsSection<DirectionStats[]>;
  risk_analysis: AnalyticsSection<RiskAnalysis>;
  monthly_performance: AnalyticsSection<MonthlyPerformance>;
  commission_impact: AnalyticsSection<CommissionImpact>;
  swap_impact: AnalyticsSection<SwapImpact>;
}

// ── Psicotrading Data Model ────────────────────────────────────────────────
export interface PsicoEntry {
  id: string;                  // uuid
  createdAt: Date | string;    // depending on serialization it might be a string
  updatedAt: Date | string;
  linkedTradeId?: string;      // optional, can be set later

  // Section A — Before opening the chart
  emotionBeforeChart: string;

  // Section C — Before executing the trade
  emotionBeforeExecution: string;
  scenarioWaitingFor: string;
  feelingWhileWaiting: string;
  intensityBeforeExecution: number; // 1–10
  physicalSensationsBeforeExecution: string;

  // Section D — During the trade
  emotionDuringTrade: string;
  intensityDuringTrade: number;     // 1–10
  physicalSensationsDuringTrade: string;
  experiencingHope: string;
  regretBeingInTrade: string;

  // Section E — After closing the trade
  emotionAfterTrade: string;
  intensityAfterTrade: number;      // 1–10
  changedPlan: string;
  physicalSensationsAfterTrade: string;
  whatDidWell: string;
  whatCouldImprove: string;
}
