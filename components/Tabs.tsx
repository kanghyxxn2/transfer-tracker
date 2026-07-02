'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  {
    href: '/',
    label: '루머',
    subLabel: 'RUMORS',
    match: (pathname: string) => pathname === '/',
  },
  {
    href: '/done-deals',
    label: '확정 이적',
    subLabel: 'DONE DEALS',
    match: (pathname: string) => pathname.startsWith('/done-deals'),
  },
]

export function Tabs() {
  const pathname = usePathname()
  const search = useSearchParams()
  const qs = search.toString()
  const suffix = qs ? `?${qs}` : ''

  return (
    <nav
      className="mb-6 flex gap-1 rounded-xl border border-surface-border bg-surface/40 p-1"
      aria-label="보기 전환"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname)
        return (
          <Link
            key={tab.href}
            href={`${tab.href}${suffix}`}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition',
              active
                ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-red-900/20'
                : 'text-gray-400 hover:bg-surface-hover hover:text-gray-200',
            )}
          >
            <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-70">
              {tab.subLabel}
            </span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
