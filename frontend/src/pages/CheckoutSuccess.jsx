import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CheckoutSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container" style={{ padding: '6rem 0', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <div style={{ 
        width: '80px', 
        height: '80px', 
        borderRadius: '50%', 
        background: 'rgba(212, 175, 55, 0.1)', 
        border: '2px solid #d4af37',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 2rem',
        color: '#d4af37',
        fontSize: '2.5rem'
      }}>
        ✓
      </div>
      
      <h1 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '1rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Successful</h1>
      
      <p style={{ fontSize: '1.1rem', color: '#a1a1aa', marginBottom: '2.5rem', lineHeight: '1.6' }}>
        Thank you for your purchase. Your luxury travel experience has been confirmed.
        {bookingId && <span style={{ display: 'block', marginTop: '1rem' }}><span style={{ fontSize: '0.9rem', color: '#71717a' }}>Booking Reference: #{bookingId}</span></span>}
      </p>

      <Link to="/dashboard" style={{ 
        display: 'inline-block',
        padding: '1rem 3rem', 
        background: 'transparent',
        color: '#d4af37', 
        border: '1px solid #d4af37', 
        borderRadius: '4px', 
        fontSize: '1rem', 
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        textDecoration: 'none',
        transition: 'all 0.2s'
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }}
      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        View My Bookings
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
