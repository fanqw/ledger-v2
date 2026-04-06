'use client';

import axios from 'axios';
import type { ApiResult } from '@ledger/shared';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  validateStatus: () => true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function unwrap<T>(promise: Promise<{ data: ApiResult<T> }>) {
  const { data } = await promise;
  if (!data.success) {
    throw new Error(data.error.message);
  }

  return data.data;
}
