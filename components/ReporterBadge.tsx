import { computeCredibility, tierStyle } from '@/lib/credibility'
import type { Journalist, Team } from '@/lib/queries'

/**
 * 기자 공신력 배지. base_tier + special_tiers 로 계산한 effective tier 표시.
 * specialist 인 경우 ⭐ + 툴팁.
 */
export function ReporterBadge({
  journalist,
  team,
}: {
  journalist: Journalist | null
  team?: Team | null
}) {
  const cred = computeCredibility(journalist, team)
  const style = tierStyle(cred.tier)

  const tooltip = journalist
    ? `${cred.label} · ${style.description}${
        cred.isSpecialist && cred.matchedKey
          ? ` · 이 팀 전문 비트 (${cred.matchedKey})`
          : ''
      }`
    : '출처 미상'

  return (
    <div className="flex shrink-0 items-center gap-1.5" title={tooltip}>
      <span
        className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold leading-none ${style.badge}`}
      >
        {cred.label}
        {cred.isSpecialist && <span aria-hidden>⭐</span>}
      </span>
      <span className="text-xs text-gray-400">
        {journalist?.name ?? '출처 미상'}
      </span>
    </div>
  )
}
