import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const TourEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Adventure');
  const [rating, setRating] = useState(0);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  
  // Itinerary state
  const [itinerary, setItinerary] = useState([]);
  const [stopSearch, setStopSearch] = useState('');
  const [stopPrice, setStopPrice] = useState(0);
  const [stopSuggestions, setStopSuggestions] = useState([]);
  const [showStopSuggestions, setShowStopSuggestions] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTitle(data.title);
        setPrice(data.price);
        setImage(data.image);
        setDestination(data.destination);
        setCategory(data.category || 'Adventure');
        setDuration(data.duration);
        setDescription(data.description);
        setRating(data.rating);
        setLat(data.lat || 0);
        setLng(data.lng || 0);
        setItinerary(data.itinerary || []);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tour');
        setLoading(false);
      }
    };

    fetchTour();
  }, [id, navigate]);

  // Fetch global locations reliably via Open-Meteo API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (destination.trim().length > 2) {
        try {
          const { data } = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${destination}&count=5`);
          if (data.results) {
            const formatted = data.results.map(loc => ({
              display_name: `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country || ''}`.replace(/,\s*$/, ''),
              lat: loc.latitude,
              lon: loc.longitude
            }));
            setSuggestions(formatted);
          } else {
            setSuggestions([]);
          }
        } catch (err) {
          console.error('Error fetching location suggestions:', err);
        }
      } else {
        setSuggestions([]);
      }
    };
    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [destination]);
  
  // Fetch Stop suggestions (Itinerary)
  useEffect(() => {
    const fetchStopSuggestions = async () => {
      if (stopSearch.trim().length > 2) {
        try {
          const { data } = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${stopSearch}&count=5`);
          if (data.results) {
            const formatted = data.results.map(loc => ({
              display_name: `${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country || ''}`.replace(/,\s*$/, ''),
              lat: loc.latitude,
              lon: loc.longitude
            }));
            setStopSuggestions(formatted);
          } else {
            setStopSuggestions([]);
          }
        } catch (err) {
          console.error('Error fetching stop suggestions:', err);
        }
      } else {
        setStopSuggestions([]);
      }
    };
    const debounceTimer = setTimeout(fetchStopSuggestions, 400);
    return () => clearTimeout(debounceTimer);
  }, [stopSearch]);

  const handleSuggestionClick = async (suggestion) => {
    const primaryName = suggestion.display_name.split(',')[0].trim();
    setDestination(suggestion.display_name);
    setLat(parseFloat(suggestion.lat));
    setLng(parseFloat(suggestion.lon));
    
    if (!title) {
      setTitle(`Amazing ${primaryName} Tour`);
    }
    
    setShowSuggestions(false);

    try {
        // Self-hosted destination images (served from backend /uploads/ folder - always works)
        const destinationImages = {
          'paris': 'http://localhost:5000/uploads/paris.jpg',
          'tokyo': 'http://localhost:5000/uploads/tokyo.jpg',
          'delhi': 'http://localhost:5000/uploads/delhi.jpg',
          'new york': 'http://localhost:5000/uploads/newyork.jpg',
          'london': 'http://localhost:5000/uploads/london.jpg',
          'dubai': 'http://localhost:5000/uploads/dubai.jpg',
          'rome': 'http://localhost:5000/uploads/rome.jpg',
          'bali': 'http://localhost:5000/uploads/bali.jpg',
          'mumbai': 'http://localhost:5000/uploads/mumbai.jpg',
          'singapore': 'http://localhost:5000/uploads/singapore.jpg',
          'bangkok': 'http://localhost:5000/uploads/bangkok.jpg',
          'sydney': 'http://localhost:5000/uploads/sydney.jpg',
          'istanbul': 'http://localhost:5000/uploads/istanbul.jpg',
          'cairo': 'http://localhost:5000/uploads/cairo.jpg',
          'barcelona': 'http://localhost:5000/uploads/barcelona.jpg',
          'maldives': 'http://localhost:5000/uploads/maldives.jpg',
          'switzerland': 'http://localhost:5000/uploads/switzerland.jpg',
          'goa': 'http://localhost:5000/uploads/goa.jpg',
          'jaipur': 'http://localhost:5000/uploads/jaipur.jpg',
          'kolkata': 'http://localhost:5000/uploads/kolkata.jpg',
          'manali': 'http://localhost:5000/uploads/manali.jpg',
          'varanasi': 'http://localhost:5000/uploads/varanasi.jpg',
          'kerala': 'http://localhost:5000/uploads/kerala.jpg',
        };
        const matchedImage = destinationImages[primaryName.toLowerCase()];
        if (matchedImage) {
          setImage(matchedImage);
        } else {
          // Fallback: generic travel image
          setImage('http://localhost:5000/uploads/default.jpg');
        }
      } catch (err) {
        console.error('Error setting image', err);
        setImage('http://localhost:5000/uploads/default.jpg');
      }
  };

  const handleStopSuggestionClick = (suggestion) => {
    const newStop = {
      locationName: suggestion.display_name.split(',')[0].trim(),
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      price: Number(stopPrice)
    };
    
    setItinerary([...itinerary, newStop]);
    // Auto calculate base price
    setPrice(Number(price) + Number(stopPrice));
    
    setStopSearch('');
    setStopPrice(0);
    setShowStopSuggestions(false);
  };
  
  const removeStop = (indexToRemove) => {
    const stopToRemove = itinerary[indexToRemove];
    setPrice(Number(price) - Number(stopToRemove.price));
    setItinerary(itinerary.filter((_, index) => index !== indexToRemove));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      await axios.put(`http://localhost:5000/api/tours/${id}`, {
        title, price, image, destination, category, duration, description, rating, lat, lng, itinerary
      }, config);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/admin" style={{ color: '#a1a1aa', textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>
        &larr; Return to Admin Panel
      </Link>
      <h1 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '2rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Edit <span style={{ color: '#d4af37', fontWeight: '700' }}>Tour</span></h1>

      {loading ? (
        <h3 style={{ color: '#a1a1aa', fontWeight: '300' }}>Loading...</h3>
      ) : error ? (
        <h3 style={{ color: '#ef4444' }}>{error}</h3>
      ) : (
        <form onSubmit={submitHandler} style={{ background: '#18181b', padding: '2.5rem', borderRadius: '4px', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} required />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Price (₹)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Duration (Days)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Rating</label>
              <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} required />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 2, position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Destination</label>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} 
                required 
              />
              
              {showSuggestions && suggestions.length > 0 && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '4px',
                  zIndex: 10,
                  listStyle: 'none',
                  padding: 0,
                  margin: '0.5rem 0 0 0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                }}>
                  {suggestions.map((s, i) => (
                    <li 
                      key={i} 
                      onClick={() => handleSuggestionClick(s)}
                      style={{ padding: '0.8rem 1rem', cursor: 'pointer', borderBottom: i === suggestions.length - 1 ? 'none' : '1px solid #27272a', transition: 'background 0.2s', color: '#fafafa', fontSize: '0.9rem' }}
                      onMouseOver={e=>e.currentTarget.style.background='#27272a'}
                      onMouseOut={e=>e.currentTarget.style.background='transparent'}
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }}
              >
                <option value="Adventure">Adventure</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Cultural">Cultural</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>


          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Latitude</label>
              <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Longitude</label>
              <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none' }} required />
          </div>

          {/* Itinerary Builder */}
          <div style={{ marginBottom: '2.5rem', background: '#09090b', padding: '1.5rem', borderRadius: '4px', border: '1px solid #27272a' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#fafafa', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Package Stops</h3>
            
            {/* List of current stops */}
            {itinerary.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                {itinerary.map((stop, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#18181b', padding: '1rem', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid #27272a' }}>
                    <div style={{ color: '#fafafa' }}>
                      <span style={{ fontWeight: '700', color: '#d4af37' }}>Day {index + 1}: </span> 
                      {stop.locationName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: '#4ade80', fontWeight: '700' }}>+₹{stop.price}</span>
                      <button type="button" onClick={() => removeStop(index)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new stop */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 2, position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Search Attraction</label>
                <input 
                  type="text" 
                  placeholder="e.g. Eiffel Tower"
                  value={stopSearch} 
                  onChange={(e) => {
                    setStopSearch(e.target.value);
                    setShowStopSuggestions(true);
                  }}
                  onFocus={() => setShowStopSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowStopSuggestions(false), 200)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#18181b', color: '#fafafa', outline: 'none' }} 
                />
                
                {showStopSuggestions && stopSuggestions.length > 0 && (
                  <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: '#18181b',
                    listStyle: 'none',
                    margin: '4px 0 0 0',
                    padding: '0.5rem 0',
                    borderRadius: '4px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    border: '1px solid #3f3f46',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 100
                  }}>
                    {stopSuggestions.map((suggestion, index) => (
                      <li 
                        key={index} 
                        onClick={() => handleStopSuggestionClick(suggestion)}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: index !== stopSuggestions.length - 1 ? '1px solid #27272a' : 'none',
                          color: '#fafafa',
                          fontSize: '0.95rem',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#27272a'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        📍 {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Extra Cost (₹)</label>
                <input 
                  type="number" 
                  value={stopPrice} 
                  onChange={(e) => setStopPrice(e.target.value)} 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#18181b', color: '#fafafa', outline: 'none' }} 
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', outline: 'none', resize: 'vertical' }} required></textarea>
          </div>

          <button type="submit" style={{ 
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
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
          }}>
            Update Tour
          </button>
        </form>
      )}
    </div>
  );
};

export default TourEdit;
