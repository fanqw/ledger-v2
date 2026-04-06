import { failure } from '@/lib/api/response';
import { getSession } from './session';

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    return { error: failure('UNAUTHORIZED', '请先登录', 401) };
  }

  return { user: session };
}
