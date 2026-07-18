'use client';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/lib/types';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedAttachment, setSelectedAttachment] = useState('standard');
  const [pickupDate, setPickupDate] = useState('2024-10-15');
  const [returnDate, setReturnDate] = useState('2024-10-20');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Product | null) => {
        setProduct(data);
        if (data?.attachments?.[0]) setSelectedAttachment(data.attachments[0].id);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-[1440px] mx-auto px-6 py-16 text-center text-slate">Loading rental details…</div>;
  }
  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 py-16 text-center">
        <span className="material-symbols-outlined text-slate/30 text-6xl mb-3">inventory_2</span>
        <p className="text-slate mb-4">Item not found.</p>
        <Link href="/browse" className="btn-primary inline-flex">Back to Browse</Link>
      </div>
    );
  }

  const gallery = product.gallery.length ? product.gallery : [product.image];
  const attachment = product.attachments.find((a) => a.id === selectedAttachment) || product.attachments[0] || { id: 'standard', label: 'Standard', price: 0 };
  const days = Math.max(1, Math.round((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24)));
  const baseRate = product.daily;
  const baseTotal = baseRate * days;
  const attachmentCost = attachment.price * days;
  const damageWaiver = 75;
  const taxes = Math.round((baseTotal + attachmentCost) * 0.08);
  const total = baseTotal + attachmentCost + damageWaiver + taxes + product.deposit;

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.name,
      attachment: attachment.label,
      attachmentPrice: attachment.price,
      days,
      rate: baseRate + attachment.price,
      deposit: product.deposit,
      image: product.image,
      pickup: fmtDate(pickupDate),
      returnDate: fmtDate(returnDate),
    });
    setAddedToCart(true);
    setTimeout(() => { router.push('/cart'); }, 700);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="hidden md:flex text-xs text-slate gap-1.5 items-center mb-6">
        <Link href="/browse" className="hover:text-navy">Browse</Link>
        <span className="material-symbols-outlined" style={{fontSize:'14px'}}>chevron_right</span>
        <Link href="/browse" className="hover:text-navy">{product.category}</Link>
        <span className="material-symbols-outlined" style={{fontSize:'14px'}}>chevron_right</span>
        <span className="text-navy font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Image Gallery */}
          <div className="card p-3">
            <div className="relative rounded-lg overflow-hidden h-80 md:h-[480px] mb-3 bg-surface-high cursor-zoom-in group">
              <img
                src={gallery[selectedImg]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded text-xs font-medium text-navy">
                Image {selectedImg + 1} of {gallery.length}
              </div>
            </div>
            <div className="flex gap-2">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`relative h-20 flex-1 rounded-md overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-amber' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Overview + Specs */}
          <div className="card p-6">
            <h2 className="text-h3 text-navy mb-3">Overview</h2>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-5">{product.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {product.specs.map((spec) => (
                <div key={spec.label} className="bg-ivory rounded-lg border border-slate/10 p-3 flex flex-col gap-1.5">
                  <span className="material-symbols-outlined text-slate" style={{fontSize:'20px'}}>{spec.icon}</span>
                  <span className="text-[10px] font-semibold text-slate uppercase tracking-wide">{spec.label}</span>
                  <span className="text-navy font-semibold text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Booking Widget */}
        <div className="lg:col-span-5">
          <div className="card overflow-hidden sticky top-24">
            {/* Widget Header */}
            <div className="p-6 border-b border-slate/10 bg-ivory">
              <h1 className="text-h2 text-navy mb-2">{product.name}</h1>
              <div className="flex items-center gap-3">
                <span className="badge-green">{product.status === 'available' ? 'Available Now' : product.status}</span>
                <span className="flex items-center gap-1 text-sm text-slate">
                  <span className="material-symbols-outlined text-amber" style={{fontSize:'16px', fontVariationSettings:"'FILL' 1"}}>star</span>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Attachment Selector */}
              {product.attachments.length > 1 && (
                <div>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-3">Select Attachment</label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.attachments.map((att) => (
                      <label key={att.id} className="cursor-pointer">
                        <input type="radio" name="attachment" value={att.id} checked={selectedAttachment === att.id} onChange={() => setSelectedAttachment(att.id)} className="sr-only peer" />
                        <div className="p-3 rounded-lg border-2 border-slate/15 peer-checked:border-amber peer-checked:bg-navy peer-checked:text-white transition-all text-center">
                          <p className="text-xs font-semibold">{att.label}</p>
                          <p className="text-xs opacity-70 mt-0.5">{att.price === 0 ? 'Included' : `+$${att.price}/day`}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Range */}
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wide mb-3">Rental Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/50 text-xs font-semibold">PICKUP</span>
                    <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} className="input-field pt-6 pb-2 text-sm" />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate/50 text-xs font-semibold">RETURN</span>
                    <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="input-field pt-6 pb-2 text-sm" />
                  </div>
                </div>
                <p className="text-right text-xs text-slate mt-1.5">
                  Total: <strong className="text-navy">{days} day{days !== 1 ? 's' : ''}</strong>
                </p>
              </div>
            </div>

            {/* Price Summary Ledger */}
            <div className="bg-ivory border-t border-slate/10 p-6">
              <h3 className="text-sm font-semibold text-navy mb-4">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate">Base Rate (${baseRate}/day × {days})</span>
                  <span className="font-currency text-navy">${baseTotal.toLocaleString()}</span>
                </div>
                {attachment.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate">{attachment.label} ({days} days)</span>
                    <span className="font-currency text-navy">+${attachmentCost}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate">Damage Waiver</span>
                  <span className="font-currency text-navy">${damageWaiver}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-slate/10">
                  <span className="text-slate">Taxes & Fees</span>
                  <span className="font-currency text-navy">${taxes}</span>
                </div>
                <div className="ledger-card flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-navy" style={{fontSize:'18px'}}>security</span>
                    <span className="text-xs font-semibold text-navy">Security Deposit</span>
                  </div>
                  <span className="font-currency font-semibold text-navy">${product.deposit}</span>
                </div>
                <p className="text-[11px] text-slate text-right">Fully refundable upon safe return</p>
                <div className="flex justify-between items-end pt-2 border-t-2 border-navy">
                  <span className="font-semibold text-navy">Total Due Today</span>
                  <span className="text-h2 text-navy font-currency">${total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedToCart || product.status === 'booked'}
                className="btn-primary w-full py-3 mt-4 text-sm"
              >
                {product.status === 'booked' ? (
                  'Currently Booked'
                ) : addedToCart ? (
                  <>
                    <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                    Added! Redirecting…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{fontSize:'18px', fontVariationSettings:"'FILL' 1"}}>shopping_cart</span>
                    Add to Cart
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate mt-2">You won&apos;t be charged yet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
