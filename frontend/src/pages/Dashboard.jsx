import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'wishlist'
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    setUser(userInfo);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const [bookingsRes, wishlistRes] = await Promise.all([
          axios.get('http://localhost:5000/api/bookings/mybookings', config),
          axios.get('http://localhost:5000/api/auth/wishlist', config)
        ]);
        
        setBookings(bookingsRes.data);
        setWishlist(wishlistRes.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching your data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const generatePDF = async (booking) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFillColor(9, 9, 11);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(22);
      doc.text('TRIPSPHERE', 105, 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Official Travel Invoice & Itinerary', 105, 28, { align: 'center' });
      
      doc.setTextColor(50, 50, 50);
      
      // Customer Details
      doc.setFontSize(14);
      doc.text('Customer Details', 20, 55);
      doc.setFontSize(10);
      doc.text(`Name: ${user.name}`, 20, 62);
      doc.text(`Email: ${user.email}`, 20, 67);
      doc.text(`Booking Ref: #${booking._id}`, 20, 72);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 77);
      
      // Trip Details
      doc.setFontSize(14);
      doc.text('Trip Details', 20, 95);
      doc.setFontSize(10);
      doc.text(`Tour: ${booking.tour?.title || 'Tour Unlisted'}`, 20, 102);
      doc.text(`Destination: ${booking.tour?.destination || 'N/A'}`, 20, 107);
      doc.text(`Duration: ${booking.tour?.duration || 'N/A'} Days`, 20, 112);
      
      let nextY = 117;
      if (booking.startDate && booking.endDate) {
        doc.text(`Travel Dates: ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`, 20, 117);
        nextY = 127;
      } else {
        nextY = 122;
      }
      
      // Itinerary Stops
      if (booking.tour?.itinerary && booking.tour.itinerary.length > 0) {
        doc.setFontSize(14);
        doc.text('Locations / Itinerary', 20, nextY);
        doc.setFontSize(10);
        nextY += 7;
        booking.tour.itinerary.forEach((stop, index) => {
          doc.text(`Day ${index + 1}: ${stop.locationName}`, 20, nextY);
          nextY += 6;
        });
      }
      
      // Bill Amount
      nextY += 10;
      doc.setFontSize(14);
      doc.text('Payment Summary', 20, nextY);
      doc.setFontSize(12);
      doc.text(`Total Paid: INR ${booking.price}`, 20, nextY + 8);
      doc.text(`Status: ${booking.status.toUpperCase()}`, 20, nextY + 14);

      // Try adding image
      if (booking.tour?.image) {
        try {
          const getBase64ImageFromUrl = async (imageUrl) => {
            const res = await fetch(imageUrl);
            const blob = await res.blob();
            return new Promise((resolve, reject) => {
              const reader =  new FileReader();
              reader.addEventListener('load', () => resolve(reader.result));
              reader.readAsDataURL(blob);
            });
          };
          const base64 = await getBase64ImageFromUrl(booking.tour.image);
          doc.addImage(base64, 'JPEG', 120, 55, 70, 70);
        } catch (e) {
          console.warn('Could not load image for PDF due to CORS or network', e);
        }
      }
      
      doc.save(`TripSphere_Bill_${booking._id}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed', error);
      alert('Failed to generate PDF');
    }
  };

  const deleteBookingHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/bookings/${id}`, config);
        setBookings(bookings.filter(b => b._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '1200px' }}>
      <div style={{ background: 'linear-gradient(135deg, #18181b, #27272a)', borderRadius: '4px', padding: '3rem 2rem', color: '#fafafa', marginBottom: '3rem', border: '1px solid #3f3f46', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome, <span style={{ color: '#d4af37', fontWeight: '700' }}>{user?.name}</span></h1>
        <p style={{ fontSize: '1.1rem', margin: 0, color: '#a1a1aa', letterSpacing: '0.5px' }}>Your exclusive luxury travel portfolio.</p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #27272a' }}>
        <button 
          onClick={() => setActiveTab('bookings')}
          style={{ background: 'none', border: 'none', padding: '1rem 2rem', color: activeTab === 'bookings' ? '#d4af37' : '#a1a1aa', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', borderBottom: activeTab === 'bookings' ? '2px solid #d4af37' : '2px solid transparent', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          My Bookings
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          style={{ background: 'none', border: 'none', padding: '1rem 2rem', color: activeTab === 'wishlist' ? '#d4af37' : '#a1a1aa', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', borderBottom: activeTab === 'wishlist' ? '2px solid #d4af37' : '2px solid transparent', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Saved Wishlist ({wishlist.length})
        </button>
      </div>

      {loading ? (
        <h3 style={{ textAlign: 'center', color: '#a1a1aa', marginTop: '3rem', fontWeight: '300' }}>Retrieving your itinerary...</h3>
      ) : error ? (
        <h3 style={{ textAlign: 'center', color: '#ef4444' }}>{error}</h3>
      ) : activeTab === 'bookings' ? (
        bookings.length === 0 ? (
          <div style={{ padding: '4rem 2rem', background: '#18181b', borderRadius: '4px', textAlign: 'center', border: '1px dashed #3f3f46' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🌍</span>
            <h3 style={{ fontSize: '1.8rem', color: '#fafafa', margin: '1rem 0', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>No journeys scheduled</h3>
            <p style={{ color: '#a1a1aa', marginBottom: '2.5rem' }}>It is time to discover your next extraordinary destination.</p>
            <Link to="/" style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#09090b', textDecoration: 'none', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>Explore Tours</Link>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
              {bookings.map((booking) => (
              <div key={booking._id} style={{ 
                display: 'flex', 
                background: '#18181b', 
                borderRadius: '4px', 
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                border: '1px solid #27272a',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#d4af37'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#27272a'; }}
              >
                {booking.tour ? (
                  <>
                    <img src={booking.tour.image} alt={booking.tour.title} style={{ width: '160px', objectFit: 'cover', opacity: 0.85 }} />
                    
                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', color: '#fafafa', fontWeight: '400', letterSpacing: '0.5px' }}>{booking.tour.title}</h3>
                        <span style={{ 
                          background: 'rgba(212, 175, 55, 0.1)', 
                          color: '#d4af37', 
                          padding: '0.3rem 0.8rem', 
                          borderRadius: '2px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          border: '1px solid #d4af37',
                          letterSpacing: '1px'
                        }}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <p style={{ margin: '0 0 1rem', color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>📍 {booking.tour.destination}</p>
                      
                      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #27272a', paddingTop: '1rem' }}>
                        <div>
                          <p style={{ margin: '0 0 0.3rem', color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Purchased</p>
                          <p style={{ margin: 0, color: '#a1a1aa', fontWeight: '400' }}>{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 0.3rem', color: '#71717a', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Amount</p>
                          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#d4af37' }}>₹{booking.price}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '1rem', borderTop: '1px solid #27272a', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={(e) => { e.stopPropagation(); generatePDF(booking); }} style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.85rem' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(212, 175, 55, 0.2)'}} onMouseOut={e=>{e.currentTarget.style.background='rgba(212, 175, 55, 0.1)'}}>
                          Download Bill (PDF)
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={(e) => { e.stopPropagation(); deleteBookingHandler(booking._id); }} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.85rem' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'}}>Delete Booking</button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: '2rem', flex: 1, textAlign: 'center', color: '#a1a1aa' }}>
                    <p>This tour is no longer available.</p>
                    <p style={{ margin: '1rem 0 0', fontSize: '0.85rem' }}>Purchased: {new Date(booking.createdAt).toLocaleDateString()} | ₹{booking.price}</p>
                    {user?.role === 'admin' && (
                      <div style={{ marginTop: '1rem' }}>
                        <button onClick={(e) => { e.stopPropagation(); deleteBookingHandler(booking._id); }} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.85rem' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'}}>Delete Booking</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) ) : (
        wishlist.length === 0 ? (
          <div style={{ padding: '4rem 2rem', background: '#18181b', borderRadius: '4px', textAlign: 'center', border: '1px dashed #3f3f46' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1rem' }}>🤍</span>
            <h3 style={{ fontSize: '1.8rem', color: '#fafafa', margin: '1rem 0', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Wishlist Empty</h3>
            <p style={{ color: '#a1a1aa', marginBottom: '2.5rem' }}>Save your favorite tours here to review them later.</p>
            <Link to="/" style={{ padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#09090b', textDecoration: 'none', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', boxShadow: '0 10px 20px rgba(212,175,55,0.2)' }}>Explore Tours</Link>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {wishlist.map(tour => (
                <Link to={`/tour/${tour._id}`} key={tour._id} style={{ textDecoration: 'none' }}>
                  <div style={{ 
                    border: '1px solid #27272a', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    backgroundColor: '#18181b', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(212,175,55,0.1)'; e.currentTarget.style.borderColor = '#d4af37'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)'; e.currentTarget.style.borderColor = '#27272a'; }}
                  >
                    <div style={{ position: 'relative', height: '240px' }}>
                      <img src={tour.image} alt={tour.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.85' }} />
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(9,9,11,0.9)', padding: '0.4rem 0.8rem', borderRadius: '2px', fontWeight: '700', color: '#d4af37', border: '1px solid #d4af37', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        ₹{tour.price}
                      </div>
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(27,27,31,0.9)', padding: '0.4rem', borderRadius: '50%', color: '#ef4444', fontSize: '1rem', border: '1px solid #27272a' }}>
                        ❤️
                      </div>
                    </div>
                    <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#fafafa', fontWeight: '400', letterSpacing: '0.5px' }}>{tour.title}</h3>
                      <span style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>📍 {tour.destination}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
