import { AppShell } from '@/components/layout/app-shell';
import { getSession } from '@/lib/auth/session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return <AppShell username={session?.username ?? 'admin'}>{children}</AppShell>;
}
