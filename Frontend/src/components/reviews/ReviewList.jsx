import React, { useState, useEffect } from 'react';
import './ReviewList.css';

const ReviewList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/reviews/product/${productId}?page=${page}&limit=10`
      );
      
      if (response.status === 404) {
        // Handle 404 - no reviews yet, show empty state
        setReviews([]);
        setStats({ averageRating: 0, totalReviews: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
        setHasMore(false);
        setCurrentPage(1);
        setError('');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        if (page === 1) {
          setReviews(result.reviews || []);
        } else {
          setReviews(prev => [...prev, ...(result.reviews || [])]);
        }
        setStats(result.stats || { averageRating: 0, totalReviews: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
        setHasMore(result.pagination?.hasMore || false);
        setCurrentPage(page);
        setError('');
      } else {
        setError(result.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Don't show error for network issues, just show empty state
      setReviews([]);
      setStats({ averageRating: 0, totalReviews: 0, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreReviews = () => {
    if (hasMore && !loading) {
      fetchReviews(currentPage + 1);
    }
  };

  const markAsHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to mark reviews as helpful');
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = await response.json();
      
      if (result.success) {
        // Update the helpful count in the local state
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpfulCount: result.helpfulCount }
            : review
        ));
      } else {
        alert(result.message || 'Failed to mark as helpful');
      }
    } catch (error) {
      console.error('Error marking as helpful:', error);
      alert('Failed to mark as helpful');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="review-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingBreakdown = () => {
    if (!stats || stats.totalReviews === 0) return null;

    return (
      <div className="rating-breakdown">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = stats.ratingBreakdown[rating] || 0;
          const percentage = (count / stats.totalReviews) * 100;
          
          return (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} ★</span>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="rating-count">({count})</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="reviews-section">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-section">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => fetchReviews()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      {/* Reviews Summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="reviews-summary">
          <div className="summary-header">
            <div className="average-rating">
              <span className="rating-number">{stats.averageRating}</span>
              <div className="rating-stars">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <span className="total-reviews">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          {renderRatingBreakdown()}
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        <h3>Customer Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <span className="no-reviews-icon">📝</span>
            <h4>No reviews yet</h4>
            <p>Be the first to review this product!</p>
          </div>
        ) : (
          <>
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="reviewer-details">
                      <h4>{review.userName || 'Anonymous'}</h4>
                      <div className="review-meta">
                        {renderStars(review.rating)}
                        <span className="review-date">{formatDate(review.createdAt)}</span>
                        {review.isVerified && (
                          <span className="verified-badge">✅ Verified Purchase</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="review-content">
                  <p className="review-comment">{review.comment}</p>
                </div>

                {/* Review Media */}
                {(review.images?.length > 0 || review.videos?.length > 0) && (
                  <div className="review-media">
                    {/* Images */}
                    {review.images?.length > 0 && (
                      <div className="media-section">
                        <h4>Photos ({review.images.length})</h4>
                        <div className="media-grid">
                          {review.images.map((image, index) => (
                            <div key={index} className="media-item">
                              <img
                                src={`http://localhost:8080${image}`}
                                alt={`Review image ${index + 1}`}
                                className="review-image"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Videos */}
                    {review.videos?.length > 0 && (
                      <div className="media-section">
                        <h4>Videos ({review.videos.length})</h4>
                        <div className="media-grid">
                          {review.videos.map((video, index) => (
                            <div key={index} className="media-item">
                              <video
                                src={`http://localhost:8080${video}`}
                                controls
                                className="review-video-player"
                                preload="metadata"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Actions */}
                <div className="review-actions">
                  <button 
                    className="helpful-btn"
                    onClick={() => markAsHelpful(review._id)}
                  >
                    👍 Helpful ({review.helpfulCount || 0})
                  </button>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn"
                  onClick={loadMoreReviews}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Reviews'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
