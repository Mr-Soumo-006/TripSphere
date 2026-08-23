import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(() => JSON.parse(localStorage.getItem('userInfo')));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1.5rem 0', background: 'rgba(9, 9, 11, 0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #27272a', boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: '900', color: '#fafafa', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Trip<span style={{ color: '#d4af37' }}>Sphere</span>
        </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>Home</Link>
        
        {userInfo ? (
          <>
            {userInfo.role === 'admin' && (
              <Link to="/admin" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '500', fontSize: '1.05rem', borderRight: '1px solid #3f3f46', paddingRight: '1rem', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>Admin Panel</Link>
            )}
            <Link to="/dashboard" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>Dashboard</Link>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a1a1aa', textDecoration: 'none', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>
              <img src={userInfo.avatar || `https://ui-avatars.com/api/?name=${userInfo.name}&background=d4af37&color=09090b`} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #d4af37' }} />
              Profile
            </Link>
            <button onClick={logoutHandler} style={{ 
              background: 'transparent',
              border: 'none',
              color: '#f87171', 
              fontWeight: '600', 
              fontSize: '1.05rem',
              cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '500', fontSize: '1.05rem', transition: 'color 0.2s' }} onMouseOver={e=>e.target.style.color='#d4af37'} onMouseOut={e=>e.target.style.color='#a1a1aa'}>Log In</Link>
            <Link to="/register" style={{ 
              color: '#09090b', 
              background: 'linear-gradient(135deg, #d4af37, #fde047)',
              padding: '0.6rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none', 
              fontWeight: '700',
              boxShadow: '0 4px 10px rgba(212, 175, 55, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Sign Up</Link>
          </>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
