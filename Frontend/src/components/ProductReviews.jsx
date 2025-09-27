import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import './ProductReviews.css';

const ProductReviews = ({ productId, isAuthenticated, onOpenAuth }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = (newReview) => {
    setShowReviewForm(false);
    // Trigger refresh of review list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
  };

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h2>Reviews & Ratings</h2>
        {!showReviewForm && (
          <button 
            className="write-review-btn"
            onClick={handleWriteReview}
          >
            ✍️ Write a Review
          </button>
        )}
      </div>

      {showReviewForm && (
        <div className="review-form-wrapper">
          <ReviewForm
            productId={productId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={handleCancelReview}
          />
        </div>
      )}

      <ReviewList 
        productId={productId}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default ProductReviews;
