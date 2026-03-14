import {
  JournalTrade,
  FullAnalytics,
  GeneralSummary,
  StreaksData,
  PairStats,
  CurrencyStats,
  DayStats,
  HourStats,
  SessionStats,
  StyleStats,
  StrategyStats,
  DirectionStats,
  RiskAnalysis,
  MonthlyPerformance,
  CommissionImpact,
  SwapImpact,
  TradeResult,
  StreakType,
} from '@/data/analytics/types';

// ── Utility Helpers ──────────────────────────────────────────────────────────

/** Type guard to narrow `pnl` from `number | null` to `number` */
function hasPnl(trade: JournalTrade): trade is JournalTrade & { pnl: number } {
  return trade.pnl !== null;
}

/** Get-or-create helper for Map to avoid non-null assertions */
function getOrCreate<K, V>(map: Map<K, V>, key: K, factory: () => V): V {
  const existing = map.get(key);
  if (existing !== undefined) return existing;
  const value = factory();
  map.set(key, value);
  return value;
}

/** Parse duration string "Xh Ym" to total minutes */
function parseDurationToMinutes(duration: string): number {
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

/** Parse execution time "HHmm" or "HH:mm" to hours and minutes */
function parseExecutionTime(time: string): { hours: number; minutes: number } {
  const cleaned = time.replace(':', '');
  const hours = parseInt(cleaned.substring(0, 2), 10);
  const minutes = parseInt(cleaned.substring(2, 4), 10);
  return { hours, minutes };
}

/** Get day of week name from ISO date string */
function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00'); // noon to avoid timezone issues
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/** Get month label from ISO date string */
function getMonthLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/** Round to N decimal places */
function round(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Determine trading session from Argentina time (UTC-3).
 *
 * TODO: Make this dynamic so users can set their own timezone.
 * Currently hardcoded to Argentina (UTC-3). The session boundaries
 * should be configurable per-user timezone in the future.
 *
 * Session times in UTC:
 * - Asian:          21:00–06:00 UTC → 18:00–03:00 ARG
 * - London:         08:00–17:00 UTC → 05:00–14:00 ARG
 * - New York:       13:00–22:00 UTC → 10:00–19:00 ARG
 * - London/NY Overlap: 13:00–17:00 UTC → 10:00–14:00 ARG
 */
function getSession(argHour: number): string[] {
  const sessions: string[] = [];

  // Asian: 18:00–03:00 ARG time
  if (argHour >= 18 || argHour < 3) {
    sessions.push('Asian');
  }

  // London: 05:00–14:00 ARG time
  if (argHour >= 5 && argHour < 14) {
    sessions.push('London');
  }

  // New York: 10:00–19:00 ARG time
  if (argHour >= 10 && argHour < 19) {
    sessions.push('New York');
  }

  // London/NY Overlap: 10:00–14:00 ARG time
  if (argHour >= 10 && argHour < 14) {
    sessions.push('Overlap');
  }

  return sessions.length > 0 ? sessions : ['Off-Hours'];
}

/** Win rate calculation excluding break even trades */
function calcWinRate(trades: JournalTrade[]): number {
  const eligible = trades.filter(({ result }) => result !== TradeResult.BreakEven);
  if (eligible.length === 0) return 0;
  const wins = eligible.filter(({ result }) => result === TradeResult.TakeProfit).length;
  return round((wins / eligible.length) * 100, 1);
}

// ── Section Computations ─────────────────────────────────────────────────────

function computeGeneralSummary(trades: JournalTrade[]): GeneralSummary {
  const wins = trades.filter(({ result }) => result === TradeResult.TakeProfit);
  const losses = trades.filter(({ result }) => result === TradeResult.StopLoss);
  const breakEvens = trades.filter(({ result }) => result === TradeResult.BreakEven);

  const eligible = trades.filter(({ result }) => result !== TradeResult.BreakEven);
  const winRate = eligible.length > 0 ? round((wins.length / eligible.length) * 100, 1) : 0;

  const pnlTrades = trades.filter(hasPnl);
  const totalGrossPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0);
  const totalCommissions = trades.reduce((sum, { commission }) => sum + commission, 0);
  const totalNetPnl = totalGrossPnl - totalCommissions;

  const avgPnl = pnlTrades.length > 0 ? round(totalNetPnl / pnlTrades.length) : 0;

  const pnlValues = pnlTrades.map(({ pnl }) => pnl);
  const largestWin = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
  const largestLoss = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;

  const durations = trades.map(({ duration }) => parseDurationToMinutes(duration));
  const avgDuration = durations.length > 0 ? round(durations.reduce((a, b) => a + b, 0) / durations.length, 0) : 0;

  const avgRR = trades.length > 0
    ? round(trades.reduce((sum, { riskReward }) => sum + riskReward, 0) / trades.length, 2)
    : 0;

  const grossWins = wins.reduce((sum, { pnl }) => sum + (pnl ?? 0), 0);
  const grossLosses = Math.abs(losses.reduce((sum, { pnl }) => sum + (pnl ?? 0), 0));
  const profitFactor = grossLosses > 0 ? round(grossWins / grossLosses, 2) : 0;

  return {
    total_trades: trades.length,
    total_wins: wins.length,
    total_losses: losses.length,
    total_break_even: breakEvens.length,
    win_rate: winRate,
    average_rr: avgRR,
    total_net_pnl: round(totalNetPnl),
    average_pnl_per_trade: avgPnl,
    largest_win: largestWin,
    largest_loss: largestLoss,
    average_duration_minutes: avgDuration,
    profit_factor: profitFactor,
  };
}

function computeStreaks(trades: JournalTrade[]): StreaksData {
  // Sort chronologically
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date));

  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  for (const { result } of sorted) {
    if (result === TradeResult.TakeProfit) {
      currentWinStreak++;
      currentLossStreak = 0;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else if (result === TradeResult.StopLoss) {
      currentLossStreak++;
      currentWinStreak = 0;
      longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
    }
    // Break Even does not break streaks
  }

  const currentStreak = currentWinStreak > 0
    ? { type: StreakType.Win, count: currentWinStreak }
    : currentLossStreak > 0
      ? { type: StreakType.Loss, count: currentLossStreak }
      : { type: StreakType.None, count: 0 };

  return {
    longest_win_streak: longestWinStreak,
    longest_loss_streak: longestLossStreak,
    current_streak: currentStreak,
  };
}

