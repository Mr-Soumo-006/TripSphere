import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = '/'; // Force reload to update Navbar state
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
      {/* Left side - Image */}
      <div style={{ 
        flex: '1', 
        background: 'url(https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80) center/cover',
        display: 'none', // We'll keep this simple for mobile
        borderRight: '1px solid #27272a'
      }}></div>

      {/* Right side - Form */}
      <div style={{ flex: '1', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '0.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome <span style={{ color: '#d4af37', fontWeight: '700' }}>Back</span></h2>
        <p style={{ color: '#a1a1aa', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.5px' }}>Access your exclusive travel portfolio.</p>
        
        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1.5rem', fontWeight: '500', fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Password</label>
              <Link to="/forgot-password" style={{ color: '#d4af37', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fde047'} onMouseOut={(e) => e.target.style.color = '#d4af37'}>Forgot Password?</Link>
            </div>
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
            Sign In
          </button>
        </form>
        
        <p style={{ marginTop: '3rem', textAlign: 'center', color: '#71717a' }}>
          Don't have an account? <Link to="/register" style={{ color: '#d4af37', fontWeight: '700', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseOver={(e) => e.target.style.borderColor = '#d4af37'} onMouseOut={(e) => e.target.style.borderColor = 'transparent'}>Sign up</Link>
        </p>
      </div>
      {/* Media query for hiding left side image on small screens will be handled by CSS if necessary, but flex makes it robust */}
      <style>{`
        @media (min-width: 768px) {
          .container > div > div:first-child {
            display: block !important;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Login;
