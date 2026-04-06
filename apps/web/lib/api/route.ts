import { ZodError } from 'zod';
import { AppError } from '@/lib/services/errors';
import { failure } from './response';

export async function handleRoute<T>(action: () => Promise<Response | T>) {
  try {
    const result = await action();
    return result instanceof Response ? result : result;
  } catch (error) {
    if (error instanceof AppError) {
      return failure(error.code, error.message, error.status, error.details);
    }

    if (error instanceof ZodError) {
      return failure('VALIDATION_ERROR', '请求参数不合法', 422, {
        issues: error.flatten(),
      });
    }

    const message = error instanceof Error ? error.message : '服务器内部错误';
    return failure('INTERNAL_ERROR', message, 500);
  }
}
