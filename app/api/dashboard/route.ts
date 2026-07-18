import { NextResponse } from 'next/server';
import { getDb, rowToOrder } from '@/lib/db';
import type { DashboardData } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();

  const active = (db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'active'").get() as { c: number }).c;
  const pending = (db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'").get() as { c: number }).c;
  const revenue = (db.prepare("SELECT COALESCE(SUM(total - deposit), 0) AS s FROM orders").get() as { s: number }).s;
  const deposits = (db.prepare("SELECT COALESCE(SUM(deposit), 0) AS s FROM orders WHERE status IN ('active','pending')").get() as { s: number }).s;

  const attention = db.prepare("SELECT * FROM orders WHERE status = 'pending' OR late = 1 ORDER BY id DESC").all().map(rowToOrder);

  const data: DashboardData = {
    kpis: {
      activeRentals: active,
      overdue: pending,
      revenueMtd: revenue,
      depositsHeld: deposits,
    },
    overdue: attention.map((o) => ({
      id: o.id,
      tenant: o.customerName,
      property: o.item,
      amount: o.total,
      daysLate: o.late ? 12 : 3,
      badge: o.late ? 'badge-red' : 'badge-amber',
      badgeLabel: o.late ? 'Overdue' : 'Grace Period',
    })),
    activity: [
      { icon: 'check_circle', color: 'text-emerald-500', text: 'Payment received from James Park — $2,800', time: '2 min ago' },
      { icon: 'error', color: 'text-amber', text: 'Overdue notice sent to Sarah Jenkins', time: '15 min ago' },
      { icon: 'add_circle', color: 'text-navy', text: 'New rental: CAT 320 Excavator booked by Elena Rostova', time: '1 hr ago' },
      { icon: 'assignment_return', color: 'text-slate', text: 'Return processed: Toyota Forklift — James Park', time: '3 hr ago' },
    ],
    revenueTrend: [40, 65, 45, 80, 55, 90, 72],
  };

  return NextResponse.json(data);
}
