import { readJson } from '@/lib/api/request';
import { handleRoute } from '@/lib/api/route';
import { success } from '@/lib/api/response';
import { createSession } from '@/lib/auth/session';
import { signIn } from '@/lib/services/auth-service';
import { loginSchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  return handleRoute(async () => {
    const payload = await readJson(request, loginSchema);
    if ('error' in payload) {
      return payload.error;
    }

    const user = await signIn(payload.data.username, payload.data.password);
    await createSession(user);
    return success(user);
  });
}
