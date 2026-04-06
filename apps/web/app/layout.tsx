import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Ledger v2',
  description: '全栈账务后台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
