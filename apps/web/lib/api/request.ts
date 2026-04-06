import { z } from 'zod';
import { failure } from './response';

export async function readJson<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ data: T } | { error: Response }> {
  const payload = await request.json().catch(() => null);
  const result = schema.safeParse(payload);

  if (!result.success) {
    return {
      error: failure('VALIDATION_ERROR', '请求参数不合法', 422, {
        issues: result.error.flatten(),
      }),
    };
  }

  return { data: result.data };
}
