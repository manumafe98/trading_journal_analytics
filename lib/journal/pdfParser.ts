/**
 * Notion Trade Journal PDF Parser
 *
 * Extracts trade data from Notion-exported PDFs using pdfjs-dist.
 * Worker is loaded from unpkg CDN at the installed pdfjs-dist version.
 */

import type { Trade, TradeSide, AssetClass, TradeStatus, TradeResult, TradeStyle, TradeSession } from './types';

// ──────────────────────────────────────────────────────────────────────────────
// Spanish date parsing
// ──────────────────────────────────────────────────────────────────────────────
const MONTHS_ES: Record<string, string> = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
};

function parseSpanishDate(text: string): string {
    const match = text.match(/@?(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (!match) return new Date().toISOString().split('T')[0];
    const [, day, monthName, year] = match;
    const month = MONTHS_ES[monthName.toLowerCase()];
    if (!month) return new Date().toISOString().split('T')[0];
    return `${year}-${month}-${day.padStart(2, '0')}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Number / currency parsing
// ──────────────────────────────────────────────────────────────────────────────
function parseAmount(text: string): number {
    // "258,83 US$" → "258.83" → 258.83
    // "-100,00 US$" → -100.00
    const cleaned = text
        .replace(/US\$|€|\$|€/g, '')
        .trim()
        .replace(/\./g, '')   // Remove thousand-separator dots
        .replace(',', '.');    // European decimal comma → dot
    return parseFloat(cleaned) || 0;
}

function parsePercent(text: string): number {
    return parseFloat(text.replace('%', '').replace(',', '.').trim()) || 0;
}

function parseRR(text: string): number {
    return parseFloat(text.replace(',', '.').trim()) || 0;
}

// ──────────────────────────────────────────────────────────────────────────────
// PDF text extraction
// ──────────────────────────────────────────────────────────────────────────────
export async function extractPDFText(file: File): Promise<string[]> {
    // Dynamic import so this only runs client-side
    const pdfjsLib = await import('pdfjs-dist');

    // Use unpkg CDN worker matching the installed version
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const lines: string[] = [];
    for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        for (const item of content.items) {
            if ('str' in item && item.str.trim()) {
                lines.push(item.str.trim());
            }
        }
    }
    return lines;
}

// ──────────────────────────────────────────────────────────────────────────────
// Field extraction from the flat list of text items
// ──────────────────────────────────────────────────────────────────────────────
function findValue(lines: string[], ...labels: string[]): string {
    for (const label of labels) {
        const idx = lines.findIndex(
            (l) => l.toLowerCase().includes(label.toLowerCase()),
        );
        if (idx !== -1) {
            // Value is usually the next non-empty line that isn't another known label
            for (let i = idx + 1; i < Math.min(idx + 4, lines.length); i++) {
                const candidate = lines[i].trim();
                if (candidate && candidate !== label) {
                    return candidate;
                }
            }
        }
    }
    return '';
}

// ──────────────────────────────────────────────────────────────────────────────
// Main parser — converts text lines → partial Trade
// ──────────────────────────────────────────────────────────────────────────────
export function parseNotionTradeLines(
    lines: string[],
    accountId: string,
): Omit<Trade, 'id'> {
    // ── Symbol ──
    // The pair is usually the first ALL-CAPS word with 6+ letters
    const symbolLine = lines.find((l) => /^[A-Z]{4,10}$/.test(l.trim()));
    const symbol = symbolLine ?? 'UNKNOWN';

    // ── Fecha ──
    const fechaRaw = findValue(lines, 'Fecha');
    const entryDate = parseSpanishDate(fechaRaw);

    // ── Dirección → side ──
    const dirRaw = findValue(lines, 'Dirección', 'Direccion').toLowerCase();
    const side: TradeSide = dirRaw.includes('short') ? 'Sell' : 'Buy';

    // ── Resultado ──
    const resultadoRaw = findValue(lines, 'Resultado').toUpperCase();
    const result: TradeResult | undefined =
        resultadoRaw === 'TP' ? 'TP'
            : resultadoRaw === 'SL' ? 'SL'
                : resultadoRaw === 'BE' ? 'BE'
                    : undefined;

    // ── P&L ──
    const pnlRaw = findValue(lines, 'P&L');
    const pnl = parseAmount(pnlRaw);

    // ── Status from result / pnl ──
    const status: TradeStatus =
        result === 'TP' || pnl > 0 ? 'won'
            : result === 'SL' || pnl < 0 ? 'lost'
                : result === 'BE' ? 'lost'
                    : 'open';

    // ── RR ──
    const rrRaw = findValue(lines, ' RR', 'RR obtenido', '\u00a0RR');
    const rrObtained = parseRR(rrRaw);

    // ── Riesgo ──
    const riesgoUsdRaw = findValue(lines, 'Riesgo (%)', 'Riesgo($)', 'Riesgo (%)');
    const riskUsd = parseAmount(riesgoUsdRaw);

    // ── Porcentaje ──
    const pctRaw = findValue(lines, 'Porcentaje', 'Riesgo %');
    const riskPercent = parsePercent(pctRaw);

    // ── Estrategia ──
    const strategy = findValue(lines, 'Estrategia') || undefined;

    // ── Estilo ──
    const estiloRaw = findValue(lines, 'Estilo').toUpperCase();
    const style: TradeStyle | undefined =
        estiloRaw === 'DAY' ? 'DAY'
            : estiloRaw === 'SWING' ? 'SWING'
                : estiloRaw === 'SCALP' ? 'SCALP'
                    : undefined;

    // ── Cuenta ──
    const cuenta = findValue(lines, 'Cuenta') || '';

    // ── Session ──
    const sessionRaw = findValue(lines, 'Sesión', 'Sesion', 'Horario', 'Session').toLowerCase();
    const session: TradeSession | undefined =
        sessionRaw.includes('asia') ? 'Asia'
            : sessionRaw.includes('london') || sessionRaw.includes('london') || sessionRaw.includes('europa') ? 'London'
                : sessionRaw.includes('new york') || sessionRaw.includes('nueva york') || sessionRaw.includes('ny') ? 'New York'
                    : sessionRaw ? 'Other'
                        : undefined;

    // ── Notes ──
    const feelingNotes = findValue(lines, 'me siento', 'Cómo me siento') || undefined;
    const errorNotes = findValue(lines, 'Errores', 'Revisión') || undefined;
    const executionNotes = findValue(lines, 'Ejecución', 'Ejecucion') || undefined;

    // ── pnlPercent (best effort) ──
    const pnlPercent = riskUsd > 0 && riskPercent > 0
        ? rrObtained * riskPercent
        : 0;

    return {
        accountId,
        symbol,
        assetClass: 'Forex',
        side,
        // Price / quantity not in Notion PDF — filling with 0, user can edit
        entryPrice: 0,
        exitPrice: pnl !== 0 ? 0 : null,
        quantity: 1,
        entryDate,
        exitDate: entryDate,
        pnl,
        pnlPercent,
        stopLoss: undefined,
        takeProfit: undefined,
        notes: cuenta ? `Cuenta: ${cuenta}` : undefined,
        status,
        // Extended fields
        strategy,
        rrObtained: rrObtained || undefined,
        result,
        riskPercent: riskPercent || undefined,
        riskUsd: riskUsd || undefined,
        style,
        session,
        feelingNotes,
        errorNotes,
        executionNotes,
        source: 'pdf',
    };
}

// ──────────────────────────────────────────────────────────────────────────────
// Main entry: file → parsed Trade
// ──────────────────────────────────────────────────────────────────────────────
export async function parsePDFToTrade(
    file: File,
    accountId: string,
): Promise<Omit<Trade, 'id'>> {
    const lines = await extractPDFText(file);
    return parseNotionTradeLines(lines, accountId);
}
