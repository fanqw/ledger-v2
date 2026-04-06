'use client';

import { useState } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import type { LoginInput, SessionUser } from '@ledger/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient, unwrap } from '@/lib/api/client';
import { loginSchema } from '@/lib/validators/auth';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/auth-slice';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: 'admin', password: 'admin123456' },
  });

  return (
    <Card className="w-full max-w-md border-none bg-white/95 p-8">
      <div className="mb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-accent">ledger v2</div>
        <h1 className="mt-3 text-3xl font-semibold">登录后台</h1>
        <p className="mt-2 text-sm text-slate-500">使用会话鉴权接入全栈管理系统。</p>
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError('');
          try {
            const user = await unwrap<SessionUser>(apiClient.post('/auth/login', values));
            dispatch(setUser(user));
            const redirect = searchParams.get('redirect');
            const nextRoute =
              redirect && redirect.startsWith('/') && !redirect.startsWith('//')
                ? (redirect as Route)
                : ('/' as Route);
            router.replace(nextRoute);
          } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : '登录失败');
          }
        })}
      >
        <div>
          <label className="mb-2 block text-sm font-medium">用户名</label>
          <Input {...register('username')} placeholder="请输入用户名" />
          {errors.username ? <p className="mt-2 text-sm text-danger">{errors.username.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">密码</label>
          <Input {...register('password')} type="password" placeholder="请输入密码" />
          {errors.password ? <p className="mt-2 text-sm text-danger">{errors.password.message}</p> : null}
        </div>
        {error ? <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? '登录中...' : '登录'}
        </Button>
      </form>
    </Card>
  );
}
