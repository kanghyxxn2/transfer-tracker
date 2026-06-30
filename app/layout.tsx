import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '이적시장 트래커 | Transfer Rumor Tracker',
  description:
    '공신력 있는 기자만 필터링해서 보여주는 축구 이적 루머 타임라인. 프리미어리그 · 라리가 · 분데스리가 · 세리에A · 리그1.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
