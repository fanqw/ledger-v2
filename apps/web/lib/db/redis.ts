import { createClient } from 'redis';

declare global {
  // eslint-disable-next-line no-var
  var __redis__:
    | ReturnType<typeof createClient>
    | undefined;
}

export function getRedisClient() {
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!global.__redis__) {
    global.__redis__ = createClient({ url: process.env.REDIS_URL });
    global.__redis__.connect().catch(() => null);
  }

  return global.__redis__;
}
