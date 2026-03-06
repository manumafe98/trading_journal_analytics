import { JournalTrade } from './types';

/**
 * Dummy trade journal data for development and testing.
 *
 * In production, this will be loaded from:
 * - PDF uploads parsed from trading journals
 * - Manual entries from the journaling tab (TODO: implement journaling tab)
 *
 * Original field names were in Spanish and have been translated:
 * Fecha → date, Hora Ejecucion → executionTime, Activo → pair,
 * Direccion → direction, Estilo → style, Estrategia → strategy,
 * Riesgo → risk, Resultado → result, Comision → commission,
 * Duracion → duration, RR → riskReward
 */
export const sampleTrades: JournalTrade[] = [
  // ── January 2026 ──────────────────────────────────────────────────────
  { id: 'T-001', date: '2026-01-05', executionTime: '0930', pair: 'EUR/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 120.50,  commission: 3.20, swap: 0,      duration: '0h 45m', riskReward: 2.1 },
  { id: 'T-002', date: '2026-01-06', executionTime: '1045', pair: 'GBP/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'RED',   risk: 1.5, result: 'Stop Loss',   pnl: -180.00, commission: 4.50, swap: 0,      duration: '3h 20m', riskReward: 0.0 },
  { id: 'T-003', date: '2026-01-07', executionTime: '0800', pair: 'AUD/NZD', direction: 'LONG',  style: 'SCALPING', strategy: 'GREEN', risk: 0.5, result: 'Take Profit', pnl: 65.00,   commission: 2.10, swap: 0,      duration: '0h 30m', riskReward: 2.5 },
  { id: 'T-004', date: '2026-01-08', executionTime: '1400', pair: 'USD/CAD', direction: 'SHORT', style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 95.30,   commission: 3.00, swap: 0,      duration: '2h 15m', riskReward: 1.8 },
  { id: 'T-005', date: '2026-01-09', executionTime: '1130', pair: 'EUR/GBP', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 1.0, result: 'Stop Loss',   pnl: -110.00, commission: 3.50, swap: 0,      duration: '1h 10m', riskReward: 0.0 },
  { id: 'T-006', date: '2026-01-12', executionTime: '1600', pair: 'NZD/USD', direction: 'SHORT', style: 'SWING',    strategy: 'GREEN', risk: 2.0, result: 'Take Profit', pnl: 310.00,  commission: 5.00, swap: -12.50, duration: '18h 30m', riskReward: 3.1 },
  { id: 'T-007', date: '2026-01-13', executionTime: '0715', pair: 'EUR/USD', direction: 'SHORT', style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 88.00,   commission: 3.20, swap: 0,      duration: '0h 25m', riskReward: 1.7 },
  { id: 'T-008', date: '2026-01-14', executionTime: '1200', pair: 'GBP/USD', direction: 'LONG',  style: 'DAY',      strategy: 'RED',   risk: 1.5, result: 'Stop Loss',   pnl: -220.00, commission: 4.80, swap: 0,      duration: '4h 50m', riskReward: 0.0 },
  { id: 'T-009', date: '2026-01-15', executionTime: '0845', pair: 'AUD/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'GREEN', risk: 0.5, result: 'Break Even',  pnl: 0,       commission: 2.50, swap: 0,      duration: '0h 55m', riskReward: 0.0 },
  { id: 'T-010', date: '2026-01-16', executionTime: '1530', pair: 'USD/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 145.00,  commission: 3.80, swap: 0,      duration: '2h 40m', riskReward: 2.8 },

  // ── February 2026 ─────────────────────────────────────────────────────
  { id: 'T-011', date: '2026-02-02', executionTime: '1100', pair: 'EUR/USD', direction: 'LONG',  style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 175.00,  commission: 3.20, swap: 0,      duration: '3h 10m', riskReward: 2.3 },
  { id: 'T-012', date: '2026-02-03', executionTime: '0630', pair: 'GBP/JPY', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 1.5, result: 'Take Profit', pnl: 230.00,  commission: 4.50, swap: 0,      duration: '0h 40m', riskReward: 2.0 },
  { id: 'T-013', date: '2026-02-04', executionTime: '1300', pair: 'AUD/NZD', direction: 'SHORT', style: 'DAY',      strategy: 'GREEN', risk: 1.0, result: 'Stop Loss',   pnl: -95.00,  commission: 2.10, swap: 0,      duration: '2h 55m', riskReward: 0.0 },
  { id: 'T-014', date: '2026-02-05', executionTime: '0900', pair: 'EUR/GBP', direction: 'SHORT', style: 'SCALPING', strategy: 'BLUE',  risk: 0.5, result: 'Take Profit', pnl: 55.00,   commission: 2.80, swap: 0,      duration: '0h 20m', riskReward: 2.2 },
  { id: 'T-015', date: '2026-02-06', executionTime: '1445', pair: 'USD/CAD', direction: 'LONG',  style: 'DAY',      strategy: 'RED',   risk: 1.0, result: 'Stop Loss',   pnl: -130.00, commission: 3.00, swap: 0,      duration: '3h 35m', riskReward: 0.0 },
  { id: 'T-016', date: '2026-02-09', executionTime: '1030', pair: 'NZD/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'GREEN', risk: 1.0, result: 'Take Profit', pnl: 105.00,  commission: 3.40, swap: 0,      duration: '0h 35m', riskReward: 2.0 },
  { id: 'T-017', date: '2026-02-10', executionTime: '1800', pair: 'GBP/USD', direction: 'SHORT', style: 'SWING',    strategy: 'BLUE',  risk: 2.0, result: 'Take Profit', pnl: 420.00,  commission: 5.50, swap: -15.80, duration: '22h 10m', riskReward: 3.5 },
  { id: 'T-018', date: '2026-02-11', executionTime: '0745', pair: 'EUR/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 1.0, result: 'Take Profit', pnl: 92.00,   commission: 3.20, swap: 0,      duration: '0h 28m', riskReward: 1.8 },
  { id: 'T-019', date: '2026-02-12', executionTime: '1215', pair: 'USD/JPY', direction: 'LONG',  style: 'DAY',      strategy: 'GREEN', risk: 1.5, result: 'Stop Loss',   pnl: -185.00, commission: 3.80, swap: 0,      duration: '4h 15m', riskReward: 0.0 },
  { id: 'T-020', date: '2026-02-13', executionTime: '0520', pair: 'AUD/NZD', direction: 'LONG',  style: 'SCALPING', strategy: 'BLUE',  risk: 0.5, result: 'Take Profit', pnl: 72.00,   commission: 2.10, swap: 0,      duration: '0h 50m', riskReward: 2.8 },

  // ── March 2026 ────────────────────────────────────────────────────────
  { id: 'T-021', date: '2026-03-02', executionTime: '1100', pair: 'EUR/USD', direction: 'SHORT', style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 160.00,  commission: 3.20, swap: 0,      duration: '2h 50m', riskReward: 2.4 },
  { id: 'T-022', date: '2026-03-02', executionTime: '1430', pair: 'GBP/JPY', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 1.5, result: 'Stop Loss',   pnl: -200.00, commission: 4.50, swap: 0,      duration: '1h 05m', riskReward: 0.0 },
  { id: 'T-023', date: '2026-03-03', executionTime: '0830', pair: 'AUD/NZD', direction: 'LONG',  style: 'SCALPING', strategy: 'GREEN', risk: 1.0, result: 'Take Profit', pnl: 85.00,   commission: 2.10, swap: 0,      duration: '0h 42m', riskReward: 1.7 },
  { id: 'T-024', date: '2026-03-03', executionTime: '1300', pair: 'USD/CAD', direction: 'SHORT', style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 112.00,  commission: 3.00, swap: 0,      duration: '2h 30m', riskReward: 2.1 },
  { id: 'T-025', date: '2026-03-04', executionTime: '0700', pair: 'EUR/GBP', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 0.5, result: 'Break Even',  pnl: 0,       commission: 2.80, swap: 0,      duration: '0h 15m', riskReward: 0.0 },
  { id: 'T-026', date: '2026-03-04', executionTime: '1130', pair: 'NZD/USD', direction: 'SHORT', style: 'DAY',      strategy: 'GREEN', risk: 1.0, result: 'Stop Loss',   pnl: -88.00,  commission: 3.40, swap: 0,      duration: '3h 00m', riskReward: 0.0 },
  { id: 'T-027', date: '2026-03-04', executionTime: '1600', pair: 'GBP/USD', direction: 'LONG',  style: 'SWING',    strategy: 'BLUE',  risk: 2.0, result: 'Take Profit', pnl: 380.00,  commission: 5.50, swap: -11.20, duration: '20h 45m', riskReward: 3.2 },
  { id: 'T-028', date: '2026-03-05', executionTime: '0915', pair: 'EUR/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 1.0, result: 'Take Profit', pnl: 135.00,  commission: 3.20, swap: 0,      duration: '0h 38m', riskReward: 2.6 },
  { id: 'T-029', date: '2026-03-05', executionTime: '1345', pair: 'USD/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'GREEN', risk: 1.5, result: 'Take Profit', pnl: 210.00,  commission: 3.80, swap: 0,      duration: '2h 20m', riskReward: 2.3 },
  { id: 'T-030', date: '2026-03-05', executionTime: '1700', pair: 'AUD/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Stop Loss',   pnl: -75.00,  commission: 2.50, swap: 0,      duration: '0h 22m', riskReward: 0.0 },

  // ── More variety for better analytics ─────────────────────────────────
  { id: 'T-031', date: '2026-01-19', executionTime: '2100', pair: 'AUD/JPY', direction: 'LONG',  style: 'SWING',    strategy: 'GREEN', risk: 2.0, result: 'Take Profit', pnl: 350.00,  commission: 5.00, swap: 4.20,   duration: '16h 20m', riskReward: 2.9 },
  { id: 'T-032', date: '2026-01-20', executionTime: '0600', pair: 'EUR/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'RED',   risk: 1.0, result: 'Stop Loss',   pnl: -140.00, commission: 4.00, swap: 0,      duration: '5h 10m', riskReward: 0.0 },
  { id: 'T-033', date: '2026-01-21', executionTime: '1030', pair: 'GBP/AUD', direction: 'LONG',  style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 98.00,   commission: 3.60, swap: 0,      duration: '0h 33m', riskReward: 1.9 },
  { id: 'T-034', date: '2026-01-22', executionTime: '1500', pair: 'NZD/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'GREEN', risk: 1.5, result: 'Take Profit', pnl: 195.00,  commission: 4.20, swap: 0,      duration: '3h 45m', riskReward: 2.1 },
  { id: 'T-035', date: '2026-01-23', executionTime: '0845', pair: 'EUR/AUD', direction: 'LONG',  style: 'SCALPING', strategy: 'RED',   risk: 0.5, result: 'Stop Loss',   pnl: -42.00,  commission: 2.90, swap: 0,      duration: '0h 18m', riskReward: 0.0 },
  { id: 'T-036', date: '2026-02-16', executionTime: '1200', pair: 'GBP/NZD', direction: 'SHORT', style: 'DAY',      strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 168.00,  commission: 4.10, swap: 0,      duration: '2h 55m', riskReward: 2.7 },
  { id: 'T-037', date: '2026-02-17', executionTime: '0530', pair: 'AUD/JPY', direction: 'LONG',  style: 'SCALPING', strategy: 'GREEN', risk: 1.0, result: 'Take Profit', pnl: 115.00,  commission: 3.30, swap: 0,      duration: '0h 45m', riskReward: 2.3 },
  { id: 'T-038', date: '2026-02-18', executionTime: '1400', pair: 'EUR/JPY', direction: 'LONG',  style: 'DAY',      strategy: 'RED',   risk: 1.5, result: 'Break Even',  pnl: 0,       commission: 4.00, swap: 0,      duration: '3h 20m', riskReward: 0.0 },
  { id: 'T-039', date: '2026-02-19', executionTime: '1100', pair: 'USD/CHF', direction: 'SHORT', style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 82.00,   commission: 3.10, swap: 0,      duration: '0h 28m', riskReward: 1.6 },
  { id: 'T-040', date: '2026-02-20', executionTime: '1630', pair: 'CHF/JPY', direction: 'LONG',  style: 'SWING',    strategy: 'GREEN', risk: 2.0, result: 'Stop Loss',   pnl: -280.00, commission: 5.20, swap: -18.40, duration: '14h 50m', riskReward: 0.0 },
  { id: 'T-041', date: '2026-02-23', executionTime: '0915', pair: 'EUR/USD', direction: 'LONG',  style: 'SCALPING', strategy: 'BLUE',  risk: 1.0, result: 'Take Profit', pnl: 102.00,  commission: 3.20, swap: 0,      duration: '0h 32m', riskReward: 2.0 },
  { id: 'T-042', date: '2026-02-24', executionTime: '1330', pair: 'GBP/JPY', direction: 'SHORT', style: 'DAY',      strategy: 'RED',   risk: 1.0, result: 'Take Profit', pnl: 178.00,  commission: 4.50, swap: 0,      duration: '2h 40m', riskReward: 2.9 },
];
