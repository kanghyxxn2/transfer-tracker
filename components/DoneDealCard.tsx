import Link from 'next/link'
import type { RumorWithRelations } from '@/lib/queries'
import { formatRelativeTime } from '@/lib/utils'
import { TeamLogo } from './TeamLogo'

export function DoneDealCard({ rumor }: { rumor: RumorWithRelations }) {
  const playerName = rumor.player_name ?? '선수 미상'
  const fee = rumor.transfer_fee?.trim()
  const fromTeam = rumor.from_team
  const toTeam = rumor.team

  return (
    <article className="rounded-xl border border-surface-border bg-surface/60 p-4 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/40 hover:bg-surface-hover sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold leading-snug text-gray-100 sm:text-lg">
            {playerName}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            {rumor.title.length > 90
              ? `${rumor.title.slice(0, 90)}…`
              : rumor.title}
          </p>
        </div>
        {fee && (
          <span className="shrink-0 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30 tabular-nums">
            {fee}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-surface-border bg-background/40 px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamLogo team={fromTeam} size={32} />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              FROM
            </p>
            <p className="truncate text-sm font-semibold text-gray-300">
              {fromTeam?.name_ko ?? '자유계약'}
            </p>
          </div>
        </div>

        <svg
          className="h-5 w-5 shrink-0 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <div className="min-w-0 text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              TO
            </p>
            <p className="truncate text-sm font-semibold text-gray-100">
              {toTeam?.name_ko ?? '소속팀 미상'}
            </p>
          </div>
          <TeamLogo team={toTeam} size={32} />
        </div>
      </div>

      <footer className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <time dateTime={rumor.created_at}>
          {formatRelativeTime(rumor.created_at)}
        </time>
        {rumor.source_url && (
          <Link
            href={rumor.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-gray-400 transition hover:text-emerald-400"
            aria-label="원문 기사 보기 (새 창)"
          >
            원문 보기
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </Link>
        )}
      </footer>
    </article>
  )
}

