import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '91',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  useEffect(() => {
    // Load cart data
    let cartData = null;
    const checkoutCart = localStorage.getItem('checkoutCart');
    if (checkoutCart) {
      cartData = JSON.parse(checkoutCart);
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cartData = JSON.parse(savedCart);
      }
    }
    
    if (cartData && cartData.length > 0) {
      setCart(cartData);
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  // Load Razorpay script
  useEffect(() => {
    const initRazorpay = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    };
    initRazorpay();
  }, []);

  const validatePhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      return { isValid: true, error: '' };
    }
    if (cleanPhone.length === 10) {
      return { isValid: false, error: 'Please include country code 91' };
    }
    return { isValid: false, error: 'Phone number must start with 91 followed by 10 digits' };
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const basicValidation = required.every(field => address[field].trim() !== '');
    
    if (!basicValidation) {
      return false;
    }
    
    const phoneValidation = validatePhoneNumber(address.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error);
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please try again.');
      return;
    }

    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch('http://localhost:8080/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Leeya Herbals',
        description: 'Natural Skincare Products',
        image: '/logo.png',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch('http://localhost:8080/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  userId: userData._id || userData.id,
                  userEmail: userData.email,
                  userName: userData.name,
                  items: cart.map(item => ({
                    productId: item.id || item.productId,
                    name: item.name,
                    image: item.image,
                    weight: item.weight,
                    qty: item.qty,
                    price: item.price,
                    subtotal: item.price * item.qty
                  })),
                  totalAmount: total,
                  shippingAddress: address
                }
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              localStorage.removeItem('cart');
              localStorage.removeItem('checkoutCart');
              localStorage.setItem('lastOrderId', verifyData.orderId);
              
              setShowSuccessMessage(true);
              setTimeout(() => {
                navigate('/payment-success');
              }, 2000);
            } else {
              throw new Error(verifyData.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userData.name || address.fullName,
          email: userData.email,
          contact: address.phone
        },
        notes: {
          address: `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`
        },
        theme: {
          color: '#1dbf73'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            console.log('Payment modal closed');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
      setIsProcessing(false);
    }
  };

  const handleCODOrder = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      const orderData = {
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        subtotal,
        shipping,
        total,
        items: cart.map(item => ({
          productId: item.id || item.productId,
          name: item.name,
          image: item.image,
          weight: item.weight,
          qty: item.qty,
          price: item.price,
          subtotal: item.price * item.qty
        })),
        address,
        status: 'placed'
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutCart');
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate('/myorders');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert(`Failed to submit order: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (paymentMethod === 'online') {
      await handleRazorpayPayment();
    } else {
      await handleCODOrder();
    }
  };

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
        
        {showSuccessMessage && (
          <div className="success-message">
            <div className="success-content">
              <span className="success-icon">✅</span>
              <div className="success-text">
                <h3>Order Placed Successfully!</h3>
                <p>Your order has been placed. You can check it in My Orders.</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(); }} className="checkout-content">
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
                  <div className="phone-input-container">
                    <div className={`phone-input-wrapper ${phoneError ? 'error' : ''}`}>
                      <span className="country-code">+91</span>
                      <input
                        type="tel"
                        placeholder="Enter 10 digit mobile number"
                        value={address.phone.substring(2)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setAddress({...address, phone: '91' + value});
                            if (phoneError) setPhoneError('');
                          }
                        }}
                        required
                      />
                    </div>
                    {phoneError && <div className="error-message">{phoneError}</div>}
                  </div>
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
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={address.landmark}
                  onChange={(e) => setAddress({...address, landmark: e.target.value})}
                />
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="checkout-section">
              <h2>2. Payment Method</h2>
              <div className="payment-methods">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <label htmlFor="cod">
                    <span className="payment-icon">💵</span>
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive your order</p>
                    </div>
                  </label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="online"
                    name="payment"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <label htmlFor="online">
                    <span className="payment-icon">💳</span>
                    <div>
                      <strong>Online Payment (Razorpay)</strong>
                      <p>Credit/Debit Cards, UPI, NetBanking</p>
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
                    <img 
                      src={item.image?.startsWith('/uploads') 
                        ? `http://localhost:8080${item.image}` 
                        : item.image || '/placeholder-product.png'} 
                      alt={item.name}
                      onError={(e) => { e.target.src = '/placeholder-product.png'; e.target.onerror = null; }}
                    />
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
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isProcessing}
                style={{
                  background: isProcessing 
                    ? 'linear-gradient(135deg, #95a5a6, #7f8c8d)' 
                    : 'linear-gradient(135deg, #1dbf73, #16a085)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: '16px 32px',
                  width: '100%',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <span>
                  {isProcessing ? (
                    <>
                      <span style={{ marginRight: '8px' }}>⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '8px' }}>🛒</span>
                      {paymentMethod === 'online' ? 'Pay Now' : 'Place Order'}
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
