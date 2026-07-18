'use client';
import Link from 'next/link';
import { useState } from 'react';

const properties = [
  {
    id: 1,
    title: 'Azure Skyline Penthouse',
    location: 'Downtown District',
    price: 450,
    rating: 4.9,
    beds: 2,
    baths: 2,
    status: 'available',
    tag: 'Featured',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
  {
    id: 2,
    title: 'Villa Paradiso',
    location: 'Coastal Cliffs',
    price: 850,
    rating: 5.0,
    beds: 4,
    baths: 3,
    status: 'available',
    tag: 'Luxury',
    img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
  },
  {
    id: 3,
    title: 'Urban Industrial Loft',
    location: 'Arts District',
    price: 320,
    rating: 0,
    beds: 1,
    baths: 1,
    status: 'available',
    tag: '',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  },
  {
    id: 4,
    title: 'Timberline Retreat',
    location: 'Alpine Valley',
    price: 550,
    rating: 4.8,
    beds: 3,
    baths: 2,
    status: 'available',
    tag: 'Popular',
    img: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&q=80',
  },
  {
    id: 5,
    title: 'Harbour View Suite',
    location: 'Marina Bay',
    price: 720,
    rating: 4.7,
    beds: 2,
    baths: 2,
    status: 'available',
    tag: 'Waterfront',
    img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
  },
  {
    id: 6,
    title: 'Garden Cottage',
    location: 'Hillside Park',
    price: 280,
    rating: 4.6,
    beds: 1,
    baths: 1,
    status: 'available',
    tag: '',
    img: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80',
  },
];

const categories = ['All', 'Luxury Villas', 'Penthouses', 'Corporate Apartments', 'Cabins', 'Waterfront'];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const filtered = properties.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      {/* Category filter bar */}
      <div className="card p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy text-white'
                  : 'bg-ivory text-slate border border-slate/20 hover:border-navy hover:text-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate/50" style={{fontSize:'16px'}}>search</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-8 text-sm w-full sm:w-48 py-2"
            />
          </div>
          <button className="btn-secondary text-xs py-2 px-3">
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>tune</span>
            Filters
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80"
          alt="LuxRent Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="max-w-lg">
            <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">Premium Rentals</p>
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">
              Elevate<br />Your Stay
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6 leading-relaxed">
              Handpicked collection of premium properties and top-tier equipment.
            </p>
            <Link href="/browse" className="btn-primary inline-flex">
              Browse Now
              <span className="material-symbols-outlined" style={{fontSize:'18px'}}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Listings', value: '1,248', icon: 'home' },
          { label: 'Cities', value: '42', icon: 'location_city' },
          { label: 'Happy Clients', value: '8,500+', icon: 'group' },
          { label: 'Avg. Rating', value: '4.9 ★', icon: 'star' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4 text-center">
            <span className="material-symbols-outlined text-amber mb-1" style={{fontSize:'22px'}}>{stat.icon}</span>
            <p className="text-navy font-bold text-xl">{stat.value}</p>
            <p className="text-slate text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Featured Listings */}
      <section>
        <div className="flex justify-between items-center mb-5">
          <h2 className="section-heading text-h2">Featured Listings</h2>
          <Link href="/browse" className="text-amber text-sm font-semibold hover:underline flex items-center gap-1">
            View all
            <span className="material-symbols-outlined" style={{fontSize:'16px'}}>arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((property) => (
            <article key={property.id} className="property-card">
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-surface-high">
                <img
                  src={property.img}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tag */}
                {property.tag && (
                  <span className="absolute top-3 left-3 badge-navy text-[10px]">{property.tag}</span>
                )}
                {/* Rating */}
                {property.rating > 0 && (
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber filled" style={{fontSize:'14px', fontVariationSettings:"'FILL' 1"}}>star</span>
                    <span className="text-navy text-xs font-semibold">{property.rating}</span>
                  </div>
                )}
                {/* Favorite */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleFavorite(property.id); }}
                  className="absolute bottom-3 right-3 p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                >
                  <span className="material-symbols-outlined text-slate" style={{fontSize:'16px', fontVariationSettings: favorites.includes(property.id) ? "'FILL' 1" : "'FILL' 0", color: favorites.includes(property.id) ? '#D97706' : undefined}}>
                    favorite
                  </span>
                </button>
              </div>

              {/* Content */}
              <Link href={`/browse/${property.id}`} className="p-4 flex flex-col gap-2 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-navy text-sm leading-snug line-clamp-1">{property.title}</h3>
                </div>
                <p className="text-slate text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{fontSize:'14px'}}>location_on</span>
                  {property.location}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate/10 mt-auto">
                  <div>
                    <span className="text-navy font-bold text-base">${property.price}</span>
                    <span className="text-slate text-xs">/day</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate text-xs">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{fontSize:'14px'}}>bed</span>
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{fontSize:'14px'}}>shower</span>
                      {property.baths}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <div className="mt-12 card p-8 md:p-12 text-center bg-gradient-to-br from-navy-container to-navy">
        <h2 className="text-white font-bold text-2xl md:text-3xl mb-3">Have a Property to List?</h2>
        <p className="text-on-navy text-sm mb-6">Join thousands of property owners earning with LuxRent.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary px-8">
            Become a Vendor
          </Link>
          <Link href="/browse" className="btn-secondary px-8 border-white/30 text-white hover:bg-white/10">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
