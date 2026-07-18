import { NextResponse } from 'next/server';
import { getDb, rowToOrder, nextOrderId } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/orders?search=&status=
export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').toLowerCase();
  const status = searchParams.get('status');

  const clauses: string[] = [];
  const params: Record<string, unknown> = {};
  if (search) {
    clauses.push('(LOWER(customerName) LIKE @q OR LOWER(item) LIKE @q OR LOWER(id) LIKE @q)');
    params.q = `%${search}%`;
  }
  if (status && status !== 'all') { clauses.push('status = @status'); params.status = status; }

  let sql = 'SELECT * FROM orders';
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY id DESC';

  const rows = db.prepare(sql).all(params);
  return NextResponse.json(rows.map(rowToOrder));
}

// POST /api/orders  — place an order (checkout). Accepts one or many line items.
export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();

  const items: Array<Record<string, unknown>> = Array.isArray(body.items) && body.items.length
    ? body.items
    : [body];

  const insert = db.prepare(`
    INSERT INTO orders (id, productId, item, customerName, email, phone, status, pickupDate, dueDate, days, rate, deposit, lateFee, total, late, deliveryMethod, address, notes)
    VALUES (@id, @productId, @item, @customerName, @email, @phone, @status, @pickupDate, @dueDate, @days, @rate, @deposit, @lateFee, @total, @late, @deliveryMethod, @address, @notes)
  `);

  const created: string[] = [];
  const tx = db.transaction(() => {
    for (const it of items) {
      const id = nextOrderId(db);
      const days = Number(it.days) || 1;
      const rate = Number(it.rate) || 0;
      const deposit = Number(it.deposit) || 0;
      const total = Number(it.total) || rate * days + deposit;
      insert.run({
        id,
        productId: it.productId != null ? Number(it.productId) : null,
        item: String(it.item || it.title || 'Rental Item'),
        customerName: String(body.customerName || it.customerName || 'Guest'),
        email: String(body.email || it.email || ''),
        phone: String(body.phone || it.phone || ''),
        status: 'active',
        pickupDate: String(it.pickup || it.pickupDate || ''),
        dueDate: String(it.returnDate || it.dueDate || ''),
        days,
        rate,
        deposit,
        lateFee: 0,
        total,
        late: 0,
        deliveryMethod: String(body.deliveryMethod || 'pickup'),
        address: String(body.address || ''),
        notes: String(body.notes || ''),
      });
      created.push(id);
    }
  });
  tx();

  return NextResponse.json({ ok: true, orderIds: created }, { status: 201 });
}