function computePairStats(trades: JournalTrade[]): { best: PairStats[]; worst: PairStats[] } {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    getOrCreate(groups, t.pair, () => []).push(t);
  }

  const stats: PairStats[] = [];
  for (const [pair, pairTrades] of groups) {
    const pnlTrades = pairTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - pairTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(pairTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / pairTrades.length, 2);

    stats.push({
      pair,
      total_trades: pairTrades.length,
      win_rate: calcWinRate(pairTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
      low_sample: pairTrades.length < 3 ? true : undefined,
    });
  }

  const sorted = [...stats].sort((a, b) => b.net_pnl - a.net_pnl);
  return {
    best: sorted.slice(0, 5),
    worst: [...sorted].reverse().slice(0, 5),
  };
}

function computeCurrencyStats(trades: JournalTrade[]): { best: CurrencyStats[]; worst: CurrencyStats[] } {
  const groups = new Map<string, JournalTrade[]>();

  for (const t of trades) {
    const [base, quote] = t.pair.split('/');
    if (base) {
      getOrCreate(groups, base, () => []).push(t);
    }
    if (quote) {
      getOrCreate(groups, quote, () => []).push(t);
    }
  }

  const stats: CurrencyStats[] = [];
  for (const [currency, currTrades] of groups) {
    const pnlTrades = currTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - currTrades.reduce((sum, { commission }) => sum + commission, 0);

    stats.push({
      currency,
      total_trades: currTrades.length,
      win_rate: calcWinRate(currTrades),
      net_pnl: round(netPnl),
      low_sample: currTrades.length < 3 ? true : undefined,
    });
  }

  const sorted = [...stats].sort((a, b) => b.net_pnl - a.net_pnl);
  return {
    best: sorted.slice(0, 5),
    worst: [...sorted].reverse().slice(0, 5),
  };
}

