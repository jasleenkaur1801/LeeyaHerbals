import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState('succeeded');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (sessionId) {
        try {
          // Store payment completion status and session ID
          localStorage.setItem('cardPaymentCompleted', 'true');
          localStorage.setItem('stripeSessionId', sessionId);
          
          setPaymentStatus('succeeded');
          setError(null);
          
          // Redirect back to checkout with payment success flag
          setTimeout(() => {
            navigate('/checkout?payment_success=true');
          }, 2000);
          
        } catch (error) {
          console.error('Payment success handling error:', error);
          setError('Payment verification failed');
        }
      }
      setLoading(false);
    };

    handlePaymentSuccess();
  }, [sessionId, navigate]);

  const verifyPayment = async () => {
    try {
      // Simple success verification - in production you'd verify with Stripe
      setPaymentStatus('succeeded');
      setOrderDetails({
        id: Date.now(),
        amount: localStorage.getItem('lastOrderTotal') || '0',
        items: JSON.parse(localStorage.getItem('lastOrderItems') || '[]')
      });
      
      // Clear cart and order data
      localStorage.removeItem('cart');
      localStorage.removeItem('lastOrderTotal');
      localStorage.removeItem('lastOrderItems');
      
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
      setLoading(false);
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Failed to verify payment');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-success-page">
        <div className="container">
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h1>Payment Error</h1>
            <p>{error}</p>
            <button 
              className="btn primary"
              onClick={() => navigate('/cart')}
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h1>Payment Successful!</h1>
          <p>Your card payment has been processed successfully.</p>
          <p>Redirecting you back to complete your order...</p>
          
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
