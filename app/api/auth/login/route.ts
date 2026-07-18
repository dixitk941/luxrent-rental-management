import { NextResponse } from 'next/server';
import { getDb, rowToUser } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const db = getDb();
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase()) as
    | { id: number; name: string; email: string; password: string; role: string; createdAt: string }
    | undefined;

  if (!row || row.password !== password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: rowToUser(row) });
}
