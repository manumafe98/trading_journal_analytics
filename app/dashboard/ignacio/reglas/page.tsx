import { ReglasSection } from '@/components/dashboard/journal/ReglasSection';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitch } from '@/components/shared/ThemeSwitch';

export default function IgnacioReglasPage() {
    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-6 py-3">
                <div className="flex items-center gap-3">
                    <Link href="/" className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                        <ArrowLeftIcon className="h-4 w-4" />
                        Portada
                    </Link>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <span className="text-sm font-semibold text-sky-500">Ignacio Torre</span>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <span className="text-sm font-semibold text-rose-500">Reglas</span>
                </div>
                <ThemeSwitch />
            </div>
            <ReglasSection investorName="Ignacio Torre" />
        </div>
    );
}
