// @ts-nocheck
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';

const investors = [
  {
    id: 'ignacio',
    name: 'Ignacio Torre',
    initials: 'IT',
    role: 'Inversor',
    avatar: '/static/images/people/1.webp',
    href: '/dashboard/ignacio',
    accent: 'from-sky-950 via-slate-900 to-slate-950',
    glowColor: 'rgba(14, 165, 233, 0.15)',
    borderColor: 'rgba(14, 165, 233, 0.3)',
    buttonGradient: 'from-sky-500 to-sky-600',
    buttonHover: 'hover:from-sky-400 hover:to-sky-500',
    ringColor: 'ring-sky-500/40',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    lineColor: 'bg-sky-500',
  },
  {
    id: 'manuel',
    name: 'Manuel Maxera',
    initials: 'MM',
    role: 'Inversor',
    avatar: '/static/images/people/2.webp',
    href: '/dashboard/manuel',
    accent: 'from-violet-950 via-slate-900 to-slate-950',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    buttonGradient: 'from-violet-500 to-violet-600',
    buttonHover: 'hover:from-violet-400 hover:to-violet-500',
    ringColor: 'ring-violet-500/40',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    lineColor: 'bg-violet-500',
  },
];

export default function CoverPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row overflow-hidden bg-slate-950">

      {/* Ambient background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {investors.map((investor, idx) => (
        <Link
          key={investor.id}
          href={investor.href}
          id={`investor-card-${investor.id}`}
          className={`
            group relative flex flex-1 flex-col items-center justify-center
            min-h-[50vh] md:min-h-screen cursor-pointer
            bg-gradient-to-br ${investor.accent}
            transition-all duration-500 ease-out
            hover:flex-[1.12]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40
          `}
          style={{ ['--glow' as string]: investor.glowColor }}
        >
          {/* Glow layer on hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${investor.glowColor}, transparent)`,
            }}
          />

          {/* Decorative top accent line */}
          <div
            aria-hidden
            className={`absolute top-0 left-0 right-0 h-[2px] ${investor.lineColor} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-12 text-center">

            {/* Badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-widest uppercase ${investor.badgeColor}`}
            >
              <TrendingUp className="h-3 w-3" aria-hidden />
              {investor.role}
            </span>

            {/* Avatar */}
            <div
              className={`
                relative h-36 w-36 overflow-hidden rounded-full
                ring-4 ${investor.ringColor}
                shadow-2xl
                transition-transform duration-500 group-hover:scale-105
              `}
              style={{
                boxShadow: `0 0 40px ${investor.glowColor}`,
              }}
            >
              <Image
                src={investor.avatar}
                alt={`Foto de ${investor.name}`}
                fill
                className="object-cover"
                sizes="144px"
                priority
              />
            </div>

            {/* Name */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {investor.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400 tracking-wide">
                Trading Journal
              </p>
            </div>

            {/* Dashboard button */}
            <button
              tabIndex={-1}
              aria-hidden
              className={`
                mt-2 inline-flex items-center gap-2 rounded-xl
                bg-gradient-to-r ${investor.buttonGradient} ${investor.buttonHover}
                px-7 py-3 text-sm font-semibold text-white
                shadow-lg transition-all duration-300
                group-hover:shadow-xl group-hover:gap-3
                group-hover:scale-105
              `}
            >
              Dashboard
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
            </button>

          </div>

          {/* Side border on desktop */}
          {idx === 0 && (
            <div
              aria-hidden
              className="absolute right-0 top-0 bottom-0 w-px hidden md:block"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(148,163,184,0.2) 30%, rgba(148,163,184,0.2) 70%, transparent)',
              }}
            />
          )}
        </Link>
      ))}

      {/* Center logo / title */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:flex flex-col items-center gap-1"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700 shadow-xl">
          <TrendingUp className="h-5 w-5 text-slate-300" />
        </div>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          vs
        </span>
      </div>

    </div>
  );
}
