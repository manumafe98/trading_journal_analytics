/**
 * Notion Trade Journal PDF Parser — v3
 *
 * Handles Notion **page-per-row** database exports:
 *   Each page = one trade, formatted as a two-column property list:
 *     Left column:  label  (Par, Fecha, Resultado, …)
 *     Right column: value  (GBPUSD, @20 de febrero de 2025, Win, …)
 *
 * Worker is served from /public/pdf.worker.min.mjs (no CDN dependency).
 */

import type { Trade, TradeSide, TradeStatus, TradeResult, TradeStyle } from './types';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const MONTHS_ES: Record<string, string> = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
};

function parseDate(raw: string): string {
    if (!raw) return '';
    // Strip "@" Notion prefix: "@20 de febrero de 2025"
    const s = raw.replace(/^@/, '').trim();
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
function parseAmount(raw: string): number {
    // "2,8 %", "$258.83", "-100,00 US$"
    const s = raw.replace(/[US$€%\s]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
    return parseFloat(s) || 0;
}

function parseRR(raw: string): number {
    return parseFloat(raw.replace(',', '.').replace(/[^\d.\-]/g, '')) || 0;
}

// ─── Notion property label → our internal key ────────────────────────────────
// Match user's EXACT column names from their Notion table
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
    'ltf': 'ltfDirection',
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

// Normalize label: strip leading icons/emojis and lowercase
function normalizeLabel(text: string): string {
    // Remove leading non-letter, non-digit chars (icons, bullets, etc.)
    return text.replace(/^[\s\p{So}\p{Sm}\p{P}\u2000-\u2BFF]+/u, '').trim().toLowerCase();
}

// ─── Result value mapping ─────────────────────────────────────────────────────
function mapResult(raw: string): TradeResult | undefined {
    const s = raw.toLowerCase().trim();
    if (s === 'tp' || s === 'win' || s === 'ganado' || s === 'ganancia') return 'TP';
    if (s === 'sl' || s === 'lose' || s === 'loss' || s === 'perdido' || s === 'perdida') return 'SL';
    if (s === 'be' || s === 'break even' || s === 'breakeven') return 'BE';
    return undefined;
}

// ─── PDF text extraction with XY positions ────────────────────────────────────
interface Item { str: string; x: number; y: number; page: number; }

async function extractItems(file: File): Promise<Item[]> {
    const pdfjsLib = await import('pdfjs-dist');

    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        // Blob URL approach: fetch the worker file and re-create it with an explicit
        // text/javascript MIME type. This bypasses X-Content-Type-Options: nosniff which
        // blocks .mjs files being loaded as workers when served without the correct Content-Type.
        try {
            const workerResponse = await fetch('/pdf.worker.min.mjs');
            if (workerResponse.ok) {
                const workerText = await workerResponse.text();
                const blob = new Blob([workerText], { type: 'text/javascript' });
                pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
            } else {
                throw new Error(`fetch failed: ${workerResponse.status}`);
            }
        } catch {
            // CDN fallback
            pdfjsLib.GlobalWorkerOptions.workerSrc =
                `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        }
    }

    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
        data: buf,
        // CMap support for non-latin characters
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/standard_fonts/`,
    }).promise;

    const items: Item[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const vp = page.getViewport({ scale: 1 });
        const content = await page.getTextContent();
        for (const item of content.items) {
            if ('str' in item && item.str.trim()) {
                const tx = item.transform as number[];
                items.push({
                    str: item.str.trim(),
                    x: Math.round(tx[4]),
                    y: Math.round(vp.height - tx[5]),  // flip Y so top=0
                    page: p,
                });
            }
        }
    }
    return items;
}

// ─── Group items into visual rows (by Y ± 6 px, per page) ────────────────────
function groupRows(items: Item[]): Item[][] {
    const sorted = [...items].sort(
        (a, b) => a.page !== b.page ? a.page - b.page : a.y - b.y || a.x - b.x,
    );
    const rows: Item[][] = [];
    let cur: Item[] = [];
    let lastY = -9999, lastPage = -1;

    for (const it of sorted) {
        if (it.page !== lastPage || Math.abs(it.y - lastY) > 7) {
            if (cur.length) rows.push([...cur].sort((a, b) => a.x - b.x));
            cur = [it];
            lastY = it.y;
            lastPage = it.page;
        } else {
            cur.push(it);
            lastY = (lastY + it.y) / 2;
        }
    }
    if (cur.length) rows.push([...cur].sort((a, b) => a.x - b.x));
    return rows;
}

// ─── Parse one page's rows into a property map ───────────────────────────────
type PropMap = Record<string, string>;

function extractPropsFromRows(rows: Item[][]): PropMap {
    const props: PropMap = {};
    for (const row of rows) {
        if (row.length < 1) continue;
        // Try first item as label, rest as value
        const labelRaw = row[0].str;
        const label = normalizeLabel(labelRaw);
        const mappedKey = LABEL_MAP[label];
        if (mappedKey) {
            // Value: all items after the first, OR second item if 2-col layout
            const valueItems = row.slice(1);
            const value = valueItems.map(i => i.str).join(' ').trim();
            if (!props[mappedKey] && value) props[mappedKey] = value;
        }
        // Also try with icon stripped from second item
        if (row.length >= 2) {
            const label2 = normalizeLabel(row[1].str);
            const mapped2 = LABEL_MAP[label2];
            if (mapped2) {
                const value2 = row.slice(2).map(i => i.str).join(' ').trim();
                if (!props[mapped2] && value2) props[mapped2] = value2;
            }
        }
    }
    return props;
}

// ─── Build a Trade from a property map ───────────────────────────────────────
function buildTrade(props: PropMap, accountId: string): Omit<Trade, 'id'> | null {
    const symbol = (props.symbol ?? '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (!symbol || symbol.length < 2) return null;

    const entryDate = parseDate(props.date ?? '') || new Date().toISOString().split('T')[0];

    // Trade direction: "Short" → Sell, "Long" → Buy
    const dirRaw = (props.tradeDirection ?? props.htfDirection ?? '').toLowerCase();
    const side: TradeSide = dirRaw.includes('short') || dirRaw.includes('sell') ? 'Sell' : 'Buy';

    // Result: "Win"→TP, "Lose"→SL, "BE"→BE
    const result = mapResult(props.result ?? '');

    // PnL: can be "2,8 %" (percentage) or "258.83" (USD)
    const pnlRaw = props.pnl ?? '';
    const isPercent = pnlRaw.includes('%');
    const pnlNum = parseAmount(pnlRaw);
    const pnl = isPercent ? 0 : pnlNum;
    const pnlPercent = isPercent ? pnlNum : 0;

    const status: TradeStatus =
        result === 'TP' || pnl > 0 ? 'won'
            : result === 'SL' || pnl < 0 ? 'lost'
                : result === 'BE' ? 'lost'
                    : 'open';

    const rrObtained = parseRR(props.rr ?? '') || undefined;
    const style: TradeStyle | undefined =
        /swing/i.test(props.style ?? '') ? 'SWING'
            : /scalp/i.test(props.style ?? '') ? 'SCALP'
                : /day/i.test(props.style ?? '') ? 'DAY'
                    : undefined;

    // Executable: "SI" / "NO" → "Sí" / "No"
    const normalizeYesNo = (v: string) => {
        const s = v.toLowerCase().trim();
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
        executable: props.executable ? normalizeYesNo(props.executable) : undefined,
        htfDirection: props.htfDirection || undefined,
        ltfDirection: props.ltfDirection || undefined,
        pullback: props.pullback || undefined,
        entryType: props.entryType || undefined,
        targetPrice: props.target || undefined,
        targetMax: props.targetMax || undefined,
        targetMaxFinal: props.targetMaxFinal ? normalizeYesNo(props.targetMaxFinal) : undefined,
        durationText: props.duration || undefined,
        proud: props.proud ? normalizeYesNo(props.proud) : undefined,
        wouldReenter: props.wouldReenter ? normalizeYesNo(props.wouldReenter) : undefined,
        howContinued: props.howContinued || undefined,
        management: props.management || undefined,
        correctManagement: props.correctManagement || undefined,
        errorNotes: props.errorNotes || undefined,
        againstChecklist: props.againstChecklist || undefined,
        feelingNotes: props.notes || undefined,
        source: 'pdf',
    };
}

// ─── Main export: parse PDF → array of Trade objects ─────────────────────────
export async function parsePDFToTrades(
    file: File,
    accountId: string,
): Promise<Omit<Trade, 'id'>[]> {
    const items = await extractItems(file);
    const rows = groupRows(items);

    // Strategy 1: One trade per PDF page (Notion database page export)
    // Group rows by page, extract props per page
    const pageCount = items.length > 0 ? Math.max(...items.map(i => i.page)) : 0;

    if (pageCount >= 1) {
        const trades: Omit<Trade, 'id'>[] = [];
        for (let p = 1; p <= pageCount; p++) {
            const pageRows = rows.filter(r => r[0]?.page === p);
            const props = extractPropsFromRows(pageRows);
            if (Object.keys(props).length >= 2) {
                const trade = buildTrade(props, accountId);
                if (trade) trades.push(trade);
            }
        }
        if (trades.length > 0) return trades;
    }

    // Strategy 2: All pages together (single trade or mixed export)
    const allProps = extractPropsFromRows(rows);
    if (Object.keys(allProps).length >= 2) {
        const trade = buildTrade(allProps, accountId);
        if (trade) return [trade];
    }

    return [];
}

// Legacy compat — single trade
export async function parsePDFToTrade(
    file: File,
    accountId: string,
): Promise<Omit<Trade, 'id'>> {
    const trades = await parsePDFToTrades(file, accountId);
    if (trades.length === 0) throw new Error('No se encontraron trades en el PDF');
    return trades[0];
}
