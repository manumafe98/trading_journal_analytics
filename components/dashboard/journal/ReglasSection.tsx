'use client';

interface Props {
    investorName: string;
}

export function ReglasSection({ investorName }: Props) {
    return (
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-10 py-16 text-center shadow-sm">
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
                    <svg
                        className="h-7 w-7 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                </div>

                <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-50">
                    Reglas de {investorName}
                </h2>
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Acá vas a poder ver todas tus reglas de trading en un solo lugar.
                    El contenido se cargará en la próxima sesión.
                </p>

                <div className="mt-8 rounded-xl bg-gray-50 dark:bg-gray-700/40 px-6 py-5 text-left space-y-3">
                    {['Regla 1', 'Regla 2', 'Regla 3'].map((r) => (
                        <div key={r} className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary-400 shrink-0" />
                            <div className="h-3 w-full max-w-xs rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
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
