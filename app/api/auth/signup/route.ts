import { NextResponse } from 'next/server';
import { getDb, rowToUser } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const db = getDb();
  const { name, email, password, role } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(String(email).toLowerCase());
  if (existing) return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });

  const info = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(name, String(email).toLowerCase(), password, role === 'vendor' ? 'vendor' : 'customer');
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json({ ok: true, user: rowToUser(row) }, { status: 201 });
}
