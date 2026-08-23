import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchProfile = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          };
          const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
          setName(data.name);
          setEmail(data.email);
          setAvatar(data.avatar || `https://ui-avatars.com/api/?name=${data.name}&background=d4af37&color=09090b`);
          setBio(data.bio || 'A passionate traveler.');
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch profile details');
          setLoading(false);
        }
      };
      
      fetchProfile();
    }
  }, [navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
      
      // Update state with the uploaded image URL from server
      setAvatar(`http://localhost:5000${data}`);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };
      
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', {
        name,
        email,
        avatar,
        bio
      }, config);
      
      setMessage('Profile Updated Successfully!');
      localStorage.setItem('userInfo', JSON.stringify(data)); // Update local storage with new info (name, etc)
      window.dispatchEvent(new Event('storage')); // Trigger navbar update if needed
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem', color: '#a1a1aa' }}>Loading profile...</div>;

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: '#18181b', 
        borderRadius: '4px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        border: '1px solid #27272a',
        padding: '3rem'
      }}>
        <h2 style={{ fontSize: '2.5rem', color: '#fafafa', marginBottom: '0.5rem', fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
          User <span style={{ color: '#d4af37', fontWeight: '700' }}>Profile</span>
        </h2>
        <p style={{ color: '#a1a1aa', marginBottom: '3rem', fontWeight: '300', letterSpacing: '0.5px', textAlign: 'center' }}>Manage your account settings and preferences.</p>

        {error && <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{message}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', background: '#09090b', padding: '1.5rem', borderRadius: '4px', border: '1px solid #27272a' }}>
            <img src={avatar} alt={name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #d4af37' }} />
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Upload New Avatar</label>
              <input 
                type="file" 
                id="image-file"
                accept="image/*"
                onChange={uploadFileHandler}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#18181b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} 
              />
              {uploading && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#d4af37' }}>Uploading...</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none' }} 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '500', color: '#a1a1aa', marginBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Bio</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '0.9rem', border: '1px solid #3f3f46', background: '#09090b', color: '#fafafa', borderRadius: '4px', fontSize: '1rem', outline: 'none', resize: 'vertical' }} 
              placeholder="Tell us a little bit about yourself and your favorite destinations..."
            ></textarea>
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
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
