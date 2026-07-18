import StorefrontHeader from '@/components/layout/StorefrontHeader';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F3EF', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <StorefrontHeader />
      <main style={{ flex: 1 }}>{children}</main>
      <footer style={{ backgroundColor: '#131B2E', color: '#7C839B', padding: '32px 24px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: '#fff', fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>LuxRent</p>
          <p style={{ color: '#7C839B', fontSize: '12px' }}>© 2024 LuxRent. Premium Rental Management Platform.</p>
        </div>
      </footer>
    </div>
  );
}
