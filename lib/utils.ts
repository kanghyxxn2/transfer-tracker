/** Tailwind className 조건부 결합. falsy 값은 무시. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(' ')
}

/** ISO timestamp → "3분 전" / "5시간 전" / "2일 전" / "2026.06.30." 형식. */
export function formatRelativeTime(date: string | Date, now: Date = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const diffMs = now.getTime() - d.getTime()
  const past = diffMs >= 0
  const abs = Math.abs(diffMs)
  const sec = Math.floor(abs / 1000)
  const min = Math.floor(sec / 60)
  const hour = Math.floor(min / 60)
  const day = Math.floor(hour / 24)

  const suffix = past ? ' 전' : ' 후'
  if (sec < 60) return past ? '방금 전' : '곧'
  if (min < 60) return `${min}분${suffix}`
  if (hour < 24) return `${hour}시간${suffix}`
  if (day < 7) return `${day}일${suffix}`

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
