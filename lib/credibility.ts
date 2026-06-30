// 기자 공신력 등급 (lower number = higher credibility, 직관과 반대):
//   0=최상위 글로벌(Ornstein) 1=메이저/클럽 1티어 1.5=신뢰 라이터
//   2=일반 루머 3=클릭베이트  NULL=미평가 ("?")
// special_tiers: 특정 클럽/리그 전문성 JSONB. 예) {"Arsenal": 0, "Premier League": 1}
// rumor 의 team.name_en / team.league 를 키로 조회해 base_tier 보다 더 공신력 있는 등급 우선.

export type CredibilitySource = 'special_team' | 'special_league' | 'base' | 'unrated'

export type CredibilityTier = {
  /** null = 미평가 */
  tier: number | null
  /** "Tier 0" | "Tier 1.5" | "?" */
  label: string
  /** 이 등급이 어떻게 결정됐는지 */
  source: CredibilitySource
  /** special_tiers 에서 매칭된 키 (팀명/리그명) */
  matchedKey?: string
  /** special_tiers 매칭이 적용됐는지 */
  isSpecialist: boolean
}

type JournalistLike = {
  base_tier: number | null
  special_tiers: Record<string, number>
}

type TeamLike = {
  name_en: string
  league: string
}

function tierLabel(tier: number | null): string {
  if (tier === null) return '?'
  return `Tier ${tier}`
}

/**
 * base_tier + special_tiers 로 실제 화면에 보여줄 effective tier 계산.
 * special_tiers 에 team.name_en / team.league 중 하나라도 있으면 base_tier 보다 우선하고,
 * 둘 다 있으면 더 낮은(더 공신력 있는) 쪽을 채택. 동점이면 팀(구체적) 우선.
 */
export function computeCredibility(
  journalist: JournalistLike | null,
  team?: TeamLike | null,
): CredibilityTier {
  if (!journalist) {
    return { tier: null, label: '?', source: 'unrated', isSpecialist: false }
  }

  const candidates: Array<{
    tier: number
    source: 'special_team' | 'special_league'
    key: string
  }> = []

  if (team) {
    const teamTier = journalist.special_tiers?.[team.name_en]
    if (typeof teamTier === 'number') {
      candidates.push({ tier: teamTier, source: 'special_team', key: team.name_en })
    }
    const leagueTier = journalist.special_tiers?.[team.league]
    if (typeof leagueTier === 'number') {
      candidates.push({ tier: leagueTier, source: 'special_league', key: team.league })
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier
      if (a.source === 'special_team' && b.source !== 'special_team') return -1
      if (b.source === 'special_team' && a.source !== 'special_team') return 1
      return 0
    })
    const best = candidates[0]
    return {
      tier: best.tier,
      label: tierLabel(best.tier),
      source: best.source,
      matchedKey: best.key,
      isSpecialist: true,
    }
  }

  if (journalist.base_tier === null || journalist.base_tier === undefined) {
    return { tier: null, label: '?', source: 'unrated', isSpecialist: false }
  }

  return {
    tier: journalist.base_tier,
    label: tierLabel(journalist.base_tier),
    source: 'base',
    isSpecialist: false,
  }
}

export type TierStyle = {
  /** 배지 배경 Tailwind 클래스 */
  badge: string
  /** 본문 텍스트용 색상 클래스 */
  text: string
  /** 등급 설명 (한글, 툴팁/레이블용) */
  description: string
}

/**
 * tier → 다크 테마 배지/텍스트 Tailwind 클래스 + 등급 설명(툴팁용).
 */
export function tierStyle(tier: number | null): TierStyle {
  if (tier === null) {
    return {
      badge:
        'bg-gray-800/60 border border-dashed border-gray-600 text-gray-400',
      text: 'text-gray-400',
      description: '미평가 기자',
    }
  }
  if (tier === 0) {
    return {
      badge:
        'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-red-900/30',
      text: 'text-orange-300',
      description: '최상위 글로벌',
    }
  }
  if (tier <= 1) {
    return {
      badge: 'bg-red-600 text-white',
      text: 'text-red-400',
      description: '메이저 매체 / 클럽 1티어 비트',
    }
  }
  if (tier <= 1.5) {
    return {
      badge: 'bg-amber-500 text-black',
      text: 'text-amber-300',
      description: '신뢰 가능한 라이터',
    }
  }
  if (tier <= 2) {
    return {
      badge: 'bg-yellow-400 text-black',
      text: 'text-yellow-200',
      description: '일반 루머 소스',
    }
  }
  return {
    badge: 'bg-gray-600 text-gray-100',
    text: 'text-gray-400',
    description: '루머 / 클릭베이트성',
  }
}
