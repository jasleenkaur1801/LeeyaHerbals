import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardPaymentCompleted, setCardPaymentCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    // Try to get cart from multiple sources
    let cartData = null;
    
    // First try checkoutCart (set by Proceed to Buy button)
    const checkoutCart = localStorage.getItem('checkoutCart');
    if (checkoutCart) {
      cartData = JSON.parse(checkoutCart);
    } else {
      // Fallback to regular cart
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cartData = JSON.parse(savedCart);
      }
    }
    
    if (cartData && cartData.length > 0) {
      setCart(cartData);
    } else {
      console.log('No cart data found, redirecting to cart');
      navigate('/cart');
    }
  }, [navigate]);

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    return required.every(field => address[field].trim() !== '');
  };

  const handleCardPayment = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Store order details for Stripe
      localStorage.setItem('checkoutOrderTotal', total.toString());
      localStorage.setItem('checkoutOrderItems', JSON.stringify(cart));
      localStorage.setItem('checkoutOrderAddress', JSON.stringify(address));
      
      // Create Stripe checkout session
      const stripeResponse = await fetch('http://localhost:8080/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: Date.now(),
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: item.image,
            weight: item.weight
          })),
          total,
          customerEmail: 'customer@example.com'
        })
      });

      if (!stripeResponse.ok) {
        throw new Error('Failed to create payment session');
      }

      const { url } = await stripeResponse.json();
      
      if (url) {
        // Redirect to Stripe checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setIsProcessing(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    if (paymentMethod === 'card' && !cardPaymentCompleted) {
      alert('Please complete card payment first');
      return;
    }

    setIsProcessing(true);

    try {
      // Create the order
      const newOrder = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        items: cart,
        subtotal,
        shipping,
        total,
        paymentMethod: paymentMethod === 'card' ? 'online' : 'cod',
        address
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('userOrders', JSON.stringify(existingOrders));

      // Clear cart
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutOrderTotal');
      localStorage.removeItem('checkoutOrderItems');
      localStorage.removeItem('checkoutOrderAddress');
      
      // Dispatch cart update event
      window.dispatchEvent(new Event('cartUpdated'));

      alert('Order submitted successfully! You will receive a confirmation call within 24 hours.');
      navigate('/myorders');
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Failed to submit order. Please try again.');
      setIsProcessing(false);
    }
  };

  // Check if returning from successful Stripe payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardPaymentStatus = localStorage.getItem('cardPaymentCompleted');
    
    if (urlParams.get('payment_success') === 'true' || cardPaymentStatus === 'true') {
      setCardPaymentCompleted(true);
      setPaymentMethod('card');
      localStorage.removeItem('cardPaymentCompleted'); // Clean up
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h2>No items to checkout</h2>
            <button onClick={() => navigate('/cart')}>Go to Cart</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Secure Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-main">
            {/* Delivery Address Section */}
            <div className="checkout-section">
              <h2>1. Delivery Address</h2>
              <div className="address-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={(e) => setAddress({...address, fullName: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={address.addressLine2}
                  onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={address.landmark}
                    onChange={(e) => setAddress({...address, landmark: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="checkout-section">
              <h2>2. Payment Method</h2>
              <div className="payment-methods">
                <div 
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input 
                    type="radio" 
                    id="cod" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <label htmlFor="cod">
                    <span className="payment-icon">💵</span>
                    <div>
                      <strong>Cash on Delivery/Pay on Delivery</strong>
                      <p>Cash, UPI and Cards accepted. <span className="know-more">Know more.</span></p>
                      <p className="convenience-fee">A convenience fee of ₹7 will apply.</p>
                    </div>
                  </label>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <input 
                    type="radio" 
                    id="card" 
                    name="payment" 
                    value="card" 
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label htmlFor="card">
                    <span className="payment-icon">💳</span>
                    <div>
                      <strong>Credit or debit card</strong>
                      <div className="card-icons">
                        <img src="/api/placeholder/30/20" alt="Visa" />
                        <img src="/api/placeholder/30/20" alt="Mastercard" />
                        <img src="/api/placeholder/30/20" alt="American Express" />
                        <img src="/api/placeholder/30/20" alt="Diners Club" />
                        <img src="/api/placeholder/30/20" alt="Maestro" />
                        <img src="/api/placeholder/30/20" alt="RuPay" />
                      </div>
                      {paymentMethod === 'card' && !cardPaymentCompleted && (
                        <div className="card-payment-section">
                          <button 
                            className="card-payment-btn"
                            onClick={handleCardPayment}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Click here for payment'}
                          </button>
                        </div>
                      )}
                      {cardPaymentCompleted && (
                        <div className="payment-completed">
                          ✅ Payment completed successfully
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.qty}</p>
                      <p>₹{item.price * item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items):</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span className="free-shipping">FREE</span>
                </div>
                <div className="summary-row total">
                  <span>Order Total:</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button 
                className="submit-order-btn"
                onClick={handleSubmitOrder}
                disabled={!paymentMethod || isProcessing || (paymentMethod === 'card' && !cardPaymentCompleted)}
              >
                {isProcessing ? 'Submitting...' : 'Submit Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
