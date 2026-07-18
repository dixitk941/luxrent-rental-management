import { NextResponse } from 'next/server';
import { getDb, rowToOrder } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const db = getDb();
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rowToOrder(row));
}

// PATCH /api/orders/[id] — process return, update status / late fee.
export async function PATCH(request: Request, { params }: Ctx) {
  const { id } = await params;
  const db = getDb();
  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await request.json();
  const sets: string[] = [];
  const values: Record<string, unknown> = { id };
  for (const f of ['status', 'lateFee', 'notes', 'dueDate'] as const) {
    if (body[f] !== undefined) { sets.push(`${f} = @${f}`); values[f] = body[f]; }
  }
  if (sets.length) db.prepare(`UPDATE orders SET ${sets.join(', ')} WHERE id = @id`).run(values);

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  return NextResponse.json(rowToOrder(row));
}
