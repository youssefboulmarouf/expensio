import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expensio',
  description: 'Decentralized expense management on Base',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
