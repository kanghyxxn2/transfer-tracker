import Link from 'next/link'
import { getRumors, getTeams, getTeamByNameEn } from '@/lib/queries'
import { Sidebar } from '@/components/Sidebar'
import { RumorFeed } from '@/components/RumorFeed'

// ISR: 60초마다 재생성. Vercel free tier 에서도 충분히 작동.
export const revalidate = 60

type SearchParams = {
  team?: string
  league?: string
}

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const teams = await getTeams()

  const teamFilter = searchParams.team
  const leagueFilter = searchParams.league

  let rumors
  let heading: { title: string; subtitle: string }

  if (teamFilter) {
    const team = await getTeamByNameEn(teamFilter)
    rumors = team ? await getRumors({ teamId: team.id }) : []
    heading = team
      ? {
          title: team.name_ko,
          subtitle: `${team.league} · ${team.name_en} 관련 루머`,
        }
      : { title: '알 수 없는 팀', subtitle: '잘못된 팀 필터입니다.' }
  } else if (leagueFilter) {
    rumors = await getRumors({ league: leagueFilter })
    heading = {
      title: leagueFilter,
      subtitle: `${leagueFilter} 전체 팀 루머`,
    }
  } else {
    rumors = await getRumors()
    heading = {
      title: '전체 루머',
      subtitle: '공신력 기자가 보도한 최근 이적 루머',
    }
  }

  const filtered = Boolean(teamFilter || leagueFilter)

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl">
      <div className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-surface-border lg:block">
        <Sidebar
          teams={teams}
          currentTeam={teamFilter ?? null}
          currentLeague={leagueFilter ?? null}
        />
      </div>

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b border-surface-border pb-5">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-orange-500">
              {filtered ? 'FILTERED' : 'LATEST'}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-50 sm:text-3xl">
              {heading.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{heading.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">최근 50건</p>
            <p className="text-sm font-bold text-gray-300 tabular-nums">
              {rumors.length}루머
            </p>
          </div>
        </header>

        <RumorFeed rumors={rumors} filtered={filtered} />

        <footer className="mt-12 flex flex-col items-center gap-2 border-t border-surface-border py-8 text-center text-xs text-gray-600">
          <p>
            데이터: Supabase · 캐시: ISR 60s · 호스팅: Vercel
          </p>
          <p>
            기자 공신력은 base_tier + special_tiers 를 프론트엔드에서 계산합니다.
          </p>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 transition hover:text-orange-400"
          >
            source ↗
          </Link>
        </footer>
      </main>
    </div>
  )
}