function computeDayStats(trades: JournalTrade[]): { best: DayStats[]; worst: DayStats[] } {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    const day = getDayOfWeek(t.date);
    getOrCreate(groups, day, () => []).push(t);
  }

  const stats: DayStats[] = [];
  for (const [day, dayTrades] of groups) {
    const pnlTrades = dayTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - dayTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(dayTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / dayTrades.length, 2);

    stats.push({
      day,
      total_trades: dayTrades.length,
      win_rate: calcWinRate(dayTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
    });
  }

  const sortedBest = [...stats].sort((a, b) => b.win_rate - a.win_rate || b.net_pnl - a.net_pnl);
  const sortedWorst = [...stats].sort((a, b) => a.win_rate - b.win_rate || a.net_pnl - b.net_pnl);
  return { best: sortedBest, worst: sortedWorst };
}

function computeHourStats(trades: JournalTrade[]): { best: HourStats[]; worst: HourStats[] } {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    const { hours } = parseExecutionTime(t.executionTime);
    const hourLabel = `${hours.toString().padStart(2, '0')}:00`;
    getOrCreate(groups, hourLabel, () => []).push(t);
  }

  const stats: HourStats[] = [];
  for (const [hour, hourTrades] of groups) {
    const pnlTrades = hourTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - hourTrades.reduce((sum, { commission }) => sum + commission, 0);

    stats.push({
      hour,
      total_trades: hourTrades.length,
      win_rate: calcWinRate(hourTrades),
      net_pnl: round(netPnl),
      low_sample: hourTrades.length < 3 ? true : undefined,
    });
  }

  const sorted = [...stats].sort((a, b) => b.win_rate - a.win_rate || b.net_pnl - a.net_pnl);
  return {
    best: sorted.slice(0, 5),
    worst: [...sorted].reverse().slice(0, 5),
  };
}

function computeSessionStats(trades: JournalTrade[]): SessionStats[] {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    const { hours } = parseExecutionTime(t.executionTime);
    const sessions = getSession(hours);
    for (const session of sessions) {
      getOrCreate(groups, session, () => []).push(t);
    }
  }

  const stats: SessionStats[] = [];
  for (const [session, sessionTrades] of groups) {
    const pnlTrades = sessionTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - sessionTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(sessionTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / sessionTrades.length, 2);

    stats.push({
      session,
      total_trades: sessionTrades.length,
      win_rate: calcWinRate(sessionTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
    });
  }

  return stats.sort((a, b) => b.net_pnl - a.net_pnl);
}

function computeStyleStats(trades: JournalTrade[]): StyleStats[] {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    getOrCreate(groups, t.style, () => []).push(t);
  }

  const stats: StyleStats[] = [];
  for (const [style, styleTrades] of groups) {
    const pnlTrades = styleTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - styleTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(styleTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / styleTrades.length, 2);
    const durations = styleTrades.map(({ duration }) => parseDurationToMinutes(duration));
    const avgDuration = round(durations.reduce((a, b) => a + b, 0) / durations.length, 0);

    stats.push({
      style,
      total_trades: styleTrades.length,
      win_rate: calcWinRate(styleTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
      average_duration_minutes: avgDuration,
    });
  }

  return stats.sort((a, b) => b.net_pnl - a.net_pnl);
}

function computeStrategyStats(trades: JournalTrade[]): StrategyStats[] {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    getOrCreate(groups, t.strategy, () => []).push(t);
  }

  const stats: StrategyStats[] = [];
  for (const [strategy, stratTrades] of groups) {
    const pnlTrades = stratTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - stratTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(stratTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / stratTrades.length, 2);

    stats.push({
      strategy,
      total_trades: stratTrades.length,
      win_rate: calcWinRate(stratTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
    });
  }

  return stats.sort((a, b) => b.net_pnl - a.net_pnl);
}

function computeDirectionStats(trades: JournalTrade[]): DirectionStats[] {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    getOrCreate(groups, t.direction, () => []).push(t);
  }

  const stats: DirectionStats[] = [];
  for (const [direction, dirTrades] of groups) {
    const pnlTrades = dirTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - dirTrades.reduce((sum, { commission }) => sum + commission, 0);
    const avgRR = round(dirTrades.reduce((sum, { riskReward }) => sum + riskReward, 0) / dirTrades.length, 2);

    stats.push({
      direction,
      total_trades: dirTrades.length,
      win_rate: calcWinRate(dirTrades),
      net_pnl: round(netPnl),
      average_rr: avgRR,
    });
  }

  return stats.sort((a, b) => b.net_pnl - a.net_pnl);
}

