import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '머니 문장 — 오늘의 재테크 명언',
  description: '재테크 명언을 읽고, 이해하고, 오늘의 작은 행동으로 연결하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
