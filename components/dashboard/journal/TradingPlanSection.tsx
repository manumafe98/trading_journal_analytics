'use client';

// ── TradingPlanSection ────────────────────────────────────────────────────────
// Beautiful, structured display of "Trading Plan 2026: Operación Estabilidad"
// ──────────────────────────────────────────────────────────────────────────────

interface Props {
    investorName: string;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden ${className}`}>
            {children}
        </div>
    );
}

function SectionHeader({ icon, number, title, color }: {
    icon: string; number: string; title: string;
    color: 'sky' | 'violet' | 'amber' | 'green' | 'blue' | 'rose' | 'indigo' | 'teal';
}) {
    const colors = {
        sky: 'from-sky-500/10 to-sky-500/5 border-sky-500/20 text-sky-600 dark:text-sky-400',
        violet: 'from-violet-500/10 to-violet-500/5 border-violet-500/20 text-violet-600 dark:text-violet-400',
        amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-400',
        green: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-600 dark:text-green-400',
        blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400',
        rose: 'from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-600 dark:text-rose-400',
        indigo: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400',
        teal: 'from-teal-500/10 to-teal-500/5 border-teal-500/20 text-teal-600 dark:text-teal-400',
    };
    return (
        <div className={`flex items-center gap-3 px-6 py-4 bg-gradient-to-r border-b ${colors[color]}`}>
            <span className="text-xl">{icon}</span>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{number}</p>
                <h2 className="text-base font-bold">{title}</h2>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
            <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400 sm:w-44">{label}</span>
            <span className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{value}</span>
        </div>
    );
}

function ImportantAlert({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-6 my-5 flex gap-3 rounded-xl border border-blue-200 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-3.5">
            <span className="text-blue-500 text-base shrink-0 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">{children}</div>
        </div>
    );
}

function CautionAlert({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-6 my-5 flex gap-3 rounded-xl border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/20 px-4 py-3.5">
            <span className="text-red-500 text-base shrink-0 mt-0.5">⚠️</span>
            <div className="text-sm text-red-800 dark:text-red-300 leading-relaxed">{children}</div>
        </div>
    );
}

function CalloutBox({ emoji, text }: { emoji: string; text: string }) {
    return (
        <div className="mx-6 my-5 flex gap-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 px-5 py-4">
            <span className="text-base shrink-0">{emoji}</span>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{text}</p>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function TradingPlanSection({ investorName }: Props) {
    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 lg:px-8 space-y-5">

            {/* ── Hero header ────────────────────────────────────────────────── */}
            <div className="rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                        <span>🛡️</span> Temporada 2026
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                        Trading Plan 2026
                    </h1>
                    <p className="text-lg font-semibold text-slate-400 mb-5">Operación Estabilidad</p>
                    <div className="inline-block rounded-xl border border-white/10 bg-white/5 px-6 py-3">
                        <p className="text-sm text-slate-300 italic">
                            &ldquo;¿Y si...? No, <span className="font-bold text-white not-italic">REGLAS.</span>&rdquo;
                        </p>
                    </div>
                    <p className="mt-5 text-xs text-slate-500">{investorName} · 2026</p>
                </div>
            </div>

            {/* ── 01. Perfil y Filosofía ──────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="👤" number="01" title="Perfil y Filosofía" color="sky" />
                <ImportantAlert>
                    <strong>Mantra:</strong> Mi principal propósito es el de no perder dinero; preservar el capital es la prioridad absoluta.
                </ImportantAlert>
                <div className="px-6 pb-6 space-y-0">
                    <InfoRow label="Perfil Actual" value="Scalper enfocado en la precisión técnica en temporalidades bajas." />
                    <InfoRow label="Enfoque" value="Conservador, buscando la ventaja del gráfico diario para ejecutar en el ruido de corto plazo." />
                    <InfoRow label="Compromiso de Estudio" value={
                        <ul className="space-y-1 list-none">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                                Realizar un mínimo de <strong className="mx-1">15 trades de backtesting</strong> por semana.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
                                Participación activa y apoyo en la academia.
                            </li>
                        </ul>
                    } />
                </div>
            </SectionCard>

            {/* ── 02. Objetivos y Metas ───────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="🎯" number="02" title="Objetivos y Metas" color="green" />
                <div className="px-6 py-5 space-y-0">
                    <InfoRow label="Calidad Técnica" value="Ejecutar los trades con la mayor calidad posible, sin una intención porcentual concreta pero buscando la consistencia." />
                    <InfoRow label="Metas de Escalado" value="Pasar cuentas de fondeo hasta lograr retirar capital de forma recurrente." />
                    <InfoRow label="Estabilidad" value="Convertirme en un trader estable mediante el control riguroso del comportamiento, no del resultado." />
                </div>
            </SectionCard>

            {/* ── 03. Gestión Monetaria ───────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="💰" number="03" title="Gestión Monetaria (El Escudo)" color="amber" />
                <div className="px-6 pt-5 pb-2 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <th className="text-left py-2 pr-6 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 w-44">Concepto</th>
                                <th className="text-left py-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Regla Inviolable</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {[
                                { concept: '💼 Capital', rule: 'Gestión independiente (10k WSF, 5k y 25k Bullfy)' },
                                { concept: '⚡ Riesgo Scalping', rule: <><span className="font-bold text-amber-600 dark:text-amber-400">0.50%</span> por operación</> },
                                { concept: '📈 Riesgo Daytrading', rule: <><span className="font-bold text-amber-600 dark:text-amber-400">1%</span> por operación</> },
                                { concept: '🛑 Daily Stop Loss', rule: <><span className="font-bold text-red-600 dark:text-red-400">-1.5%</span> o 3 trades perdidos</> },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                                    <td className="py-3 pr-6 font-semibold text-gray-700 dark:text-gray-300 text-sm">{row.concept}</td>
                                    <td className="py-3 text-gray-700 dark:text-gray-300 text-sm">{row.rule}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <CautionAlert
                    emoji="🚨"
                    text="Acción ante límite: Si toco el límite diario, cierro sesión inmediatamente y paso a backtesting."
                />
            </SectionCard>

            {/* ── 04. Mercados y Horarios ─────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="⏰" number="04" title="Mercados y Horarios" color="indigo" />
                <div className="px-6 py-5 space-y-0">
                    <InfoRow label="Activos" value="Forex — Selección de los 20 pares principales." />
                    <InfoRow label="Bloques Horarios" value={
                        <div className="space-y-2">
                            <div className="flex items-start gap-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2">
                                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">08:00–12:00</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Sesión de Oficina — <em>Foco máximo en ejecución</em></span>
                            </div>
                            <div className="flex items-start gap-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 px-3 py-2">
                                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 shrink-0 mt-0.5">14:00–16:00</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">Sesión de Seguimiento — <em>Gestión y revisión</em></span>
                            </div>
                        </div>
                    } />
                    <InfoRow label="Regla del Viernes" value={
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 px-3 py-1.5 text-sm text-orange-700 dark:text-orange-300 font-medium">
                            🚫 No operar en la tarde; cerrar todas las posiciones antes del fin de semana.
                        </span>
                    } />
                </div>
            </SectionCard>

            {/* ── 05. Estrategia y Ejecución ──────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="📈" number="05" title="Estrategia y Ejecución" color="violet" />
                <div className="px-6 pt-5 space-y-6 pb-6">

                    {/* RCC */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">📏</span>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">La Regla de Oro: RCC</h3>
                        </div>
                        <div className="rounded-xl border border-violet-200 dark:border-violet-700/50 bg-violet-50 dark:bg-violet-900/15 px-5 py-3.5">
                            <p className="text-sm text-violet-800 dark:text-violet-300 leading-relaxed">
                                <strong>Ruptura, Cierre y Confirmación:</strong> Obligatorio para cualquier zona técnica (soporte, resistencia o diagonal).
                            </p>
                        </div>
                    </div>

                    {/* Scalping */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">🔫</span>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">Scalping Contextual (Top-Down)</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { tf: '1H/4H', label: 'Contexto', desc: 'Identificar niveles clave o estructuras de continuación (banderas).' },
                                { tf: '15m', label: 'Cambio Estructural', desc: 'Confirmación RCC de un nuevo máximo o mínimo.' },
                                { tf: '5m', label: 'Pullback', desc: 'Retroceso correctivo a zona de valor (EMAs, Fibo o retesteo estructural).' },
                                { tf: '1m/30s', label: 'Gatillo', desc: <span>Ruptura RCC de la diagonal trazada; entrada <strong>a mercado</strong> siempre.</span> },
                            ].map((step, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold mt-0.5">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 rounded-lg bg-gray-50 dark:bg-gray-700/40 px-4 py-2.5">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 font-mono">{step.tf}</span>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{step.label}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daytrading toggles */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">🛠️</span>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">Arsenal de Daytrading (Toggles)</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { code: 'BLUE', icon: '🔵', label: 'Giro', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50 text-blue-700 dark:text-blue-300', desc: 'Basada en niveles diarios; target a la EMA 4H.' },
                                { code: 'RED', icon: '🔴', label: 'Continuación', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300', desc: 'Pullback a EMAs 1H/4H sincronizadas; target al cuerpo del impulso anterior.' },
                                { code: 'PINK', icon: '🩷', label: 'Retroceso Profundo', color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700/50 text-pink-700 dark:text-pink-300', desc: 'Patrón de cuña a la EMA 4H; target a niveles de 4H.' },
                                { code: 'BLACK', icon: '⚫', label: 'Reversión', color: 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300', desc: 'Sobreextensión del precio con RSI; retorno a la media.' },
                            ].map((t) => (
                                <div key={t.code} className={`rounded-xl border px-4 py-3.5 ${t.color}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span>{t.icon}</span>
                                        <span className="text-xs font-black uppercase tracking-wider">{t.code}</span>
                                        <span className="text-xs font-medium opacity-70">— {t.label}</span>
                                    </div>
                                    <p className="text-xs leading-relaxed opacity-80">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* ── 06. Gestión y Psicología ────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="🧠" number="06" title="Gestión y Psicología" color="rose" />
                <div className="px-6 py-5 space-y-0">
                    <InfoRow label="Break-Even (BE)" value="Se activa si el precio vuelve a entrada tras estar en negativo, pierde momentum o ante noticias inminentes." />
                    <InfoRow label="Filtro de Descarte" value={<span>Cancelar el trade si acumula <strong className="text-rose-600 dark:text-rose-400">3 puntos negativos</strong> (noticias, estructura HTF en contra, etc.).</span>} />
                    <InfoRow label="Control de Ansiedad" value="No ver el desarrollo de la vela de confirmación; usar alarmas para no mirar el gráfico constantemente." />
                    <InfoRow label="Rutina Pre-Operativa" value={
                        <div className="space-y-2 mt-1">
                            {[
                                { emoji: '😴', text: 'Dormir mínimo 7 horas' },
                                { emoji: '🧹', text: 'Entorno limpio, ordenado y tranquilo' },
                                { emoji: '☕', text: 'Tomar un café para iniciar el análisis' },
                            ].map((item, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="h-4 w-4 rounded border-2 border-gray-300 dark:border-gray-600 group-hover:border-rose-400 transition-colors shrink-0" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="mr-1">{item.emoji}</span>{item.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    } />
                </div>
            </SectionCard>

            {/* ── 07. Documentación ───────────────────────────────────────────── */}
            <SectionCard>
                <SectionHeader icon="📝" number="07" title="Documentación" color="teal" />
                <div className="px-6 py-5 space-y-0">
                    <InfoRow label="Journaling" value="Anotar cada trade y la sensación emocional en máximo 24 horas." />
                    <InfoRow label="Revisión ASR" value={<span>Análisis profundo de la semana todos los <strong>fines de semana</strong> para detectar patrones de error.</span>} />
                </div>
            </SectionCard>

            {/* ── Footer ──────────────────────────────────────────────────────── */}
            <div className="text-center py-4">
                <p className="text-xs text-gray-400 dark:text-gray-600">
                    🛡️ Trading Plan 2026 · {investorName} · Operación Estabilidad
                </p>
            </div>

        </div>
    );
}
