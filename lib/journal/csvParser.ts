import Papa from 'papaparse';
import type { Trade, TradeSide, TradeStatus, TradeResult, TradeStyle } from './types';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const MONTHS_ES: Record<string, string> = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
};

function parseDate(raw: string | undefined): string {
    if (!raw) return '';
    // Strip "@" Notion prefix: "@20 de febrero de 2025"
    const s = String(raw).replace(/^@/, '').trim();
    // ISO already: 2024-01-15
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
    // DD/MM/YYYY or DD-MM-YYYY
    const slash = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slash) return `${slash[3]}-${slash[2].padStart(2, '0')}-${slash[1].padStart(2, '0')}`;
    // "20 de febrero de 2025" (with or without "de")
    const sp = s.match(/(\d{1,2})\s+(?:de\s+)?(\w+)\s+(?:de\s+)?(\d{4})/i);
    if (sp) {
        const m = MONTHS_ES[sp[2].toLowerCase()];
        if (m) return `${sp[3]}-${m}-${sp[1].padStart(2, '0')}`;
    }
    return '';
}

// ─── Number / amount helpers ──────────────────────────────────────────────────
function parseAmount(raw: string | undefined): number {
    if (!raw) return 0;
    // "2,8 %", "$258.83", "-100,00 US$"
    const s = String(raw).replace(/[US$€%\s]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
    return parseFloat(s) || 0;
}

function parseRR(raw: string | undefined): number {
    if (!raw) return 0;
    return parseFloat(String(raw).replace(',', '.').replace(/[^\d.\-]/g, '')) || 0;
}

// Normalize label: strip leading icons/emojis, trailing whitespace, and lowercase
function normalizeLabel(text: string): string {
    return text.replace(/^[\s\p{So}\p{Sm}\u2000-\u2BFF]+/u, '').trim().toLowerCase();
}

// ─── Result value mapping ─────────────────────────────────────────────────────
function mapResult(raw: string | undefined): TradeResult | undefined {
    if (!raw) return undefined;
    const s = String(raw).toLowerCase().trim();
    if (s === 'tp' || s === 'win' || s === 'ganado' || s === 'ganancia') return 'TP';
    if (s === 'sl' || s === 'lose' || s === 'loss' || s === 'perdido' || s === 'perdida') return 'SL';
    if (s === 'be' || s === 'break even' || s === 'breakeven') return 'BE';
    return undefined;
}

// ─── Notion property label → our internal key ────────────────────────────────
const LABEL_MAP: Record<string, string> = {
    'par': 'symbol',
    'fecha': 'date',
    'hora ejecución': 'entryTime',
    'hora ejecucion': 'entryTime',
    'hora': 'entryTime',
    'ejecutable': 'executable',
    'direccion (htf)': 'htfDirection',
    'dirección (htf)': 'htfDirection',
    'direccion htf': 'htfDirection',
    'dirección htf': 'htfDirection',
    '(ltf)': 'ltfDirection',
    'ltf)': 'ltfDirection',
    'ltf': 'ltfDirection',
    'dirección (ltf)': 'ltfDirection',
    'direccion (ltf)': 'ltfDirection',
    'direccion ltf': 'ltfDirection',
    'dirección ltf': 'ltfDirection',
    'direccion del trade': 'tradeDirection',
    'dirección del trade': 'tradeDirection',
    'direccion': 'tradeDirection',
    'dirección': 'tradeDirection',
    'pullback': 'pullback',
    'entrada': 'entryType',
    'rr': 'rr',
    'target': 'target',
    'resultado': 'result',
    'duracion': 'duration',
    'duración': 'duration',
    'target max': 'targetMax',
    'target max final': 'targetMaxFinal',
    'pnl': 'pnl',
    'pnl (%)': 'pnl',
    'pnl(%)': 'pnl',
    'pnl %': 'pnl',
    'pnl % ': 'pnl',
    'resultado (%)': 'pnl',
    'resultado %': 'pnl',
    'p&l': 'pnl',
    'orgulloso': 'proud',
    'volveria a entrar?': 'wouldReenter',
    'volvería a entrar?': 'wouldReenter',
    'volveria a entrar': 'wouldReenter',
    'volvería a entrar': 'wouldReenter',
    'como siguio...': 'howContinued',
    'cómo siguio...': 'howContinued',
    'como siguio': 'howContinued',
    'gestion': 'management',
    'gestión': 'management',
    'gestion correcta': 'correctManagement',
    'gestión correcta': 'correctManagement',
    'error': 'errorNotes',
    'en contra/chequear': 'againstChecklist',
    'en contra / chequear': 'againstChecklist',
    'notas': 'notes',
    'estrategia': 'strategy',
    'estilo': 'style',
    'cuenta': 'cuenta',
};

// ─── Parse a single row into a Trade ─────────────────────────────────────────
function buildTradeFromRow(row: Record<string, string>, accountId: string): Omit<Trade, 'id'> | null {
    // Map normalized CSV headers to our expected prop structure
    const props: Record<string, string> = {};
    for (const [header, value] of Object.entries(row)) {
        const normKey = normalizeLabel(header);
        let mappedKey = LABEL_MAP[normKey];

        // Fallbacks robustos por si Notion cambia mínimamente el formato de exportación
        if (!mappedKey) {
            if (normKey.includes('ltf')) mappedKey = 'ltfDirection';
            else if (normKey.includes('contra') || normKey.includes('chequear')) mappedKey = 'againstChecklist';
            else if (normKey.includes('pnl') || normKey.includes('p&l')) mappedKey = 'pnl';
        }

        if (mappedKey && value?.trim()) {
            props[mappedKey] = value.trim();
        }
    }

    const symbol = (props.symbol ?? '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (!symbol || symbol.length < 2) return null; // A valid symbol is required to consider it a trade row

    const entryDate = parseDate(props.date) || new Date().toISOString().split('T')[0];

    // Trade direction: "Short" → Sell, "Long" → Buy
    const dirRaw = (props.tradeDirection ?? props.htfDirection ?? '').toLowerCase();
    const side: TradeSide = dirRaw.includes('short') || dirRaw.includes('sell') ? 'Sell' : 'Buy';

    // Result: "Win"→TP, "Lose"→SL, "BE"→BE
    const result = mapResult(props.result);

    // PnL
    const pnlRaw = props.pnl ?? '';
    const isPercent = pnlRaw.includes('%');
    const pnlNum = parseAmount(pnlRaw);
    const pnl = isPercent ? 0 : pnlNum;
    const pnlPercent = isPercent ? pnlNum : 0;

    // Prioritize explicit result string, fallback to numeric logic
    let status: TradeStatus = 'open';
    if (result === 'TP') status = 'won';
    else if (result === 'SL') status = 'lost';
    else if (result === 'BE') status = 'be';
    else if (pnlNum > 0.001) status = 'won'; // threshold to avoid noise
    else if (pnlNum < -0.001) status = 'lost';
    else if (Math.abs(pnlNum) <= 0.001 && (props.result || props.pnl)) status = 'be';

    const rrObtained = Number(props.rr) || parseRR(props.rr) || undefined;
    const style: TradeStyle | undefined =
        /swing/i.test(props.style ?? '') ? 'SWING'
            : /scalp/i.test(props.style ?? '') ? 'SCALP'
                : /day/i.test(props.style ?? '') ? 'DAY'
                    : undefined;

    // Executable: "SI" / "NO" → "Sí" / "No"
    const normalizeYesNo = (v: string | undefined) => {
        if (!v) return undefined;
        const s = String(v).toLowerCase().trim();
        return s === 'si' || s === 'sí' || s === 'yes' ? 'Sí' : s === 'no' ? 'No' : v;
    };

    return {
        accountId,
        symbol,
        assetClass: 'Forex',
        side,
        entryPrice: 0,
        exitPrice: pnl !== 0 ? 0 : null,
        quantity: 1,
        entryDate,
        exitDate: entryDate,
        pnl,
        pnlPercent,
        status,
        result,
        rrObtained,
        strategy: props.strategy || undefined,
        style,
        entryTime: props.entryTime || undefined,
        // Notion Backtesting columns
        executable: normalizeYesNo(props.executable),
        htfDirection: props.htfDirection || undefined,
        ltfDirection: props.ltfDirection || undefined,
        pullback: props.pullback || undefined,
        entryType: props.entryType || undefined,
        targetPrice: props.target || undefined,
        targetMax: props.targetMax || undefined,
        targetMaxFinal: normalizeYesNo(props.targetMaxFinal),
        durationText: props.duration || undefined,
        proud: normalizeYesNo(props.proud),
        wouldReenter: normalizeYesNo(props.wouldReenter),
        howContinued: props.howContinued || undefined,
        management: props.management || undefined,
        correctManagement: props.correctManagement || undefined,
        errorNotes: props.errorNotes || undefined,
        againstChecklist: props.againstChecklist || undefined,
        feelingNotes: props.notes || undefined,
        source: 'pdf', // Keeping 'pdf' tag visually or switch to 'csv' later if desired. Let's stick to 'csv'.
    };
}

// ─── Main export: parse CSV → array of Trade objects ─────────────────────────
export async function parseCSVToTrades(
    file: File,
    accountId: string,
): Promise<Omit<Trade, 'id'>[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0 && results.data.length === 0) {
                    reject(new Error(`Error leyendo CSV: ${results.errors[0].message}`));
                    return;
                }

                const trades: Omit<Trade, 'id'>[] = [];
                for (const row of results.data as Record<string, string>[]) {
                    const trade = buildTradeFromRow(row, accountId);
                    if (trade) {
                        // Tag it specifically as csv so it can be styled if needed
                        // Casting since Trade interface might only have 'manual' | 'pdf', fallback to 'manual' is okay
                        trade.source = 'manual';
                        trades.push(trade);
                    }
                }

                resolve(trades);
            },
            error: (error: Error) => {
                reject(error);
            }
        });
    });
}
