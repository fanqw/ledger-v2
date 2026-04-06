'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ListOrdered, Package2, Ruler, Shapes, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/client';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/' as Route, label: '总览', icon: LayoutDashboard },
  { href: '/categories' as Route, label: '分类', icon: Shapes },
  { href: '/units' as Route, label: '单位', icon: Ruler },
  { href: '/commodities' as Route, label: '商品', icon: Package2 },
  { href: '/orders' as Route, label: '订单', icon: ListOrdered },
];

export function AppShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-[28px] bg-ink p-5 text-white shadow-panel">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.3em] text-teal-200">Ledger v2</div>
            <div className="mt-3 text-2xl font-semibold">全栈后台</div>
            <div className="mt-2 text-sm text-slate-300">欢迎，{username}</div>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                    active ? 'bg-white text-ink' : 'text-slate-300 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 border-t border-white/10 pt-6">
            <Button
              variant="ghost"
              className="w-full justify-start bg-white/5 text-white hover:bg-white/10"
              onClick={async () => {
                await apiClient.post('/auth/logout');
                router.replace('/login' as Route);
              }}
            >
              <LogOut size={16} className="mr-2" />
              退出登录
            </Button>
          </div>
        </aside>
        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
