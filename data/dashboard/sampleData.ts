// ── Account Summary ─────────────────────────────────────────────────────────
export interface AccountSummary {
  totalBalance: string;
  totalPnl: string;
  totalPnlPercent: number;
  winRate: string;
  totalTrades: number;
  avgRrr: string;
  profitFactor: string;
}

export const accountSummary: AccountSummary = {
  totalBalance: '$128,450.32',
  totalPnl: '+$12,340.50',
  totalPnlPercent: 10.62,
  winRate: '64.3%',
  totalTrades: 284,
  avgRrr: '1:2.4',
  profitFactor: '1.87',
};

// ── P&L Bar Chart Data ──────────────────────────────────────────────────────
export interface PnlBarData {
  label: string;
  value: number;
}

export const pnlBarDataWeekly: PnlBarData[] = [
  { label: 'Mon', value: 420 },
  { label: 'Tue', value: -180 },
  { label: 'Wed', value: 650 },
  { label: 'Thu', value: 320 },
  { label: 'Fri', value: -90 },
  { label: 'Sat', value: 0 },
  { label: 'Sun', value: 0 },
];

export const pnlBarDataMonthly: PnlBarData[] = [
  { label: 'Jan', value: 2400 },
  { label: 'Feb', value: -800 },
  { label: 'Mar', value: 3200 },
  { label: 'Apr', value: 1200 },
  { label: 'May', value: -1500 },
  { label: 'Jun', value: 4100 },
  { label: 'Jul', value: 2800 },
  { label: 'Aug', value: -600 },
  { label: 'Sep', value: 3500 },
  { label: 'Oct', value: 1900 },
  { label: 'Nov', value: -400 },
  { label: 'Dec', value: 2100 },
];

// ── Equity Curve (Area Chart) ───────────────────────────────────────────────
export interface EquityCurvePoint {
  date: string;
  equity: number;
}

export const equityCurveData: EquityCurvePoint[] = [
  { date: 'Jan', equity: 100000 },
  { date: 'Feb', equity: 102400 },
  { date: 'Mar', equity: 101600 },
  { date: 'Apr', equity: 104800 },
  { date: 'May', equity: 106000 },
  { date: 'Jun', equity: 104500 },
  { date: 'Jul', equity: 108600 },
  { date: 'Aug', equity: 111400 },
  { date: 'Sep', equity: 110800 },
  { date: 'Oct', equity: 114300 },
  { date: 'Nov', equity: 116200 },
  { date: 'Dec', equity: 118500 },
  { date: 'Jan', equity: 120900 },
  { date: 'Feb', equity: 123400 },
  { date: 'Mar', equity: 121800 },
  { date: 'Apr', equity: 125600 },
  { date: 'May', equity: 128450 },
];

// ── Trading Objectives ──────────────────────────────────────────────────────
export interface TradingObjective {
  label: string;
  value: string;
  target: string;
  progress: number;
  status: 'on-track' | 'at-risk' | 'exceeded';
}

export const tradingObjectives: TradingObjective[] = [
  { label: 'Daily Loss Limit', value: '-$420', target: '-$2,000', progress: 21, status: 'on-track' },
  { label: 'Max Drawdown', value: '4.2%', target: '10%', progress: 42, status: 'on-track' },
  { label: 'Min Trading Days', value: '18', target: '20', progress: 90, status: 'on-track' },
  { label: 'Profit Target', value: '$12,340', target: '$15,000', progress: 82, status: 'on-track' },
  { label: 'Win Rate Target', value: '64.3%', target: '55%', progress: 100, status: 'exceeded' },
  { label: 'Risk per Trade', value: '1.2%', target: '2%', progress: 60, status: 'on-track' },
];

// ── Trading History ─────────────────────────────────────────────────────────
export enum DashboardTradeDirection {
  Long = 'long',
  Short = 'short',
}

export enum TradeStatus {
  Closed = 'closed',
  Open = 'open',
}

export interface Trade {
  id: string;
  symbol: string;
  direction: DashboardTradeDirection;
  entryPrice: string;
  exitPrice: string;
  pnl: string;
  pnlPercent: number;
  date: string;
  duration: string;
  status: TradeStatus;
  riskReward: string;
}

export const tradeHistory: Trade[] = [
  { id: 'T-001', symbol: 'BTC/USD', direction: DashboardTradeDirection.Long, entryPrice: '65,200.00', exitPrice: '67,432.10', pnl: '+$2,232.10', pnlPercent: 3.42, date: 'Mar 5, 2026', duration: '4h 32m', status: TradeStatus.Closed, riskReward: '1:2.8' },
  { id: 'T-002', symbol: 'ETH/USD', direction: DashboardTradeDirection.Short, entryPrice: '3,580.00', exitPrice: '3,521.45', pnl: '+$585.50', pnlPercent: 1.64, date: 'Mar 5, 2026', duration: '2h 15m', status: TradeStatus.Closed, riskReward: '1:1.9' },
  { id: 'T-003', symbol: 'SOL/USD', direction: DashboardTradeDirection.Long, entryPrice: '172.30', exitPrice: '178.92', pnl: '+$662.00', pnlPercent: 3.84, date: 'Mar 4, 2026', duration: '6h 45m', status: TradeStatus.Closed, riskReward: '1:3.2' },
  { id: 'T-004', symbol: 'AAPL', direction: DashboardTradeDirection.Long, entryPrice: '191.50', exitPrice: '189.25', pnl: '-$225.00', pnlPercent: -1.18, date: 'Mar 4, 2026', duration: '1d 2h', status: TradeStatus.Closed, riskReward: '1:0.6' },
  { id: 'T-005', symbol: 'TSLA', direction: DashboardTradeDirection.Short, entryPrice: '242.80', exitPrice: '248.30', pnl: '-$550.00', pnlPercent: -2.27, date: 'Mar 3, 2026', duration: '8h 10m', status: TradeStatus.Closed, riskReward: '1:0.4' },
  { id: 'T-006', symbol: 'BTC/USD', direction: DashboardTradeDirection.Long, entryPrice: '66,800.00', exitPrice: '\u2014', pnl: '+$632.10', pnlPercent: 0.95, date: 'Mar 6, 2026', duration: '\u2014', status: TradeStatus.Open, riskReward: '\u2014' },
  { id: 'T-007', symbol: 'ETH/USD', direction: DashboardTradeDirection.Long, entryPrice: '3,490.00', exitPrice: '3,540.20', pnl: '+$502.00', pnlPercent: 1.44, date: 'Mar 3, 2026', duration: '5h 22m', status: TradeStatus.Closed, riskReward: '1:2.1' },
  { id: 'T-008', symbol: 'SOL/USD', direction: DashboardTradeDirection.Short, entryPrice: '181.40', exitPrice: '176.90', pnl: '+$450.00', pnlPercent: 2.48, date: 'Mar 2, 2026', duration: '3h 18m', status: TradeStatus.Closed, riskReward: '1:2.5' },
  { id: 'T-009', symbol: 'AAPL', direction: DashboardTradeDirection.Long, entryPrice: '187.60', exitPrice: '190.30', pnl: '+$270.00', pnlPercent: 1.44, date: 'Mar 2, 2026', duration: '1d 4h', status: TradeStatus.Closed, riskReward: '1:1.8' },
  { id: 'T-010', symbol: 'TSLA', direction: DashboardTradeDirection.Long, entryPrice: '238.50', exitPrice: '245.70', pnl: '+$720.00', pnlPercent: 3.02, date: 'Mar 1, 2026', duration: '6h 55m', status: TradeStatus.Closed, riskReward: '1:2.6' },
];
