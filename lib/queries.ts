import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

export type Team = Database['public']['Tables']['teams']['Row']
export type Journalist = Database['public']['Tables']['journalists']['Row']
export type Rumor = Database['public']['Tables']['rumors']['Row']

export type RumorWithRelations = Rumor & {
  team: Team | null
  journalist: Journalist | null
  from_team: Team | null
}

/**
 * Supabase 조인 결과 타입이 느슨하게 추론되는 이슈가 있어
 * 런타임 쿼리 결과를 RumorWithRelations 로 명시 변환.
 * (as unknown as X 는 명시적 타입 단언이지 any 억제가 아님)
 */
function asRumorWithRelations(
  data: unknown[] | null,
): RumorWithRelations[] {
  if (!data) return []
  return data as unknown as RumorWithRelations[]
}

export async function getTeams(): Promise<Team[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('league')
      .order('name_ko')
    if (error) {
      console.error('[queries] getTeams:', error.message)
      return []
    }
    return (data ?? []) as Team[]
  } catch (e) {
    console.error(
      '[queries] getTeams unexpected:',
      e instanceof Error ? e.message : String(e),
    )
    return []
  }
}

export async function getTeamByNameEn(nameEn: string): Promise<Team | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('name_en', nameEn)
      .maybeSingle()
    if (error) {
      console.error('[queries] getTeamByNameEn:', error.message)
      return null
    }
    return (data as Team | null) ?? null
  } catch (e) {
    console.error(
      '[queries] getTeamByNameEn unexpected:',
      e instanceof Error ? e.message : String(e),
    )
    return null
  }
}

export async function getTeamIdsByLeague(league: string): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('teams')
      .select('id')
      .eq('league', league)
    if (error) {
      console.error('[queries] getTeamIdsByLeague:', error.message)
      return []
    }
    return ((data as Array<{ id: string }> | null) ?? []).map((t) => t.id)
  } catch (e) {
    console.error(
      '[queries] getTeamIdsByLeague unexpected:',
      e instanceof Error ? e.message : String(e),
    )
    return []
  }
}

export type RumorFilter =
  | { teamId: string; league?: never }
  | { teamId?: never; league: string }
  | { teamId?: never; league?: never }

export async function getRumors(
  filter: RumorFilter = {},
): Promise<RumorWithRelations[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('rumors')
      .select('*, team:teams!team_id(*), journalist:journalists(*)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter.teamId) {
      query = query.eq('team_id', filter.teamId)
    } else if (filter.league) {
      const teamIds = await getTeamIdsByLeague(filter.league)
      if (teamIds.length === 0) return []
      query = query.in('team_id', teamIds)
    }

    const { data, error } = await query
    if (error) {
      console.error('[queries] getRumors:', error.message)
      return []
    }
    return asRumorWithRelations(data)
  } catch (e) {
    console.error(
      '[queries] getRumors unexpected:',
      e instanceof Error ? e.message : String(e),
    )
    return []
  }
}

export async function getDoneDeals(
  filter: RumorFilter = {},
): Promise<RumorWithRelations[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('rumors')
      .select('*, team:teams!team_id(*), journalist:journalists(*), from_team:teams!from_team_id(*)')
      .eq('is_done_deal', true)
      .order('created_at', { ascending: false })
      .limit(100)

    if (filter.teamId) {
      query = query.eq('team_id', filter.teamId)
    } else if (filter.league) {
      const teamIds = await getTeamIdsByLeague(filter.league)
      if (teamIds.length === 0) return []
      query = query.in('team_id', teamIds)
    }

    const { data, error } = await query
    if (error) {
      console.error('[queries] getDoneDeals:', error.message)
      return []
    }
    return asRumorWithRelations(data)
  } catch (e) {
    console.error(
      '[queries] getDoneDeals unexpected:',
      e instanceof Error ? e.message : String(e),
    )
    return []
  }
}
