import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function Dashboard() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await API.get('/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFetchCarts = async () => {
    setLoading(true);
    try {
      await API.post('/fetch-carts');
      alert('Products imported successfully!');
      loadAnalytics();
    } catch (err) {
      console.error(err);
      alert('Failed to import products. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Analytics Dashboard</h1>

      {/* Import Products Button */}
      <button style={styles.button} onClick={handleFetchCarts} disabled={loading}>
        {loading ? 'Importing...' : 'Import Products'}
      </button>

      {/* Navigate to Product Management */}
      <button 
        style={{ ...styles.button, marginTop: '10px', background: '#ff6b6b' }} 
        onClick={() => navigate('/products')}
      >
        Go to Product Management
      </button>

      <div style={styles.cardsContainer}>
        {analytics && Object.keys(analytics).length > 0 && (
          <>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Total Before Discount</div>
              <div style={styles.cardValue}>${analytics.total_before_discount}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Total After Discount</div>
              <div style={styles.cardValue}>${analytics.total_after_discount}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Average Discount</div>
              <div style={styles.cardValue}>{analytics.avg_discount_percentage}%</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Most Expensive</div>
              <div style={styles.cardValue}>{analytics.most_expensive_product}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Cheapest</div>
              <div style={styles.cardValue}>{analytics.cheapest_product}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Highest Discount</div>
              <div style={styles.cardValue}>{analytics.highest_discount_product}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Total Quantity</div>
              <div style={styles.cardValue}>{analytics.total_quantity}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Unique Products</div>
              <div style={styles.cardValue}>{analytics.unique_products}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: '#f7f9fc',
    minHeight: '100vh'
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '2rem',
    letterSpacing: '1px'
  },
  button: {
    display: 'block',
    margin: '0 auto 30px auto',
    padding: '12px 25px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0px 5px 15px rgba(0,0,0,0.2)'
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 25
  },
  card: {
    background: 'white',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    textAlign: 'center'
  },
  cardTitle: {
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: 10,
    letterSpacing: '0.5px'
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#222'
  }
};

// Add hover effect for button and cards
styles.button[':hover'] = {
  transform: 'translateY(-3px)',
  boxShadow: '0px 8px 20px rgba(0,0,0,0.25)'
};
styles.card[':hover'] = {
  transform: 'translateY(-5px)',
  boxShadow: '0px 15px 25px rgba(0,0,0,0.2)'
};

export default Dashboard;