function computeRiskAnalysis(trades: JournalTrade[]): RiskAnalysis {
  const avgRisk = round(trades.reduce((sum, { risk }) => sum + risk, 0) / trades.length, 2);

  // Group by risk level
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    const level = `${t.risk}%`;
    getOrCreate(groups, level, () => []).push(t);
  }

  const byRiskLevel: { risk_level: string; total_trades: number; win_rate: number; net_pnl: number }[] = [];
  for (const [level, riskTrades] of groups) {
    const pnlTrades = riskTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - riskTrades.reduce((sum, { commission }) => sum + commission, 0);

    byRiskLevel.push({
      risk_level: level,
      total_trades: riskTrades.length,
      win_rate: calcWinRate(riskTrades),
      net_pnl: round(netPnl),
    });
  }

  return {
    average_risk_percent: avgRisk,
    by_risk_level: byRiskLevel.sort((a, b) => parseFloat(a.risk_level) - parseFloat(b.risk_level)),
  };
}

function computeMonthlyPerformance(trades: JournalTrade[]): MonthlyPerformance {
  const groups = new Map<string, JournalTrade[]>();
  for (const t of trades) {
    const month = getMonthLabel(t.date);
    getOrCreate(groups, month, () => []).push(t);
  }

  const data: { month: string; total_trades: number; win_rate: number; net_pnl: number }[] = [];
  for (const [month, monthTrades] of groups) {
    const pnlTrades = monthTrades.filter(hasPnl);
    const netPnl = pnlTrades.reduce((sum, { pnl }) => sum + pnl, 0) - monthTrades.reduce((sum, { commission }) => sum + commission, 0);

    data.push({
      month,
      total_trades: monthTrades.length,
      win_rate: calcWinRate(monthTrades),
      net_pnl: round(netPnl),
    });
  }

  const sorted = [...data].sort((a, b) => b.net_pnl - a.net_pnl);
  return {
    data,
    best_month: sorted[0],
    worst_month: sorted[sorted.length - 1],
  };
}

function computeCommissionImpact(trades: JournalTrade[]): CommissionImpact {
  const totalCommissions = trades.reduce((sum, { commission }) => sum + commission, 0);
  const grossPnl = trades.filter(hasPnl).reduce((sum, { pnl }) => sum + Math.abs(pnl), 0);
  const percentOfGross = grossPnl > 0 ? round((totalCommissions / grossPnl) * 100, 2) : 0;
  const avgCommission = trades.length > 0 ? round(totalCommissions / trades.length, 2) : 0;

  return {
    total_commissions: round(totalCommissions),
    percent_of_gross_pnl: percentOfGross,
    average_commission_per_trade: avgCommission,
  };
}

function computeSwapImpact(trades: JournalTrade[]): SwapImpact {
  const totalSwap = trades.reduce((sum, { swap }) => sum + swap, 0);
  const grossPnl = trades.filter(hasPnl).reduce((sum, { pnl }) => sum + Math.abs(pnl), 0);
  const percentOfGross = grossPnl > 0 ? round((Math.abs(totalSwap) / grossPnl) * 100, 2) : 0;
  const avgSwap = trades.length > 0 ? round(totalSwap / trades.length, 2) : 0;

  return {
    total_swap: round(totalSwap),
    percent_of_gross_pnl: percentOfGross,
    average_swap_per_trade: avgSwap,
  };
}

// ── Main Entry Point ─────────────────────────────────────────────────────────

