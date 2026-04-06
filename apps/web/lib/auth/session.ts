import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionUser } from '@ledger/shared';

export const SESSION_COOKIE_NAME = 'ledger_session';

type SessionPayload = SessionUser & {
  exp?: number;
};

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('Missing SESSION_SECRET');
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: SessionUser) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify<SessionPayload>(token, getSecret());
    return verified.payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return await verifySessionToken(token);
}

export async function createSession(user: SessionUser) {
  const token = await signSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
