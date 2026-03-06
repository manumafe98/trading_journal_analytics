import Link from '@/components/shared/Link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <h1 className="text-8xl font-black tracking-tighter text-slate-800">
          404
        </h1>
        <div className="space-y-2">
          <p className="text-2xl font-bold">
            Página no encontrada
          </p>
          <p className="text-slate-400">
            Lo sentimos, no pudimos encontrar lo que buscabas.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-500 hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
