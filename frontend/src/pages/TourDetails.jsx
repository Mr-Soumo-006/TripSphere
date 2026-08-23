import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  
  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [inWishlist, setInWishlist] = useState(false);

  const fetchTour = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/tours/${id}`);
      setTour(data);
      setLoading(false);
    } catch (err) {
      setError('Error loading tour details');
      setLoading(false);
    }
  };

  const fetchWishlistStatus = async () => {
    if (userInfo) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/auth/wishlist', config);
        setInWishlist(data.some(t => t._id === id));
      } catch (error) {
        console.error("Error fetching wishlist");
      }
    }
  };

  useEffect(() => {
    fetchTour();
    fetchWishlistStatus();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      
      await axios.post(`http://localhost:5000/api/tours/${id}/reviews`, {
        rating,
        comment
      }, config);
      
      setReviewSuccess('Review submitted successfully!');
      setRating(5);
      setComment('');
      fetchTour(); // Refresh tour data to show new review
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message);
    }
  };

  const bookHandler = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    // Redirect to the new custom checkout flow
    navigate(`/checkout/${id}`);
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Loading Tour...</h2>;
  if (error) return <h2 style={{ textAlign: 'center', color: 'red', marginTop: '3rem' }}>{error}</h2>;

  const hasMapCoordinates = tour.lat && tour.lng;

  // Render a Map with bounds to fit all markers
  const MapBounds = ({ locations }) => {
    const map = import('react-leaflet').then(({ useMap }) => {
      // Hook must be inside MapContainer
    });
    // For simplicity, just rendering multiple markers
    return null;
  };

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block', fontWeight: '600' }}>
        &larr; Back to Tours
      </Link>
      
      <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src={tour.image} 
            alt={tour.title} 
            style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', objectFit: 'cover', height: '400px', marginBottom: '2rem' }} 
          />

          {hasMapCoordinates ? (
            <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', height: '400px', position: 'relative', zIndex: 0 }}>
              <MapContainer center={[tour.lat, tour.lng]} zoom={10} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[tour.lat, tour.lng]}>
                  <Popup>
                    <strong>{tour.title}</strong><br />
                    Main Destination
                  </Popup>
                </Marker>
                {/* Map over itinerary array for extra pins */}
                {tour.itinerary && tour.itinerary.map((stop, index) => (
                  <Marker key={index} position={[stop.lat, stop.lng]}>
                    <Popup>
                      <strong>Day {index + 1}: {stop.locationName}</strong>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div style={{ padding: '2rem', background: '#f3f4f6', borderRadius: '16px', textAlign: 'center', color: '#6b7280' }}>
              Map data not available for this tour yet.
            </div>
          )}

          {/* Itinerary UI */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div style={{ marginTop: '2.5rem', background: '#18181b', padding: '2rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #27272a' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#fafafa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '300' }}>Tour Itinerary</h3>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px', background: '#3f3f46' }}></div>
                {tour.itinerary.map((stop, index) => (
                  <div key={index} style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: '#d4af37', 
                      border: '4px solid #18181b',
                      boxShadow: '0 0 0 1px #d4af37',
                      zIndex: 1
                    }}></div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fafafa', marginBottom: '0.25rem', fontWeight: '400' }}>Day {index + 1}: {stop.locationName}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#a1a1aa', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Package Stop</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fafafa', fontWeight: '300', letterSpacing: '1px', textTransform: 'uppercase' }}>{tour.title}</h1>
            <button 
              onClick={async () => {
                if (!userInfo) return alert("Please login to save favorites.");
                try {
                  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                  await axios.post(`http://localhost:5000/api/auth/wishlist/${tour._id}`, {}, config);
                  setInWishlist(!inWishlist);
                } catch (err) {
                  console.error(err);
                }
              }}
              style={{ background: 'transparent', border: '1px solid #27272a', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1.4rem' }}
              onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'}
              onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? '❤️' : '🤍'}
            </button>
          </div>
          <p style={{ fontSize: '1.1rem', color: '#a1a1aa', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            📍 {tour.destination}
          </p>

          <div style={{ padding: '2rem', backgroundColor: '#18181b', borderRadius: '4px', border: '1px solid #d4af37', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #27272a', marginBottom: '1.5rem' }}>
              <span style={{ display: 'block', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Price</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d4af37' }}>₹{tour.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', color: '#a1a1aa', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '400', color: '#fafafa' }}>{tour.duration} Days</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1rem', color: '#a1a1aa', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#d4af37' }}>
                ⭐ {(tour.rating || 0).toFixed(1)}/5 
                <span style={{ fontSize: '0.9rem', color: '#71717a', marginLeft: '0.5rem', fontWeight: '400' }}>
                  ({tour.numReviews || 0} reviews)
                </span>
              </span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fafafa', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '300' }}>Overview</h3>
          <p style={{ lineHeight: '1.8', color: '#a1a1aa', fontSize: '1.05rem', marginBottom: '2rem', fontWeight: '300' }}>
            {tour.description}
          </p>
          
          {bookingMessage && (
            <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', fontWeight: '500', letterSpacing: '1px', textAlign: 'center' }}>
              {bookingMessage}
            </div>
          )}

          <button onClick={bookHandler} style={{ 
            marginTop: 'auto', 
            width: '100%', 
            padding: '1.25rem', 
            background: 'linear-gradient(135deg, #d4af37, #b8860b)', 
            color: '#09090b', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1.1rem', 
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(212, 175, 55, 0.3)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.2)'; }}
          >
            Reserve Now
          </button>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div style={{ marginTop: '5rem', borderTop: '1px solid #27272a', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#fafafa', marginBottom: '2rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Traveler <span style={{ color: '#d4af37', fontWeight: '700' }}>Reviews</span>
        </h2>

        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          
          {/* Reviews List */}
          <div style={{ flex: '2 1 500px' }}>
            {tour.reviews && tour.reviews.length === 0 ? (
              <div style={{ padding: '2rem', background: '#18181b', borderRadius: '4px', border: '1px solid #27272a', color: '#a1a1aa', textAlign: 'center' }}>
                No reviews yet. Be the first to review this tour!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {tour.reviews && tour.reviews.map((review) => (
                  <div key={review._id} style={{ padding: '1.5rem', background: '#18181b', borderRadius: '4px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>
                      <strong style={{ color: '#fafafa', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{review.name}</strong>
                      <span style={{ color: '#d4af37', fontWeight: '700' }}>
                        {'⭐'.repeat(review.rating)}
                      </span>
                    </div>
                    <p style={{ color: '#a1a1aa', margin: '0 0 1rem', lineHeight: '1.6' }}>{review.comment}</p>
                    <p style={{ fontSize: '0.8rem', color: '#71717a', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ background: '#09090b', padding: '2rem', borderRadius: '4px', border: '1px solid #27272a', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fafafa', marginBottom: '1.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Write a Review</h3>
              
              {reviewError && <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', fontSize: '0.9rem' }}>{reviewError}</div>}
              {reviewSuccess && <div style={{ padding: '1rem', marginBottom: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', fontSize: '0.9rem' }}>{reviewSuccess}</div>}

              {userInfo ? (
                <form onSubmit={submitReviewHandler}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Rating</label>
                    <select 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#18181b', color: '#fafafa', outline: 'none' }}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Very Good</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Comment</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      required
                      placeholder="Share your experience..."
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#18181b', color: '#fafafa', outline: 'none', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button type="submit" style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    background: 'transparent',
                    color: '#d4af37', 
                    border: '1px solid #d4af37', 
                    borderRadius: '4px', 
                    fontSize: '0.95rem', 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div style={{ padding: '1.5rem', background: '#18181b', borderRadius: '4px', border: '1px solid #27272a', color: '#a1a1aa', textAlign: 'center' }}>
                  Please <Link to="/login" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: '700' }}>log in</Link> to write a review.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
