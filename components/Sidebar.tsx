'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Team } from '@/lib/queries'
import { cn } from '@/lib/utils'

/**
 * 사이드바: 리그별 아코디언 메뉴 + 팀 리스트.
 * - 현재 필터(currentTeam/currentLeague)는 서버에서 searchParams 로 전달.
 * - 아코디언 상태는 로컬 useState (초기展开: currentLeague 또는 Premier League).
 * - 링크는 모두 <Link href="?team=X"> / "?league=Y" → ISR 경로 재생성.
 */
export function Sidebar({
  teams,
  currentTeam,
  currentLeague,
}: {
  teams: Team[]
  currentTeam: string | null
  currentLeague: string | null
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Team[]>()
    for (const t of teams) {
      const arr = map.get(t.league) ?? []
      arr.push(t)
      map.set(t.league, arr)
    }
    return map
  }, [teams])

  const leagues = useMemo(() => Array.from(grouped.keys()), [grouped])

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = currentLeague ?? 'Premier League'
    const seed = leagues.includes(initial)
      ? initial
      : (leagues[0] ?? null)
    return new Set(seed ? [seed] : [])
  })

  const toggle = (league: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(league)) next.delete(league)
      else next.add(league)
      return next
    })
  }

  const isAllView = !currentTeam && !currentLeague

  return (
    <aside className="flex h-full flex-col bg-surface/40">
      {/* 브랜드 헤더 */}
      <div className="border-b border-surface-border px-5 py-5">
        <Link
          href="/"
          className="group flex items-center gap-2"
          aria-label="이적시장 트래커 홈"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-lg shadow-lg shadow-red-900/30 transition group-hover:scale-105">
            ⚽
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-extrabold tracking-tight text-gray-100">
              이적시장 트래커
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-widest text-gray-500">
              Transfer Rumors
            </span>
          </div>
        </Link>
      </div>

      {/* 전체 보기 */}
      <div className="px-3 pt-3">
        <Link
          href="/"
          className={cn(
            'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition',
            isAllView
              ? 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/30'
              : 'text-gray-400 hover:bg-surface-hover hover:text-gray-200',
          )}
        >
          <span>전체 보기</span>
          <span className="text-[10px] text-gray-600">ALL</span>
        </Link>
      </div>

      {/* 리그 아코디언 */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-3"
        aria-label="리그 및 팀 필터"
      >
        <div className="space-y-1">
          {leagues.map((league) => {
            const isOpen = expanded.has(league)
            const teamsInLeague = grouped.get(league) ?? []
            const leagueActive = currentLeague === league
            const anyTeamActive = teamsInLeague.some(
              (t) => t.name_en === currentTeam,
            )
            return (
              <div key={league}>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => toggle(league)}
                    aria-expanded={isOpen}
                    className="group flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-gray-400 transition hover:bg-surface-hover hover:text-gray-200"
                  >
                    <svg
                      className={cn(
                        'h-3 w-3 shrink-0 text-gray-500 transition-transform',
                        isOpen && 'rotate-90',
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="flex-1 truncate">{league}</span>
                    <span className="text-[10px] tabular-nums text-gray-600">
                      {teamsInLeague.length}
                    </span>
                  </button>
                </div>

                {isOpen && (
                  <ul className="mt-0.5 mb-1 space-y-0.5 border-l border-surface-border pl-2 ml-3">
                    <li>
                      <Link
                        href={`/?league=${encodeURIComponent(league)}`}
                        className={cn(
                          'block rounded-md px-3 py-1.5 text-xs transition',
                          leagueActive
                            ? 'bg-orange-500/10 font-semibold text-orange-400 ring-1 ring-orange-500/30'
                            : 'text-gray-500 hover:bg-surface-hover hover:text-gray-300',
                        )}
                      >
                        리그 전체
                      </Link>
                    </li>
                    {teamsInLeague.map((team) => {
                      const active = currentTeam === team.name_en
                      return (
                        <li key={team.id}>
                          <Link
                            href={`/?team=${encodeURIComponent(team.name_en)}`}
                            className={cn(
                              'block truncate rounded-md px-3 py-1.5 text-xs transition',
                              active
                                ? 'bg-orange-500/10 font-semibold text-orange-400 ring-1 ring-orange-500/30'
                                : 'text-gray-400 hover:bg-surface-hover hover:text-gray-200',
                              !active && anyTeamActive && 'opacity-60',
                            )}
                            title={team.name_en}
                          >
                            {team.name_ko}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* 푸터 정보 */}
      <div className="border-t border-surface-border px-5 py-3 text-[10px] text-gray-600">
        <p>총 {teams.length}개 팀 · 5개 리그</p>
        <p className="mt-0.5 text-gray-700">데이터: Supabase · ISR 60s</p>
      </div>
    </aside>
  )
}
