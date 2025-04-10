import { useState, useEffect } from 'react';
import { useAuth } from '../../pages/Auth/AuthContext';
import PartForm from './PartForm';

const PartsManager = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserParts();
  }, [user]);

  const fetchUserParts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/parts?seller=me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setParts(data.data);
      } else {
        setError(data.message || 'Failed to fetch parts');
      }
    } catch (err) {
      setError('Network error when fetching parts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = () => {
    setEditingPart(null);
    setIsFormVisible(true);
  };

  const handleEditPart = (part) => {
    setEditingPart(part);
    setIsFormVisible(true);
  };

  const handleDeletePart = async (partId) => {
    if (!window.confirm('Are you sure you want to delete this part?')) {
      return;
    }

    try {
      const response = await fetch(`/api/parts/${partId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setParts(parts.filter(part => part.id !== partId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete part');
      }
    } catch (err) {
      setError('Network error when deleting part');
      console.error(err);
    }
  };

  const handleFormSubmit = async (partData) => {
    try {
      let response;
      
      // Add image handling using FormData if needed
      const formData = new FormData();
      
      // Append part data
      Object.keys(partData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, partData[key]);
        }
      });
      
      // Append images if any
      if (partData.images && partData.images.length) {
        for (let i = 0; i < partData.images.length; i++) {
          formData.append('images', partData.images[i]);
        }
      }
      
      if (editingPart) {
        // Update existing part
        response = await fetch(`/api/parts/${editingPart.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
      } else {
        // Create new part
        response = await fetch('/api/parts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        // Refresh parts list
        fetchUserParts();
        setIsFormVisible(false);
        setEditingPart(null);
      } else {
        setError(data.message || 'Failed to save part');
      }
    } catch (err) {
      setError('Network error when saving part');
      console.error(err);
    }
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingPart(null);
  };

  if (loading) {
    return <div className="loading">Loading your part listings...</div>;
  }

  return (
    <div className="parts-manager">
      <div className="section-header">
        <h2>My Part Listings</h2>
        <button 
          className="btn-primary" 
          onClick={handleAddPart}
          disabled={isFormVisible}
        >
          <i className="fas fa-plus"></i> Add Part
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isFormVisible && (
        <PartForm 
          part={editingPart}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {!isFormVisible && (
        <div className="parts-list">
          {parts.length === 0 ? (
            <div className="empty-state">
              <p>You haven't listed any parts for sale yet.</p>
              <button 
                className="btn-secondary"
                onClick={handleAddPart}
              >
                List Your First Part
              </button>
            </div>
          ) : (
            <div className="parts-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Part Number</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.id}>
                      <td>
                        <div className="part-thumbnail">
                          {part.images && part.images.length > 0 ? (
                            <img src={part.images[0]} alt={part.name} />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                      </td>
                      <td>{part.name}</td>
                      <td>{part.category}</td>
                      <td>{part.partNumber}</td>
                      <td>${part.price.toFixed(2)}</td>
                      <td>{part.stockQuantity}</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => handleEditPart(part)}
                            title="Edit Part"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn-icon delete"
                            onClick={() => handleDeletePart(part.id)}
                            title="Delete Part"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PartsManager;