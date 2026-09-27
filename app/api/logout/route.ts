import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Remove o cooconst cookieStore = await cookies();

  cookieStore.delete('clientId');
  return NextResponse.json({ ok: true }, { status: 200 });
  // Se tiver outros cookies de auth, remova também:
  // cookieStore.delete('session');
  // cookieStore.delete('auth');
}
