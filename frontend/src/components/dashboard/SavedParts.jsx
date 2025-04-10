import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../pages/Auth/AuthContext';

const SavedParts = () => {
  const [savedParts, setSavedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedParts();
  }, [user]);

  const fetchSavedParts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/saved-parts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSavedParts(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch saved parts');
      }
    } catch (err) {
      setError('Network error when fetching saved parts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // For demo purposes, let's create some dummy saved parts
  useEffect(() => {
    if (!loading && savedParts.length === 0 && !error) {
      setSavedParts([
        {
          id: '1',
          name: 'Brake Pads - Premium Ceramic',
          brand: 'StopTech',
          price: 49.99,
          images: ['https://via.placeholder.com/100'],
          compatibility: [
            { make: 'Toyota', model: 'Camry', yearStart: 2018, yearEnd: 2022 }
          ]
        },
        {
          id: '2',
          name: 'Engine Air Filter',
          brand: 'K&N',
          price: 29.99,
          images: ['https://via.placeholder.com/100'],
          compatibility: [
            { make: 'Honda', model: 'Civic', yearStart: 2016, yearEnd: 2023 }
          ]
        },
        {
          id: '3',
          name: 'Oil Filter - High Performance',
          brand: 'Bosch',
          price: 12.99,
          images: ['https://via.placeholder.com/100'],
          compatibility: [
            { make: 'Ford', model: 'F-150', yearStart: 2015, yearEnd: 2021 }
          ]
        }
      ]);
    }
  }, [loading, savedParts, error]);

  const handleUnsavePart = async (partId) => {
    try {
      const response = await fetch(`/api/users/saved-parts/${partId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Remove from the state
        setSavedParts(savedParts.filter(part => part.id !== partId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to unsave part');
      }
    } catch (err) {
      setError('Network error when unsaving part');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading your saved parts...</div>;
  }

  return (
    <div className="saved-parts">
      <div className="section-header">
        <h2>Saved Parts</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="saved-parts-list">
        {savedParts.length === 0 ? (
          <div className="empty-state">
            <p>You haven't saved any parts yet.</p>
            <Link to="/search" className="btn-secondary">Browse Parts</Link>
          </div>
        ) : (
          <div className="saved-parts-grid">
            {savedParts.map((part) => (
              <div className="part-card" key={part.id}>
                <div className="part-image">
                  {part.images && part.images.length > 0 ? (
                    <img src={part.images[0]} alt={part.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                
                <div className="part-info">
                  <h3 className="part-name">{part.name}</h3>
                  <div className="part-brand">{part.brand}</div>
                  <div className="part-price">${part.price.toFixed(2)}</div>
                  
                  {part.compatibility && part.compatibility.length > 0 && (
                    <div className="part-compatibility">
                      <span className="compatibility-label">Fits:</span>
                      <span className="compatibility-value">
                        {part.compatibility[0].make} {part.compatibility[0].model} ({part.compatibility[0].yearStart}-{part.compatibility[0].yearEnd})
                      </span>
                      {part.compatibility.length > 1 && (
                        <span className="compatibility-more">+{part.compatibility.length - 1} more</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="part-actions">
                  <Link to={`/parts/${part.id}`} className="btn-primary">View Details</Link>
                  <button 
                    className="btn-icon"
                    onClick={() => handleUnsavePart(part.id)}
                    title="Remove from Saved"
                  >
                    <i className="fas fa-heart-broken"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedParts;