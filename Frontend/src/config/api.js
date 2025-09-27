// API Configuration for different environments

const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080',
    UPLOAD_BASE_URL: 'http://localhost:8080'
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.herokuapp.com', // Replace with your actual backend URL
    UPLOAD_BASE_URL: 'https://your-backend-url.herokuapp.com' // Replace with your actual backend URL
  }
};

const environment = process.env.NODE_ENV || 'development';
const currentConfig = config[environment];

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const UPLOAD_BASE_URL = currentConfig.UPLOAD_BASE_URL;

// API Endpoints
export const ENDPOINTS = {
  // Review endpoints
  GET_REVIEWS: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
  POST_REVIEW: (productId) => `${API_BASE_URL}/api/reviews/product/${productId}`,
  MARK_HELPFUL: (reviewId) => `${API_BASE_URL}/api/reviews/${reviewId}/helpful`,
  
  // File URLs
  FILE_URL: (filePath) => `${UPLOAD_BASE_URL}${filePath}`
};

export default currentConfig;
