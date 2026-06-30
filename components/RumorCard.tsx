import Link from 'next/link'
import type { RumorWithRelations } from '@/lib/queries'
import { formatRelativeTime } from '@/lib/utils'
import { TeamLogo } from './TeamLogo'
import { ReporterBadge } from './ReporterBadge'
import { FireThermometer } from './FireThermometer'

export function RumorCard({ rumor }: { rumor: RumorWithRelations }) {
  const interest = rumor.interest_level ?? 3
  const teamName = rumor.team?.name_ko ?? '소속팀 미상'

  return (
    <article className="group flex gap-3 sm:gap-4">
      <div className="flex flex-col items-center pt-5" aria-hidden>
        <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.18)] transition group-hover:scale-110" />
        <div className="mt-1 w-px flex-1 bg-gradient-to-b from-orange-500/40 via-surface-border to-transparent" />
      </div>

      <div className="flex-1 rounded-xl border border-surface-border bg-surface/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-orange-500/40 hover:bg-surface-hover sm:p-5">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-center gap-2">
            <TeamLogo team={rumor.team} size={28} />
            <span className="truncate font-semibold text-gray-200">
              {teamName}
            </span>
            <span className="text-gray-600">·</span>
            <time
              dateTime={rumor.created_at}
              className="text-xs text-gray-500"
            >
              {formatRelativeTime(rumor.created_at)}
            </time>
          </div>
          <ReporterBadge journalist={rumor.journalist} team={rumor.team} />
        </header>

        <h3 className="mb-1.5 text-base font-bold leading-snug text-gray-100 sm:text-lg">
          {rumor.title}
        </h3>
        {rumor.korean_summary && (
          <p className="mb-4 text-sm leading-relaxed text-gray-300">
            {rumor.korean_summary}
          </p>
        )}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-border pt-3">
          <FireThermometer level={interest} />
          {rumor.source_url && (
            <Link
              href={rumor.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-400 transition hover:text-orange-400"
              aria-label="원문 기사 보기 (새 창)"
            >
              원문 보기
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17 17 7M10 7h7v7" />
              </svg>
            </Link>
          )}
        </footer>
      </div>
    </article>
  )
}
