import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    runtime: process.env.NODE_RUNTIME ?? 'nodejs',
    env_set: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(url),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(anon),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(service),
    },
    url_preview: url ? `${url.slice(0, 40)}...` : null,
    anon_key_prefix: anon ? anon.slice(0, 20) : null,
    anon_key_length: anon?.length ?? 0,
    timestamp: new Date().toISOString(),
  })
}
