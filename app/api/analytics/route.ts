import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[analytics]', body?.name, body?.value);
  } catch (error) {
    console.error('[analytics:error]', error);
  }
  return NextResponse.json({ ok: true });
}
