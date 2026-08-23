import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        minHeight: '75vh', 
        background: '#18181b', 
        borderRadius: '4px', 
        overflow: 'hidden', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        border: '1px solid #27272a'
      }}>
      
      {/* Left side - Form */}
      <div style={{ flex: '1', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '0.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Create <span style={{ color: '#d4af37', fontWeight: '700' }}>Account</span></h2>
        <p style={{ color: '#a1a1aa', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.5px' }}>Join us and discover extraordinary journeys.</p>
        
        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: '500', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
              placeholder="John Doe"
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
              placeholder="Enter your email"
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = '#3f3f46'}
              required
            />
          </div>
          <button type="submit" style={{ 
            padding: '1.25rem', 
            background: 'linear-gradient(135deg, #d4af37, #b8860b)', 
            color: '#09090b', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1rem', 
            fontWeight: '700', 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            marginTop: '1.5rem',
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
          }}>
            Sign Up
          </button>
        </form>
        
        <p style={{ marginTop: '3rem', textAlign: 'center', color: '#71717a' }}>
          Already have an account? <Link to="/login" style={{ color: '#d4af37', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={(e) => e.target.style.borderColor = '#d4af37'} onMouseOut={(e) => e.target.style.borderColor = 'transparent'}>Sign in</Link>
        </p>
      </div>
      
      {/* Right side - Image */}
      <div style={{ 
        flex: '1', 
        background: 'url(https://images.unsplash.com/photo-1542314831-c6a4d142104d?auto=format&fit=crop&w=1000&q=80) center/cover',
        display: 'none',
        borderLeft: '1px solid #27272a'
      }}></div>

      <style>{`
        @media (min-width: 768px) {
          .container > div > div:last-child {
            display: block !important;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Register;
