import { NextResponse } from 'next/server';
import { getDb, rowToProduct } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/products?search=&category=&status=&sort=
export async function GET(request: Request) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get('search') || '').toLowerCase();
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const sort = searchParams.get('sort');

  const clauses: string[] = [];
  const params: Record<string, unknown> = {};
  if (search) {
    clauses.push('(LOWER(name) LIKE @q OR LOWER(brand) LIKE @q OR LOWER(sku) LIKE @q)');
    params.q = `%${search}%`;
  }
  if (category && category !== 'all') { clauses.push('category = @category'); params.category = category; }
  if (status && status !== 'all') { clauses.push('status = @status'); params.status = status; }

  let sql = 'SELECT * FROM products';
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  if (sort === 'price-asc') sql += ' ORDER BY daily ASC';
  else if (sort === 'price-desc') sql += ' ORDER BY daily DESC';
  else sql += ' ORDER BY id ASC';

  const rows = db.prepare(sql).all(params);
  return NextResponse.json(rows.map(rowToProduct));
}

// POST /api/products
export async function POST(request: Request) {
  const db = getDb();
  const body = await request.json();
  if (!body.name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

  const info = db.prepare(`
    INSERT INTO products (name, brand, sku, category, description, status, hourly, daily, weekly, monthly, deposit, rating, reviews, image, gallery, specs, attachments)
    VALUES (@name, @brand, @sku, @category, @description, @status, @hourly, @daily, @weekly, @monthly, @deposit, @rating, @reviews, @image, @gallery, @specs, @attachments)
  `).run({
    name: body.name,
    brand: body.brand || '',
    sku: body.sku || '',
    category: body.category || 'Furniture',
    description: body.description || '',
    status: body.status || 'available',
    hourly: Number(body.hourly) || 0,
    daily: Number(body.daily) || 0,
    weekly: Number(body.weekly) || 0,
    monthly: Number(body.monthly) || Number(body.rate) || 0,
    deposit: Number(body.deposit) || 0,
    rating: Number(body.rating) || 4.8,
    reviews: Number(body.reviews) || 0,
    image: body.image || '',
    gallery: JSON.stringify(body.gallery || []),
    specs: JSON.stringify(body.specs || []),
    attachments: JSON.stringify(body.attachments || [{ id: 'standard', label: 'Standard', price: 0 }]),
  });

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  return NextResponse.json(rowToProduct(row), { status: 201 });
}
