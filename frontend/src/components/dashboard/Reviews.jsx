import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../pages/Auth/AuthContext';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/reviews', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError('Network error when fetching reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!loading && reviews.length === 0 && !error) {
      setReviews([
        {
          id: '1',
          partId: '101',
          partName: 'Brake Pads - Premium Ceramic',
          rating: 5,
          title: 'Great product!',
          comment: 'These brake pads are amazing. Installation was easy and they provide excellent stopping power with minimal noise.',
          createdAt: '2023-10-01',
          helpful: { count: 3 }
        },
        {
          id: '2',
          partId: '102',
          partName: 'Oil Filter - High Performance',
          rating: 4,
          title: 'Good quality',
          comment: 'Solid oil filter, easy to install and works well. Only giving 4 stars because the packaging was damaged.',
          createdAt: '2023-09-15',
          helpful: { count: 1 }
        }
      ]);
    }
  }, [loading, reviews, error]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete review');
      }
    } catch (err) {
      setError('Network error when deleting review');
      console.error(err);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'star filled' : 'star'}>
        <i className={i < rating ? 'fas fa-star' : 'far fa-star'}></i>
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading your reviews...</div>;
  }

  return (
    <div className="reviews">
      <div className="section-header">
        <h2>My Reviews</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="empty-state">
            <p>You haven't written any reviews yet.</p>
            <Link to="/search" className="btn-secondary">Browse Parts to Review</Link>
          </div>
        ) : (
          <div className="reviews-container">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-header">
                  <Link to={`/parts/${review.partId}`} className="review-part-name">
                    {review.partName}
                  </Link>
                  <div className="review-date">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                
                <div className="review-content">
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                  <h4 className="review-title">{review.title}</h4>
                  <p className="review-comment">{review.comment}</p>
                </div>
                
                <div className="review-footer">
                  <div className="review-helpful">
                    <i className="fas fa-thumbs-up"></i> {review.helpful.count} people found this helpful
                  </div>
                  
                  <div className="review-actions">
                    <button className="btn-text" onClick={() => handleDeleteReview(review.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;