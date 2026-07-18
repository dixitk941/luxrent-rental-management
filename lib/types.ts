// Shared domain types for the LuxRent backend + frontend.

export type ProductStatus = 'available' | 'low-stock' | 'booked' | 'draft';

export interface Product {
  id: number;
  name: string;
  brand: string;
  sku: string;
  category: string;
  description: string;
  status: ProductStatus;
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  deposit: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];      // additional image urls
  specs: ProductSpec[];
  attachments: Attachment[];
  createdAt: string;
}

export interface ProductSpec {
  icon: string;
  label: string;
  value: string;
}

export interface Attachment {
  id: string;
  label: string;
  price: number;
}

export type OrderStatus = 'active' | 'pending' | 'returned' | 'cancelled';

export interface Order {
  id: string;             // e.g. ORD-0942
  productId: number | null;
  item: string;
  customerName: string;
  email: string;
  phone: string;
  status: OrderStatus;
  pickupDate: string;
  dueDate: string;
  days: number;
  rate: number;
  deposit: number;
  lateFee: number;
  total: number;
  late: boolean;
  deliveryMethod: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'vendor';
  createdAt: string;
}

export interface DashboardData {
  kpis: {
    activeRentals: number;
    overdue: number;
    revenueMtd: number;
    depositsHeld: number;
  };
  overdue: {
    id: string;
    tenant: string;
    property: string;
    amount: number;
    daysLate: number;
    badge: string;
    badgeLabel: string;
  }[];
  activity: {
    icon: string;
    color: string;
    text: string;
    time: string;
  }[];
  revenueTrend: number[];
}
