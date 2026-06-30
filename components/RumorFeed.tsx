import type { RumorWithRelations } from '@/lib/queries'
import { RumorCard } from './RumorCard'
import { EmptyState } from './EmptyState'

/**
 * 루머 리스트. 결과가 없으면 EmptyState 렌더.
 */
export function RumorFeed({
  rumors,
  filtered,
}: {
  rumors: RumorWithRelations[]
  filtered: boolean
}) {
  if (rumors.length === 0) {
    return <EmptyState filtered={filtered} />
  }
  return (
    <div className="space-y-3 sm:space-y-4">
      {rumors.map((rumor) => (
        <RumorCard key={rumor.id} rumor={rumor} />
      ))}
    </div>
  )
}
