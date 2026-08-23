const Footer = () => {
  return (
    <footer style={{ 
      background: '#111827', 
      color: '#9ca3af', 
      padding: '3rem 2rem', 
      marginTop: 'auto',
      textAlign: 'center'
    }}>
      <div className="container">
        <h2 style={{ color: 'white', marginBottom: '1rem' }}>🌍 TripSphere Travel</h2>
        <p style={{ maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
          Your gateway to the world's most extraordinary destinations. We curate experiences that last a lifetime.
        </p>
        <div style={{ borderTop: '1px solid #374151', paddingTop: '2rem', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} TripSphere Travel Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
