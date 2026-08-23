import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        background: '#18181b', 
        borderRadius: '4px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        border: '1px solid #27272a',
        padding: '3rem'
      }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '0.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
          Reset <span style={{ color: '#d4af37', fontWeight: '700' }}>Password</span>
        </h2>
        
        {step === 1 ? (
          <p style={{ color: '#a1a1aa', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.5px', textAlign: 'center' }}>Enter your email address to receive a 6-digit OTP.</p>
        ) : (
          <p style={{ color: '#a1a1aa', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.5px', textAlign: 'center' }}>Check your email (or terminal) for the OTP.</p>
        )}

        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} 
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
              boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
            }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>6-Digit OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none', textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' }} 
                maxLength="6"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} 
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
              boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
            }}>
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
