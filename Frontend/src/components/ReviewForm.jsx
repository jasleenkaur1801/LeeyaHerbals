import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ productId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setErrors({ images: 'You can upload maximum 5 images' });
      return;
    }
    
    const validFiles = [];
    const previews = [];
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
        setErrors({ images: 'Each image must be less than 10MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors({ images: 'Please select valid image files' });
        return;
      }
      
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });
    
    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => [...prev, ...previews]);
    setErrors({ ...errors, images: null });
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (videos.length + files.length > 2) {
      setErrors({ videos: 'You can upload maximum 2 videos' });
      return;
    }
    
    const validFiles = [];
    const previews = [];
    
    files.forEach(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit for videos
        setErrors({ videos: 'Each video must be less than 50MB' });
        return;
      }
      
      if (!file.type.startsWith('video/')) {
        setErrors({ videos: 'Please select valid video files' });
        return;
      }
      
      validFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });
    
    setVideos(prev => [...prev, ...validFiles]);
    setVideoPreviews(prev => [...prev, ...previews]);
    setErrors({ ...errors, videos: null });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    const newPreviews = videoPreviews.filter((_, i) => i !== index);
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(videoPreviews[index]);
    
    setVideos(newVideos);
    setVideoPreviews(newPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Please write a review comment';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters long';
    } else if (comment.length > 1000) {
      newErrors.comment = 'Review must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a review');
        return;
      }

      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment.trim());
      
      // Append images
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      // Append videos
      videos.forEach((video, index) => {
        formData.append('videos', video);
      });

      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://your-backend-url.herokuapp.com' : 'http://localhost:8080'}/api/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 404) {
        alert('Review system is currently unavailable. Please try again later.');
        return;
      }

      const result = await response.json();

      if (result.success) {
        alert('Review submitted successfully!');
        // Reset form
        setRating(0);
        setComment('');
        
        // Clean up file previews
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        videoPreviews.forEach(url => URL.revokeObjectURL(url));
        
        setImages([]);
        setVideos([]);
        setImagePreviews([]);
        setVideoPreviews([]);
        setErrors({});
        
        // Notify parent component
        if (onReviewSubmitted) {
          onReviewSubmitted(result.review);
        }
      } else {
        alert(result.message || 'Failed to submit review');
      }

    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
        <span className="rating-text">
          {rating === 0 ? 'Select rating' : 
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </span>
      </div>
    );
  };

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h3>Write a Review</h3>
        <button 
          type="button" 
          className="close-btn"
          onClick={onCancel}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        {/* Rating Section */}
        <div className="form-group">
          <label>Your Rating *</label>
          {renderStars()}
          {errors.rating && <span className="error-text">{errors.rating}</span>}
        </div>

        {/* Comment Section */}
        <div className="form-group">
          <label htmlFor="comment">Your Review *</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows="4"
            maxLength="1000"
          />
          <div className="char-count">{comment.length}/1000</div>
          {errors.comment && <span className="error-text">{errors.comment}</span>}
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label>Photos (Optional)</label>
          <div className="upload-area">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="image-upload" className="upload-btn">
              📷 Upload Photos (Max 5)
            </label>
            <p className="upload-hint">Max size: 10MB each</p>
            
            {imagePreviews.length > 0 && (
              <div className="preview-grid">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} className="preview-image" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.images && <span className="error-text">{errors.images}</span>}
        </div>

        {/* Video Upload Section */}
        <div className="form-group">
          <label>Videos (Optional)</label>
          <div className="upload-area">
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              multiple
              onChange={handleVideoChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="video-upload" className="upload-btn">
              🎥 Upload Videos (Max 2)
            </label>
            <p className="upload-hint">Max size: 50MB each</p>
            
            {videoPreviews.length > 0 && (
              <div className="preview-grid">
                {videoPreviews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <video src={preview} controls className="preview-video" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeVideo(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.videos && <span className="error-text">{errors.videos}</span>}
        </div>

        {/* Submit Section */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
