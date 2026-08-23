import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search state
  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionBoxRef = useRef(null);

  // Advanced Filter state
  const [maxPrice, setMaxPrice] = useState(500000);
  const [minRating, setMinRating] = useState(0);
  const [maxDuration, setMaxDuration] = useState(30);
  const [category, setCategory] = useState('');

  const [wishlist, setWishlist] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/tours');
        setTours(data);
        setFilteredTours(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching tours. Is your backend running?');
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (userInfo) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/auth/wishlist', config);
          // Extract just IDs for quick lookup
          setWishlist(data.map(t => t._id));
        } catch (error) {
          console.error("Error fetching wishlist");
        }
      }
    };

    fetchTours();
    fetchWishlist();
  }, []);

  const toggleWishlist = async (e, tourId) => {
    e.preventDefault(); // Prevent link click
    if (!userInfo) return alert("Please login to save favorites.");
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/auth/wishlist/${tourId}`, {}, config);
      setWishlist(data); // Returns array of ObjectIds
    } catch (err) {
      console.error(err);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real-world location suggestions from OpenStreetMap Nominatim
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchLocation.trim().length > 2) {
        try {
          const { data } = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}&limit=5`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching location suggestions:', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchLocation]);

  const applyFilters = () => {
    setShowSuggestions(false);
    let filtered = tours;

    if (searchLocation.trim() !== '') {
      const lowercasedQuery = searchLocation.toLowerCase();
      const primaryQuery = lowercasedQuery.split(',')[0].trim();
      filtered = filtered.filter(tour => 
        tour.destination.toLowerCase().includes(primaryQuery) || 
        tour.title.toLowerCase().includes(primaryQuery)
      );
    }

    filtered = filtered.filter(tour => 
      tour.price <= maxPrice && 
      (tour.rating || 0) >= minRating && 
      tour.duration <= maxDuration &&
      (category === '' || tour.category === category)
    );

    setFilteredTours(filtered);
  };

  useEffect(() => {
    // Re-apply filters whenever advanced filter state changes, 
    // but only if tours are already loaded.
    if (tours.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line
  }, [maxPrice, minRating, maxDuration, category, tours]);

  const handleSearch = () => {
    applyFilters();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchLocation(suggestion.display_name);
    setShowSuggestions(false);
    // Let the standard handleSearch / applyFilters do the job but with the exact primary name
    const primaryName = suggestion.display_name.split(',')[0].trim();
    
    let filtered = tours.filter(tour => 
      tour.destination.toLowerCase().includes(primaryName.toLowerCase()) || 
      tour.title.toLowerCase().includes(primaryName.toLowerCase())
    );
    
    filtered = filtered.filter(tour => 
      tour.price <= maxPrice && 
      (tour.rating || 0) >= minRating && 
      tour.duration <= maxDuration
    );
    
    setFilteredTours(filtered);
  };

  return (
    <div>
      {/* Hero Section - FULL WIDTH */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(9, 9, 11, 0.9), rgba(24, 24, 27, 0.7)), url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        height: '70vh',
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        width: '100%',
        position: 'relative'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingBottom: '3rem' }}>
          <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', textShadow: '0 4px 30px rgba(0,0,0,0.8)', fontWeight: '300', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Find Your <span style={{ color: '#d4af37', fontWeight: '700', fontStyle: 'italic' }}>Adventure</span>
          </h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.8)', lineHeight: '1.8', fontWeight: '300', color: '#a1a1aa', letterSpacing: '1px' }}>
            Explore the world's most breathtaking destinations with our exclusive, luxury travel experiences.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 20, marginBottom: '4rem' }}>
        <div ref={suggestionBoxRef} style={{ 
          background: 'rgba(24, 24, 27, 0.85)', 
          padding: '1.25rem', 
          borderRadius: '4px', 
          display: 'flex', 
          maxWidth: '900px', 
          margin: '0 auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(15px)',
          border: '1px solid #27272a',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ flex: 1, padding: '0 2rem', borderRight: '1px solid #3f3f46', textAlign: 'left', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#d4af37', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '2px' }}>Destination</label>
            <input 
              type="text"
              placeholder="Where do you want to go?" 
              value={searchLocation}
              onChange={(e) => {
                setSearchLocation(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ 
                border: 'none', 
                background: 'transparent', 
                width: '100%', 
                fontSize: '1.1rem', 
                color: '#fafafa', 
                outline: 'none',
                fontWeight: '300'
              }}
            />
            
            {/* Real-world Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: 'calc(100% + 20px)',
                left: 0,
                right: 0,
                background: '#18181b',
                listStyle: 'none',
                margin: 0,
                padding: '0.5rem 0',
                borderRadius: '4px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                border: '1px solid #27272a',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {suggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}
                    style={{
                      padding: '0.75rem 2rem',
                      cursor: 'pointer',
                      borderBottom: index !== suggestions.length - 1 ? '1px solid #27272a' : 'none',
                      color: '#a1a1aa',
                      fontSize: '0.95rem',
                      transition: 'background 0.2s, color 0.2s',
                      fontWeight: '300'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#d4af37'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#18181b'; e.currentTarget.style.color = '#a1a1aa'; }}
                  >
                    📍 {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button 
            onClick={handleSearch}
            style={{ 
            background: 'linear-gradient(135deg, #d4af37, #b8860b)', 
            color: '#09090b', 
            border: 'none', 
            padding: '1rem 3rem', 
            borderRadius: '4px', 
            fontWeight: '700', 
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px -5px rgba(212, 175, 55, 0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            marginLeft: '1rem'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(212, 175, 55, 0.4)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(212, 175, 55, 0.2)'; }}
          >
            Search
          </button>
        </div>
      </div>


      {/* Container for the cards */}
      <div className="container" style={{ paddingBottom: '4rem', display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
        
        {/* Sidebar Filters */}
        <div style={{ width: '280px', flexShrink: 0, background: '#18181b', padding: '2rem', borderRadius: '4px', border: '1px solid #27272a', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#fafafa', marginBottom: '2rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #27272a', paddingBottom: '1rem' }}>Advanced Search</h3>
          
          {/* Category Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Category
            </label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', background: '#09090b', color: '#fafafa', border: '1px solid #3f3f46', borderRadius: '4px', outline: 'none' }}
            >
              <option value="">All Categories</option>
              <option value="Adventure">Adventure</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Cultural">Cultural</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          {/* Price Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Max Price 
              <span style={{ color: '#d4af37', fontWeight: '700' }}>₹{maxPrice}</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="500000" 
              step="1000" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d4af37' }} 
            />
          </div>

          {/* Duration Filter */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Max Duration 
              <span style={{ color: '#d4af37', fontWeight: '700' }}>{maxDuration} Days</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1" 
              value={maxDuration} 
              onChange={(e) => setMaxDuration(Number(e.target.value))} 
              style={{ width: '100%', accentColor: '#d4af37' }} 
            />
          </div>

          {/* Rating Filter */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Minimum Rating
            </label>
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(Number(e.target.value))}
              style={{ width: '100%', padding: '0.8rem', background: '#09090b', color: '#fafafa', border: '1px solid #3f3f46', borderRadius: '4px', outline: 'none' }}
            >
              <option value="0">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: '#fafafa', margin: '0 0 0.5rem', fontWeight: '300', letterSpacing: '1px', textTransform: 'uppercase' }}>Featured Destinations</h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.1rem', margin: 0, fontWeight: '300' }}>{filteredTours.length} {filteredTours.length === 1 ? 'tour' : 'tours'} found.</p>
            </div>
          </div>
        
        {loading ? (
          <h3 style={{ textAlign: 'center', color: '#a1a1aa', padding: '4rem 0' }}>Curating amazing tours...</h3>
        ) : error ? (
          <h3 style={{ textAlign: 'center', color: '#ef4444', padding: '4rem 0' }}>{error}</h3>
        ) : filteredTours.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', background: '#18181b', borderRadius: '4px', border: '1px dashed #3f3f46' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#a1a1aa', fontWeight: '300' }}>No tours found matching your search.</h3>
            <button onClick={() => { setSearchLocation(''); setFilteredTours(tours); }} style={{ marginTop: '1rem', background: '#27272a', color: '#fafafa', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Clear Search</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '3rem' }}>
            {filteredTours.map(tour => (
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
                    <button 
                      onClick={(e) => toggleWishlist(e, tour._id)}
                      style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(9,9,11,0.8)', border: '1px solid #27272a', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, transition: 'all 0.2s', fontSize: '1.2rem' }}
                      onMouseOver={e=>e.currentTarget.style.transform='scale(1.1)'}
                      onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
                    >
                      {wishlist.includes(tour._id) ? '❤️' : '🤍'}
                    </button>
                    <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(9,9,11,0.9)', padding: '0.4rem 0.8rem', borderRadius: '2px', fontWeight: '700', color: '#d4af37', border: '1px solid #d4af37', fontSize: '0.9rem', letterSpacing: '1px' }}>
                      ₹{tour.price}
                    </div>
                    {tour.category && (
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(212,175,55,0.9)', padding: '0.2rem 0.6rem', borderRadius: '2px', fontWeight: '600', color: '#09090b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {tour.category}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>📍 {tour.destination}</span>
                      <span style={{ color: '#d4af37', fontWeight: '700', fontSize: '1rem' }}>⭐ {(tour.rating || 0).toFixed(1)} <span style={{ color: '#71717a', fontSize: '0.8rem', fontWeight: '400' }}>({tour.numReviews || 0})</span></span>
                    </div>
                    <h3 style={{ margin: '0 0 1rem', fontSize: '1.4rem', color: '#fafafa', fontWeight: '400', letterSpacing: '0.5px' }}>{tour.title}</h3>
                    
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #27272a', paddingTop: '1rem' }}>
                      <span style={{ color: '#71717a', fontSize: '0.9rem', fontWeight: '400', letterSpacing: '0.5px' }}>{tour.duration} DAYS</span>
                      <span style={{ color: '#d4af37', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;
