import { success } from '@/lib/api/response';
import { destroySession } from '@/lib/auth/session';

export async function POST() {
  await destroySession();
  return success({ ok: true });
}
