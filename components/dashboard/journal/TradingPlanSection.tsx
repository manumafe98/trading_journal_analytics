'use client';

interface Props {
    investorName: string;
}

export function TradingPlanSection({ investorName }: Props) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-16 text-center shadow-sm">
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-900/30">
                    <svg
                        className="h-7 w-7 text-violet-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                </div>

                <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-50">
                    Trading Plan de {investorName}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Tu plan de trading estará disponible acá: estrategias, setups,
                    sesiones operativas y objetivos. El contenido se cargará en la próxima sesión.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-3 text-left">
                    {['Estrategia', 'Sesiones', 'Setups', 'Objetivos'].map((item) => (
                        <div key={item} className="rounded-xl bg-gray-50 dark:bg-gray-700/40 px-4 py-4 space-y-2">
                            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
                            <div className="h-2 w-full rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
                            <div className="h-2 w-3/4 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
                        </div>
                    ))}
                </div>

                <p className="mt-6 text-xs text-gray-300 dark:text-gray-600 italic">
                    Contenido pendiente de carga
                </p>
            </div>
        </div>
    );
}
