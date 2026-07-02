export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name_en: string
          name_ko: string
          league: string
          logo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ko: string
          league: string
          logo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ko?: string
          league?: string
          logo_url?: string | null
          created_at?: string
        }
      }
      journalists: {
        Row: {
          id: string
          name: string
          base_tier: number | null
          special_tiers: Record<string, number>
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          base_tier?: number | null
          special_tiers?: Record<string, number>
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          base_tier?: number | null
          special_tiers?: Record<string, number>
          description?: string | null
          created_at?: string
        }
      }
      media_outlets: {
        Row: {
          id: string
          name: string
          reliability: 'High' | 'Medium' | 'Low' | 'Unknown' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          reliability?: 'High' | 'Medium' | 'Low' | 'Unknown' | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          reliability?: 'High' | 'Medium' | 'Low' | 'Unknown' | null
          notes?: string | null
          created_at?: string
        }
      }
      rumors: {
        Row: {
          id: string
          team_id: string | null
          journalist_id: string | null
          title: string
          korean_summary: string | null
          interest_level: number | null
          source_url: string | null
          player_name: string | null
          transfer_fee: string | null
          from_team_id: string | null
          is_done_deal: boolean
          created_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          journalist_id?: string | null
          title: string
          korean_summary?: string | null
          interest_level?: number | null
          source_url?: string | null
          player_name?: string | null
          transfer_fee?: string | null
          from_team_id?: string | null
          is_done_deal?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          journalist_id?: string | null
          title?: string
          korean_summary?: string | null
          interest_level?: number | null
          source_url?: string | null
          player_name?: string | null
          transfer_fee?: string | null
          from_team_id?: string | null
          is_done_deal?: boolean
          created_at?: string
        }
      }
    }
    Views: { [key: string]: never }
    Functions: { [key: string]: never }
    Enums: { [key: string]: never }
  }
}
