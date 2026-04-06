import { NextResponse } from 'next/server';
import type { ApiFailure, ApiSuccess } from '@ledger/shared';

export function success<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json<ApiSuccess<T>>({
    success: true,
    data,
    meta,
  });
}

export function failure(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, unknown>,
) {
  return NextResponse.json<ApiFailure>(
    {
      success: false,
      error: { code, message, details },
    },
    { status },
  );
}
