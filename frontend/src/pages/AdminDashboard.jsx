import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchTours();
    // eslint-disable-next-line
  }, [navigate]);

  const fetchTours = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/tours');
      setTours(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tours');
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/tours/${id}`, config);
        fetchTours();
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  const createTourHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('http://localhost:5000/api/tours', {}, config);
      fetchTours();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#fafafa', margin: 0, fontWeight: '300', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin <span style={{ color: '#d4af37', fontWeight: '700' }}>Panel</span></h1>
        <button onClick={createTourHandler} style={{ 
          background: 'transparent', 
          color: '#d4af37', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '4px', 
          border: '1px solid #d4af37', 
          fontWeight: '700', 
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.2s'
        }}
        onMouseOver={e=>e.currentTarget.style.background='rgba(212, 175, 55, 0.1)'}
        onMouseOut={e=>e.currentTarget.style.background='transparent'}
        >
          + Create New Tour
        </button>
      </div>

      {loading ? (
        <h3 style={{ color: '#a1a1aa', fontWeight: '300' }}>Loading tours...</h3>
      ) : error ? (
        <h3 style={{ color: '#ef4444' }}>{error}</h3>
      ) : (
        <div style={{ background: '#18181b', borderRadius: '4px', overflow: 'hidden', border: '1px solid #27272a', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#09090b', borderBottom: '1px solid #27272a' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Title</th>
                <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Price</th>
                <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Destination</th>
                <th style={{ padding: '1rem 1.5rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour._id} style={{ borderBottom: '1px solid #27272a', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding: '1rem 1.5rem', color: '#71717a', fontSize: '0.9rem' }}>{tour._id.substring(0, 8)}...</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '400', color: '#fafafa' }}>{tour.title}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#d4af37', fontWeight: '500' }}>₹{tour.price}</td>
                  <td style={{ padding: '1rem 1.5rem', color: '#a1a1aa' }}>{tour.destination}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button onClick={() => navigate(`/admin/tour/${tour._id}/edit`)} style={{ background: '#27272a', color: '#fafafa', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', marginRight: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#3f3f46'} onMouseOut={e=>e.currentTarget.style.background='#27272a'}>Edit</button>
                    <button onClick={() => deleteHandler(tour._id)} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>{e.currentTarget.style.background='rgba(239, 68, 68, 0.1)'}} onMouseOut={e=>{e.currentTarget.style.background='transparent'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
