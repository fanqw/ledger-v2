import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/forms/login-form';
import { getSession } from '@/lib/auth/session';

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.08),transparent_40%),radial-gradient(circle_at_top_right,rgba(15,118,110,0.25),transparent_30%)]" />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
