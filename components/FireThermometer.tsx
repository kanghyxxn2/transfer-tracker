import { cn } from '@/lib/utils'

/**
 * interest_level (1~5) 을 "불타는 온도계" Progress bar 로 시각화.
 * 레벨이 올라갈수록 색이 뜨거워짐 (blue → cyan → green → yellow → orange → red).
 * 레벨 4-5: 불꽃 아이콘 + 펄스 애니메이션.
 */
export function FireThermometer({
  level,
  showLabel = true,
}: {
  level: number | null
  showLabel?: boolean
}) {
  const valid = Math.max(1, Math.min(5, level ?? 3))
  const pct = (valid / 5) * 100

  const gradient =
    valid <= 1
      ? 'from-blue-500 to-cyan-400'
      : valid === 2
        ? 'from-cyan-400 to-green-400'
        : valid === 3
          ? 'from-green-400 to-yellow-400'
          : valid === 4
            ? 'from-yellow-400 to-orange-500'
            : 'from-orange-500 to-red-600'

  const hot = valid >= 5
  const warm = valid === 4

  return (
    <div className="flex items-center gap-2" aria-label={`관심도 ${valid}/5`}>
      {showLabel && (
        <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
          관심도
        </span>
      )}
      <div className="relative flex items-center">
        {/* 온도구 전구 (왼쪽 둥근 끝) */}
        <div
          className={cn(
            'h-3 w-3 rounded-full bg-gradient-to-br',
            gradient,
            hot && 'animate-flame-pulse',
          )}
          aria-hidden
        />
        {/* 온도구 몸통 */}
        <div
          className="relative h-2 w-24 overflow-hidden rounded-r-full bg-gray-800"
          aria-hidden
        >
          <div
            className={cn(
              'h-full rounded-r-full bg-gradient-to-r transition-all duration-500',
              gradient,
              hot && 'animate-flame-pulse',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* 뜨거울 때 불꽃 아이콘 */}
        {(hot || warm) && (
          <span
            className={cn(
              'ml-1 text-sm leading-none',
              hot && 'animate-flame-pulse',
            )}
            aria-hidden
          >
            {hot ? '🔥' : '♨️'}
          </span>
        )}
      </div>
      <span
        className={cn(
          'text-xs font-bold tabular-nums',
          hot ? 'text-red-400' : warm ? 'text-orange-400' : 'text-gray-400',
        )}
      >
        {valid}/5
      </span>
    </div>
  )
}
