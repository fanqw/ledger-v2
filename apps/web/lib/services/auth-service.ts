import bcrypt from 'bcryptjs';
import type { SessionUser } from '@ledger/shared';
import { repositories } from '@/lib/db/repositories';
import { AppError } from './errors';

export async function signIn(username: string, password: string): Promise<SessionUser> {
  const user = await repositories.user.findActiveByUsername(username);
  if (!user) {
    throw new AppError('INVALID_CREDENTIALS', '用户名或密码错误', 401);
  }

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) {
    throw new AppError('INVALID_CREDENTIALS', '用户名或密码错误', 401);
  }

  return {
    id: user.id,
    username: user.username,
    role: 'admin',
  };
}
