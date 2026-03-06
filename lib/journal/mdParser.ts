import type { Trade, TradeSide, TradeStatus, TradeResult, TradeStyle } from './types';

// ─── Date helpers ─────────────────────────────────────────────────────────────
const MONTHS_ES: Record<string, string> = {
    enero: '01', febrero: '02', marzo: '03', abril: '04',
    mayo: '05', junio: '06', julio: '07', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
};

function parseDate(raw: string | undefined): string {
    if (!raw) return '';
    const s = String(raw).replace(/^@/, '').trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0, 10);
    const slash = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (slash) return `${slash[3]}-${slash[2].padStart(2, '0')}-${slash[1].padStart(2, '0')}`;
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
    const s = String(raw).replace(/[US$€%\s]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
    return parseFloat(s) || 0;
}

function parseRR(raw: string | undefined): number {
    if (!raw) return 0;
    return parseFloat(String(raw).replace(',', '.').replace(/[^\d.\-]/g, '')) || 0;
}

function normalizeLabel(text: string): string {
    return text.replace(/^[\s\p{So}\p{Sm}\u2000-\u2BFF]+/u, '').trim().toLowerCase();
}

function mapResult(raw: string | undefined): TradeResult | undefined {
    if (!raw) return undefined;
    const s = String(raw).toLowerCase().trim();
    if (s === 'tp' || s === 'win' || s === 'ganado' || s === 'ganancia') return 'TP';
    if (s === 'sl' || s === 'lose' || s === 'loss' || s === 'perdido' || s === 'perdida') return 'SL';
    if (s === 'be' || s === 'break even' || s === 'breakeven') return 'BE';
    return undefined;
}

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

function buildTradeFromProps(props: Record<string, string>, accountId: string): Omit<Trade, 'id'> | null {
    const symbol = (props.symbol ?? '').replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (!symbol || symbol.length < 2) return null;

    const entryDate = parseDate(props.date) || new Date().toISOString().split('T')[0];
    const dirRaw = (props.tradeDirection ?? props.htfDirection ?? '').toLowerCase();
    const side: TradeSide = dirRaw.includes('short') || dirRaw.includes('sell') ? 'Sell' : 'Buy';
    const result = mapResult(props.result);

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
        source: 'csv' as any, // Reusing the visual tag
    };
}

export async function parseMDToTrades(file: File, accountId: string): Promise<Omit<Trade, 'id'>[]> {
    const text = await file.text();
    const lines = text.split('\n');

    const trades: Omit<Trade, 'id'>[] = [];
    let currentProps: Record<string, string> = {};
    let isReadingTrade = false;
    let fallbackNotes = '';

    // Notion MD export might look like:
    // # 1
    // Par: GBPUSD
    // Fecha: 20 de enero de 2025
    // ...
    // NOTA:
    // texto blabla
    //
    // # 2

    // As multiple trades could theoretically be in one file, we flush whenever we hit a new h1 heading:
    const flushTrade = () => {
        if (Object.keys(currentProps).length > 0) {
            if (fallbackNotes && !currentProps.notes) {
                currentProps.notes = fallbackNotes.trim();
            }
            const trade = buildTradeFromProps(currentProps, accountId);
            if (trade) trades.push(trade);
        }
        currentProps = {};
        fallbackNotes = '';
    };

    let capturingNotes = false;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // If it looks like a heading separating trades (# 1, # Trade 2, etc.)
        if (line.match(/^#\s+\d+/) || line.match(/^##\s+/)) {
            flushTrade();
            isReadingTrade = true;
            capturingNotes = false;
            continue;
        }

        // Match key-value: "Par: GBPUSD"
        const separatorIdx = line.indexOf(':');
        if (separatorIdx > 0 && separatorIdx < 40) { // Limit length to avoid matching URL protocols like http:// or long text
            const labelRaw = line.substring(0, separatorIdx).trim();
            const valueRaw = line.substring(separatorIdx + 1).trim();

            // Check if it's NOTA or similar open text field
            if (labelRaw.toUpperCase() === 'NOTA' || labelRaw.toUpperCase() === 'NOTAS') {
                capturingNotes = true;
                if (valueRaw) fallbackNotes += valueRaw + '\n';
                continue;
            }
            // Skip image links inside MD
            if (labelRaw.toLowerCase().includes('horario') || labelRaw.toLowerCase().includes('minutos') || labelRaw.toLowerCase().includes('ejecucion') || labelRaw.toLowerCase().includes('gestion') || labelRaw.toLowerCase().includes('como siguio')) {
                // Many times these act as headers for images, we skip them.
                if (!valueRaw) continue;
            }

            const normKey = normalizeLabel(labelRaw);
            let mappedKey = LABEL_MAP[normKey];

            // Fallbacks robustos por si cambian caracteres o formatos
            if (!mappedKey) {
                if (normKey.includes('ltf')) mappedKey = 'ltfDirection';
                else if (normKey.includes('contra') || normKey.includes('chequear')) mappedKey = 'againstChecklist';
                else if (normKey.includes('pnl') || normKey.includes('p&l')) mappedKey = 'pnl';
            }

            if (mappedKey) {
                currentProps[mappedKey] = valueRaw;
                isReadingTrade = true;
                capturingNotes = false;
                continue;
            }
        }

        // If we didn't match a new key, and we are capturing notes...
        if (capturingNotes || (isReadingTrade && !line.startsWith('!['))) {
            // We append to notes just in case
            fallbackNotes += line + '\n';
        }
    }

    // Flush last trade
    flushTrade();

    return trades;
}
