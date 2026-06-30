import Image from 'next/image'
import type { Team } from '@/lib/queries'

/** name_en → 0~359 hue. 색상 기반 fallback 로고 생성용. */
function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 360
  }
  return h
}

/**
 * 팀 로고. logo_url 이 있으면 next/image, 없으면 이니셜+해시 색상 원.
 * 현재 seeds_teams.sql 은 모두 logo_url = null 이라 fallback 이 주로 쓰임.
 */
export function TeamLogo({
  team,
  size = 28,
}: {
  team: Team | null
  size?: number
}) {
  if (!team) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full bg-gray-700 text-[10px] font-bold text-gray-400"
        aria-hidden
      >
        ?
      </div>
    )
  }

  if (team.logo_url) {
    return (
      <Image
        src={team.logo_url}
        alt={`${team.name_ko} 로고`}
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-white/10"
        unoptimized
      />
    )
  }

  const initial = team.name_en.charAt(0).toUpperCase()
  const hue = hashHue(team.name_en)

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: `hsl(${hue}, 45%, 32%)`,
      }}
      className="flex shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ring-1 ring-white/10"
      aria-hidden
    >
      {initial}
    </div>
  )
}
