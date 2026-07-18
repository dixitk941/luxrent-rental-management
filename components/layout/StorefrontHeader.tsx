'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { label: 'Browse', href: '/browse' },
  { label: 'Categories', href: '/browse?cat=all' },
  { label: 'Deals', href: '/browse?deals=true' },
  { label: 'Support', href: '/support' },
];

const iconSym: React.CSSProperties = {
  fontFamily: "'Material Symbols Outlined'",
  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
  fontSize: '22px',
  lineHeight: 1,
  display: 'inline-block',
  fontStyle: 'normal',
  fontWeight: 'normal',
  textTransform: 'none',
  letterSpacing: 'normal',
  verticalAlign: 'middle',
};

export default function StorefrontHeader() {
  const pathname = usePathname();
  const [cartCount] = useState(2);
  const [searchValue, setSearchValue] = useState('');

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid rgba(100,116,139,0.15)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        {/* Brand + Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexShrink: 0 }}>
          <Link href="/home" style={{ color: '#0F172A', fontWeight: 700, fontSize: '20px', textDecoration: 'none', letterSpacing: '-0.01em' }}>
            LuxRent
          </Link>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ ...iconSym, position: 'absolute', left: '10px', color: 'rgba(100,116,139,0.5)', fontSize: '18px' }}>search</span>
            <input
              type="text"
              placeholder="Search properties or equipment..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ paddingLeft: '34px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', border: '1px solid rgba(100,116,139,0.2)', borderRadius: '6px', backgroundColor: '#F5F3EF', outline: 'none', width: '260px', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px', borderRadius: '6px', fontSize: '14px', textDecoration: 'none',
                color: pathname === link.href ? '#0F172A' : '#64748B',
                backgroundColor: pathname === link.href ? 'rgba(15,23,42,0.06)' : 'transparent',
                fontWeight: pathname === link.href ? 600 : 500,
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/cart" style={{ position: 'relative', padding: '8px', borderRadius: '6px', color: '#64748B', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <span style={iconSym}>shopping_cart</span>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#D97706', color: '#fff', fontSize: '10px', fontWeight: 700, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <button style={{ padding: '8px', borderRadius: '6px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <span style={iconSym}>notifications</span>
          </button>
          <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#131B2E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
              U
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
