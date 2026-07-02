import Link from 'next/link'
import { getDoneDeals, getTeams, getTeamByNameEn } from '@/lib/queries'
import { Sidebar } from '@/components/Sidebar'
import { DoneDealCard } from '@/components/DoneDealCard'
import { Tabs } from '@/components/Tabs'

export const revalidate = 60

type SearchParams = {
  team?: string
  league?: string
}

export default async function DoneDealsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const teams = await getTeams()

  const teamFilter = searchParams.team
  const leagueFilter = searchParams.league

  let deals
  let heading: { title: string; subtitle: string }

  if (teamFilter) {
    const team = await getTeamByNameEn(teamFilter)
    deals = team ? await getDoneDeals({ teamId: team.id }) : []
    heading = team
      ? {
          title: team.name_ko,
          subtitle: `${team.league} · ${team.name_en} 확정 이적`,
        }
      : { title: '알 수 없는 팀', subtitle: '잘못된 팀 필터입니다.' }
  } else if (leagueFilter) {
    deals = await getDoneDeals({ league: leagueFilter })
    heading = {
      title: leagueFilter,
      subtitle: `${leagueFilter} 전체 팀 확정 이적`,
    }
  } else {
    deals = await getDoneDeals()
    heading = {
      title: '확정 이적',
      subtitle: "BBC · Fabrizio Romano 등 'Here we go' 확정 건만",
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
        <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-surface-border pb-5">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-emerald-500">
              {filtered ? 'FILTERED' : 'CONFIRMED'}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-50 sm:text-3xl">
              {heading.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{heading.subtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">최근 100건</p>
            <p className="text-sm font-bold text-gray-300 tabular-nums">
              {deals.length}건
            </p>
          </div>
        </header>

        <Tabs />

        {deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface/30 px-6 py-20 text-center">
            <span className="mb-3 text-4xl">✅</span>
            <h2 className="mb-1 text-lg font-bold text-gray-300">
              확정 이적이 없습니다
            </h2>
            <p className="max-w-sm text-sm text-gray-500">
              {filtered
                ? '이 필터 조건에 해당하는 확정 이적 건이 아직 수집되지 않았습니다.'
                : 'BBC/Romano 등에서 "Here we go"가 뜨면 자동으로 표시됩니다.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {deals.map((deal) => (
              <DoneDealCard key={deal.id} rumor={deal} />
            ))}
          </div>
        )}

        <footer className="mt-12 flex flex-col items-center gap-2 border-t border-surface-border py-8 text-center text-xs text-gray-600">
          <p>데이터: Supabase · 캐시: ISR 60s · 호스팅: Vercel</p>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 transition hover:text-emerald-400"
          >
            source ↗
          </Link>
        </footer>
      </main>
    </div>
  )
}
