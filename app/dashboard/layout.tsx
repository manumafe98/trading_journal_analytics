'use client';

import { useState } from 'react';
import { Sidebar, TopBar } from '@/components/dashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-200">
      {/* Noise Texture Overlay for premium feel */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 bg-black opacity-[0.03] mix-blend-overlay dark:bg-[url('https://grainy-gradients.vercel.app/noise.svg')] dark:opacity-[0.14]"
      ></div>

      {/* Sidebar relative z-10 so it's over noise */}
      <div className="relative z-10 flex h-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <TopBar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
