import Link from 'next/link'

/**
 * 루머가 없을 때 빈 상태. 두 가지 상황:
 *   - filtered=true:  현재 팀/리그 필터에 결과 없음
 *   - filtered=false: DB 자체에 루머가 없음 (스크래퍼 미실행 등)
 */
export function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-5 text-6xl opacity-70" aria-hidden>
        {filtered ? '🔍' : '⚽'}
      </div>
      <h3 className="mb-2 text-lg font-bold text-gray-200">
        {filtered ? '이 팀/리그의 루머가 없습니다' : '아직 수집된 루머가 없습니다'}
      </h3>
      <p className="mb-6 max-w-md text-sm leading-relaxed text-gray-500">
        {filtered
          ? '다른 팀이나 리그를 선택하거나 전체 보기로 돌아가보세요.'
          : 'Python 스크래퍼가 2시간마다 루머를 수집합니다. 수집된 루머는 여기에 실시간으로 표시됩니다.'}
      </p>
      {filtered && (
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-400 ring-1 ring-orange-500/30 transition hover:bg-orange-500/20"
        >
          ← 전체 보기로 돌아가기
        </Link>
      )}
    </div>
  )
}