export function computeAnalytics(trades: JournalTrade[]): FullAnalytics {
  const generalSummary = computeGeneralSummary(trades);
  const streaks = computeStreaks(trades);
  const pairs = computePairStats(trades);
  const currencies = computeCurrencyStats(trades);
  const days = computeDayStats(trades);
  const hours = computeHourStats(trades);
  const sessions = computeSessionStats(trades);
  const styles = computeStyleStats(trades);
  const strategies = computeStrategyStats(trades);
  const direction = computeDirectionStats(trades);
  const riskAnalysis = computeRiskAnalysis(trades);
  const monthly = computeMonthlyPerformance(trades);
  const commissions = computeCommissionImpact(trades);
  const swap = computeSwapImpact(trades);

  return {
    general_summary: {
      data: generalSummary,
      summary: `${generalSummary.total_trades} trades with a ${generalSummary.win_rate}% win rate and $${generalSummary.total_net_pnl.toFixed(2)} net P&L.`,
    },
    streaks: {
      data: streaks,
      summary: `Longest win streak: ${streaks.longest_win_streak}. Current streak: ${streaks.current_streak.count} ${streaks.current_streak.type}(s).`,
    },
    best_pairs: {
      data: pairs.best,
      summary: pairs.best[0] ? `${pairs.best[0].pair} is your most profitable pair with $${pairs.best[0].net_pnl.toFixed(2)} net P&L.` : 'No pair data available.',
    },
    worst_pairs: {
      data: pairs.worst,
      summary: pairs.worst[0] ? `${pairs.worst[0].pair} has cost you the most with $${pairs.worst[0].net_pnl.toFixed(2)} net P&L.` : 'No pair data available.',
    },
    best_currencies: {
      data: currencies.best,
      summary: currencies.best[0] ? `${currencies.best[0].currency} is your strongest currency with $${currencies.best[0].net_pnl.toFixed(2)} net P&L.` : 'No currency data.',
    },
    worst_currencies: {
      data: currencies.worst,
      summary: currencies.worst[0] ? `${currencies.worst[0].currency} is your weakest currency with $${currencies.worst[0].net_pnl.toFixed(2)} net P&L.` : 'No currency data.',
    },
    best_days: {
      data: days.best,
      summary: days.best[0] ? `${days.best[0].day} is your best day with ${days.best[0].win_rate}% win rate.` : 'No day data.',
    },
    worst_days: {
      data: days.worst,
      summary: days.worst[0] ? `${days.worst[0].day} is your worst day with ${days.worst[0].win_rate}% win rate.` : 'No day data.',
    },
    best_hours: {
      data: hours.best,
      summary: hours.best[0] ? `${hours.best[0].hour} is your most profitable hour with $${hours.best[0].net_pnl.toFixed(2)} net P&L.` : 'No hour data.',
    },
    worst_hours: {
      data: hours.worst,
      summary: hours.worst[0] ? `${hours.worst[0].hour} is your worst hour with $${hours.worst[0].net_pnl.toFixed(2)} net P&L.` : 'No hour data.',
    },
    sessions: {
      data: sessions,
      summary: sessions[0] ? `${sessions[0].session} session is your best with $${sessions[0].net_pnl.toFixed(2)} net P&L.` : 'No session data.',
    },
    styles: {
      data: styles,
      summary: styles[0] ? `${styles[0].style} is your most profitable style with $${styles[0].net_pnl.toFixed(2)} net P&L.` : 'No style data.',
    },
    strategies: {
      data: strategies,
      summary: strategies[0] ? `${strategies[0].strategy} is your best strategy with $${strategies[0].net_pnl.toFixed(2)} net P&L.` : 'No strategy data.',
    },
    direction: {
      data: direction,
      summary: direction[0] ? `${direction[0].direction} trades are more profitable with $${direction[0].net_pnl.toFixed(2)} net P&L.` : 'No direction data.',
    },
    risk_analysis: {
      data: riskAnalysis,
      summary: `Average risk per trade: ${riskAnalysis.average_risk_percent}%. Most used risk level: ${riskAnalysis.by_risk_level.sort((a, b) => b.total_trades - a.total_trades)[0]?.risk_level ?? 'N/A'}.`,
    },
    monthly_performance: {
      data: monthly,
      summary: `Best month: ${monthly.best_month?.month ?? 'N/A'} ($${monthly.best_month?.net_pnl.toFixed(2) ?? '0'}). Worst month: ${monthly.worst_month?.month ?? 'N/A'} ($${monthly.worst_month?.net_pnl.toFixed(2) ?? '0'}).`,
    },
    commission_impact: {
      data: commissions,
      summary: `Total commissions paid: $${commissions.total_commissions.toFixed(2)} (${commissions.percent_of_gross_pnl}% of gross P&L).`,
    },
    swap_impact: {
      data: swap,
      summary: `Total swap fees: $${swap.total_swap.toFixed(2)} (${swap.percent_of_gross_pnl}% impact on gross P&L).`,
    },
  };
}
