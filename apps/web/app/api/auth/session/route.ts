import { success } from '@/lib/api/response';
import { requireUser } from '@/lib/auth/require-user';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await requireUser();
  if ('error' in result) {
    return result.error;
  }

  return success(result.user);
}
