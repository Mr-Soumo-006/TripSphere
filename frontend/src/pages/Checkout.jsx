import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTour(data);
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startStr = tomorrow.toISOString().split('T')[0];
        setStartDate(startStr);
        
        const end = new Date(tomorrow);
        end.setDate(end.getDate() + (data.duration || 1));
        setEndDate(end.toISOString().split('T')[0]);
        
        setLoading(false);
      } catch (err) {
        setError('Error loading checkout details');
        setLoading(false);
      }
    };
    fetchTour();
  }, [id, navigate, userInfo]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !expiry || !cvc) {
      alert("Please fill in all card details.");
      return;
    }

    setProcessing(true);

    // Simulate network delay for payment processing
    setTimeout(async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Finalize booking
        const { data } = await axios.post(
          'http://localhost:5000/api/bookings',
          { tourId: id, startDate, endDate },
          config
        );

        // Redirect to success page
        navigate(`/success?booking_id=${data._id}`);
      } catch (err) {
        setProcessing(false);
        setError(err.response?.data?.message || err.message);
      }
    }, 2000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#a1a1aa' }}>Initializing Secure Checkout...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error}</div>;
  if (!tour) return null;

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to={`/tour/${id}`} style={{ color: '#a1a1aa', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>
        &larr; Cancel and return to tour
      </Link>
      
      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Payment Form Column */}
        <div style={{ flex: '1 1 500px' }}>
          <h2 style={{ fontSize: '2rem', color: '#fafafa', marginBottom: '2rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Checkout</h2>
          
          <form onSubmit={handlePayment} style={{ background: '#18181b', padding: '2.5rem', borderRadius: '4px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Cardholder Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fafafa', fontSize: '1rem', outline: 'none' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Card Number</label>
              <input 
                type="text" 
                placeholder="4242 4242 4242 4242" 
                maxLength="19"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fafafa', fontSize: '1rem', outline: 'none', letterSpacing: '2px' }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  maxLength="5"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  style={{ width: '100%', padding: '1rem', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fafafa', fontSize: '1rem', outline: 'none', textAlign: 'center' }}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>CVC</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  maxLength="4"
                  value={cvc}
                  onChange={e => setCvc(e.target.value)}
                  style={{ width: '100%', padding: '1rem', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fafafa', fontSize: '1rem', outline: 'none', textAlign: 'center' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={processing}
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                background: processing ? '#3f3f46' : 'linear-gradient(135deg, #d4af37, #b8860b)', 
                color: processing ? '#a1a1aa' : '#09090b', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '1.1rem', 
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: processing ? 'none' : '0 10px 20px rgba(212, 175, 55, 0.2)',
                transition: 'all 0.2s'
              }}
            >
              {processing ? 'Processing Payment...' : `Pay ₹${tour.price}`}
            </button>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#71717a', fontSize: '0.85rem' }}>
              🔒 Payments are secured with 256-bit encryption.
            </p>
          </form>
        </div>

        {/* Order Summary Column */}
        <div style={{ flex: '1 1 350px' }}>
           <div style={{ background: '#09090b', padding: '2rem', borderRadius: '4px', border: '1px solid #27272a', position: 'sticky', top: '100px' }}>
             <h3 style={{ fontSize: '1.2rem', color: '#fafafa', marginBottom: '1.5rem', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>Order Summary</h3>
             
             <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #27272a' }}>
               <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Trip Start Date</label>
               <input 
                 type="date" 
                 value={startDate}
                 min={new Date().toISOString().split('T')[0]}
                 onChange={e => {
                   setStartDate(e.target.value);
                   const start = new Date(e.target.value);
                   const end = new Date(start);
                   end.setDate(end.getDate() + (tour.duration || 1));
                   setEndDate(end.toISOString().split('T')[0]);
                 }}
                 style={{ width: '100%', padding: '0.8rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '4px', color: '#fafafa', fontSize: '1rem', outline: 'none', colorScheme: 'dark' }}
                 required
               />
               {startDate && (
                 <p style={{ margin: '0.8rem 0 0', color: '#a1a1aa', fontSize: '0.9rem' }}>
                   Ends on: <span style={{ color: '#fafafa' }}>{new Date(endDate).toLocaleDateString()}</span>
                 </p>
               )}
             </div>

             <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
               <img src={tour.image} alt={tour.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '2px' }} />
               <div>
                 <h4 style={{ margin: '0 0 0.5rem', color: '#fafafa', fontSize: '1.1rem', fontWeight: '400' }}>{tour.title}</h4>
                 <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📍 {tour.destination}</p>
                 <p style={{ margin: '0.5rem 0 0', color: '#a1a1aa', fontSize: '0.9rem' }}>{tour.duration} Days</p>
               </div>
             </div>

             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#a1a1aa' }}>
               <span>Subtotal</span>
               <span>₹{tour.price}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#a1a1aa' }}>
               <span>Taxes</span>
               <span>₹0</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #27272a', paddingTop: '1.5rem', marginTop: '0.5rem', color: '#fafafa', fontSize: '1.25rem', fontWeight: '500' }}>
               <span>Total</span>
               <span style={{ color: '#d4af37' }}>₹{tour.price}</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
