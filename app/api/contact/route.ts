import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  const payload = await request.json();
  console.log('[contact]', payload);
  return NextResponse.json({ ok: true });
}
