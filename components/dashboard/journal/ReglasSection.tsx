'use client';

// ── ReglasSection ─────────────────────────────────────────────────────────────
// Scalping Contextual (Top-Down) strategy in a premium multi-step design
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
    investorName: string;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function StepCard({
    step, icon, timeframe, title, color, children,
}: {
    step: string; icon: string; timeframe: string; title: string;
    color: 'sky' | 'blue' | 'violet' | 'amber' | 'green' | 'rose';
    children: React.ReactNode;
}) {
    const palette = {
        sky: { border: 'border-sky-200 dark:border-sky-700/50', bg: 'bg-sky-50 dark:bg-sky-900/15', badge: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400', tf: 'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300' },
        blue: { border: 'border-blue-200 dark:border-blue-700/50', bg: 'bg-blue-50 dark:bg-blue-900/15', badge: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', tf: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
        violet: { border: 'border-violet-200 dark:border-violet-700/50', bg: 'bg-violet-50 dark:bg-violet-900/15', badge: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', tf: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300' },
        amber: { border: 'border-amber-200 dark:border-amber-700/50', bg: 'bg-amber-50 dark:bg-amber-900/15', badge: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', tf: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
        green: { border: 'border-green-200 dark:border-green-700/50', bg: 'bg-green-50 dark:bg-green-900/15', badge: 'bg-green-500', text: 'text-green-600 dark:text-green-400', tf: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
        rose: { border: 'border-rose-200 dark:border-rose-700/50', bg: 'bg-rose-50 dark:bg-rose-900/15', badge: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', tf: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' },
    };
    const p = palette[color];

    return (
        <div className={`rounded-2xl border ${p.border} overflow-hidden shadow-sm`}>
            {/* Step header */}
            <div className={`flex items-center justify-between px-6 py-4 ${p.bg}`}>
                <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${p.badge} text-white text-sm font-black`}>
                        {step}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            {icon} {title}
                        </p>
                    </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold font-mono ${p.tf}`}>
                    {timeframe}
                </span>
            </div>
            {/* Step body */}
            <div className="bg-white dark:bg-gray-800 px-6 py-5">
                {children}
            </div>
        </div>
    );
}

function BulletItem({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
    return (
        <li className="flex items-start gap-3">
            <span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${accent ? 'bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{children}</span>
        </li>
    );
}

function OptionCard({ label, color, children }: { label: string; color: 'green' | 'blue'; children: React.ReactNode }) {
    const c = {
        green: 'border-green-200 dark:border-green-700/40 bg-green-50 dark:bg-green-900/15 text-green-700 dark:text-green-400',
        blue: 'border-blue-200 dark:border-blue-700/40 bg-blue-50 dark:bg-blue-900/15 text-blue-700 dark:text-blue-400',
    }[color];
    return (
        <div className={`rounded-xl border px-4 py-3.5 ${c}`}>
            <p className="text-xs font-black uppercase tracking-wider mb-2">{label}</p>
            <p className="text-sm leading-relaxed opacity-90">{children}</p>
        </div>
    );
}

function InfoPill({ emoji, text }: { emoji: string; text: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 px-4 py-3">
            <span className="text-base shrink-0">{emoji}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</span>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ReglasSection({ investorName }: Props) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6 space-y-5">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-8 py-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                        🔫 Estrategia
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
                        Scalping Contextual
                    </h1>
                    <p className="text-slate-400 font-semibold mb-4">Metodología Top-Down</p>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5">
                        <p className="text-sm text-slate-300 leading-relaxed">
                            <span className="font-bold text-white">Objetivo:</span> Búsqueda de giros o continuaciones a favor del momentum,
                            apoyados en zonas de alta liquidez.
                        </p>
                    </div>
                </div>
                {/* Connector line */}
                <div className="flex justify-center bg-gray-50 dark:bg-gray-900 py-2">
                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />
                </div>
            </div>

            {/* ── PASO 1 ────────────────────────────────────────────────────── */}
            <StepCard step="1" icon="🔎" timeframe="1H / 4H" title='Contexto y Zona — "El Dónde"' color="sky">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                    Preparamos el arma. Determinamos la intención del mercado.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <OptionCard label="Opción A — Reversión (Giro)" color="blue">
                        El precio llega a una zona de Soporte / Resistencia importante de 1H/4H donde reaccionó con fuerza en el pasado. Buscamos el agotamiento del impulso previo.
                    </OptionCard>
                    <OptionCard label="Opción B — Continuación (Tendencia)" color="green">
                        Identificamos una tendencia mayor o una estructura de continuación clara (banderas/canales) en 1H/4H para unirnos al flujo de dinero institucional.
                    </OptionCard>
                </div>
                <InfoPill emoji="✨" text={<><strong>Confluencia Extra:</strong> La zona coincide con la EMA de 4H o la EMA Diaria.</>} />
            </StepCard>

            {/* Connector */}
            <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-gray-300 dark:border-gray-700" />
                </div>
            </div>

            {/* ── PASO 2 ────────────────────────────────────────────────────── */}
            <StepCard step="2" icon="🔄" timeframe="15m" title='Cambio de Estructura — "El Quién"' color="violet">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                    Determinamos quién tiene el control ahora.
                </p>
                <ul className="space-y-3">
                    <BulletItem accent>
                        <strong>Ruptura Estructural:</strong> Aplicar regla RCC. El precio debe romper y confirmar un nuevo{' '}
                        <span className="font-semibold text-violet-600 dark:text-violet-400">Máximo Más Alto</span> o{' '}
                        <span className="font-semibold text-violet-600 dark:text-violet-400">Mínimo Más Bajo</span>.
                    </BulletItem>
                    <BulletItem accent>
                        <strong>Fuerza del Impulso:</strong> La ruptura debe mostrar velas sólidas e intención clara.
                    </BulletItem>
                </ul>
            </StepCard>

            {/* Connector */}
            <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-gray-300 dark:border-gray-700" />
                </div>
            </div>

            {/* ── PASO 3 ────────────────────────────────────────────────────── */}
            <StepCard step="3" icon="📉" timeframe="5m" title='Análisis del Pullback — "El Cómo"' color="amber">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                    Observamos cómo regresa el precio.
                </p>
                <ul className="space-y-3 mb-4">
                    <BulletItem>
                        <strong>Desarrollo:</strong> El retroceso debe ser <em>lento y correctivo</em>.
                    </BulletItem>
                    <BulletItem accent>
                        <strong>Zona de Aterrizaje:</strong> El pullback debe tocar al menos una confluencia:
                        retesteo estructural, EMAs alineadas o niveles de Fibonacci.
                    </BulletItem>
                </ul>
                <InfoPill emoji="✏️" text={<><strong>Acción Obligatoria:</strong> Trazar la diagonal (línea de tendencia) que envuelve el retroceso.</>} />
            </StepCard>

            {/* Connector */}
            <div className="flex justify-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                    <div className="h-2 w-2 rotate-45 border-r-2 border-b-2 border-gray-300 dark:border-gray-700" />
                </div>
            </div>

            {/* ── PASO 4 ────────────────────────────────────────────────────── */}
            <StepCard step="4" icon="🔫" timeframe="1m / 30s" title="Gatillo y Ejecución — El Disparo" color="rose">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                    El disparo preciso.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-rose-200 dark:border-rose-700/40 bg-rose-50 dark:bg-rose-900/15 px-4 py-3.5">
                        <p className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">Confirmación</p>
                        <p className="text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                            Ruptura <strong>RCC</strong> de la diagonal trazada.
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-900 dark:bg-gray-900 px-4 py-3.5">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Ejecución</p>
                        <p className="text-sm text-white leading-relaxed">
                            Entrada <span className="font-black text-rose-400">A MERCADO</span>{' '}
                            <span className="text-gray-400 text-xs">(sin limits — evitar ruido y spread)</span>
                        </p>
                    </div>
                </div>
            </StepCard>

            {/* ── Gestión del Trade ─────────────────────────────────────────── */}
            <div className="rounded-2xl border border-green-200 dark:border-green-700/50 overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/15">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white text-sm">🛡️</span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Gestión del Trade</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 px-6 py-5 space-y-4">
                    {/* SL */}
                    <div className="rounded-xl border border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/15 px-5 py-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block h-3 w-3 rounded-sm bg-red-500" />
                            <p className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">Stop Loss (SL)</p>
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">
                            Cubriendo el patrón de 1m o el último extremo estructural del pullback.{' '}
                            <strong>Técnico e inviolable.</strong>
                        </p>
                    </div>

                    {/* TP */}
                    <div className="rounded-xl border border-green-200 dark:border-green-700/40 bg-green-50 dark:bg-green-900/15 px-5 py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-block h-3 w-3 rounded-sm bg-green-500" />
                            <p className="text-xs font-black uppercase tracking-wider text-green-600 dark:text-green-400">Take Profit (TP)</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-lg bg-white dark:bg-gray-700/50 border border-green-100 dark:border-green-700/30 px-4 py-3">
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">🎯 TP Conservador</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Al final del impulso de 15m.<br />
                                    <em className="text-amber-600 dark:text-amber-400">Asegurar o mover a BE.</em>
                                </p>
                            </div>
                            <div className="rounded-lg bg-white dark:bg-gray-700/50 border border-green-100 dark:border-green-700/30 px-4 py-3">
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 mb-1">🚀 TP Agresivo</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Dejar correr siguiendo la estructura de 5m hasta el siguiente nivel de 1H.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RCC reminder ──────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-violet-200 dark:border-violet-700/50 bg-violet-50 dark:bg-violet-900/10 px-6 py-4 flex items-start gap-3">
                <span className="text-xl shrink-0">📏</span>
                <div>
                    <p className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-1">Regla de Oro: RCC</p>
                    <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                        <strong>Ruptura, Cierre y Confirmación</strong> — obligatoria para toda zona técnica
                        (soporte, resistencia o diagonal).
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-3">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    🔫 Scalping Contextual · {investorName} · 2026
                </p>
            </div>
        </div>
    );
}
