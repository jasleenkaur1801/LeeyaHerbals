import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CheckoutPage.css';
import { downloadInvoice } from '../utils/invoiceUtils';

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
  const [cardPaymentCompleted, setCardPaymentCompleted] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = 0;
  const discount = couponDiscount; // Use coupon discount
  const total = subtotal + shipping - discount;

  // Fetch available coupons
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        let userId = user._id || user.id || user.userId;
        
        // If not found, decode JWT token
        if (!userId && token) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              userId = payload._id || payload.id || payload.userId || payload.sub;
            }
          } catch (e) {
            console.error('Failed to decode token for fetching coupons:', e);
          }
        }
        
        if (!token || !userId) return;
        
        const response = await fetch(`http://localhost:8080/api/coupons/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success && data.coupons) {
          setAvailableCoupons(data.coupons);
        }
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      }
    };
    
    fetchAvailableCoupons();
  }, []);

  useEffect(() => {
    // Load cart data
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

  // Load Razorpay script
  useEffect(() => {
    const initRazorpay = async () => {
      console.log('Loading Razorpay script...');
      const loaded = await loadRazorpayScript();
      console.log('Razorpay script loaded:', loaded);
      setRazorpayLoaded(loaded);
      if (!loaded) {
        console.error('Failed to load Razorpay script');
      }
    };
    initRazorpay();
  }, []);

  const validatePhoneNumber = (phone) => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it starts with 91 and has exactly 12 digits (91 + 10 digits)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      return { isValid: true, error: '' };
    }
    
    // Check if it's just 10 digits (without country code)
    if (cleanPhone.length === 10) {
      return { isValid: false, error: 'Please include country code 91 (e.g., 919876543210)' };
    }
    
    // Check if it starts with 91 but wrong length
    if (cleanPhone.startsWith('91') && cleanPhone.length !== 12) {
      return { isValid: false, error: 'Phone number must be exactly 10 digits after country code 91' };
    }
    
    // Other cases
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Phone number is too short' };
    }
    
    if (cleanPhone.length > 12) {
      return { isValid: false, error: 'Phone number is too long' };
    }
    
    return { isValid: false, error: 'Phone number must start with 91 followed by 10 digits' };
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    const basicValidation = required.every(field => address[field].trim() !== '');
    
    if (!basicValidation) {
      return false;
    }
    
    // Validate phone number
    const phoneValidation = validatePhoneNumber(address.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error);
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleInvoiceDownload = async (orderId) => {
    try {
      setDownloadingInvoice(true);
      await downloadInvoice(orderId);
      console.log('Invoice downloaded successfully');
    } catch (error) {
      console.error('Failed to download invoice:', error);
      // Don't show error to user as this is optional
    } finally {
      setDownloadingInvoice(false);
    }
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
            console.log('Payment successful, verifying...', response);
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
                  paymentMethod: 'online',
                  paymentStatus: 'prepaid',
                  discount: couponDiscount,
                  appliedCoupon: appliedCoupon ? {
                    couponId: appliedCoupon.couponId,
                    code: appliedCoupon.couponCode,
                    discountType: appliedCoupon.discountType,
                    discountValue: appliedCoupon.discountValue,
                    discountAmount: appliedCoupon.discountAmount
                  } : null,
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
            console.log('Verification response:', verifyData);

            if (verifyData.success) {
              // Record coupon usage if coupon was applied
              if (appliedCoupon) {
                try {
                  const token = localStorage.getItem('token');
                  const userId = userData._id || userData.id;
                  await fetch('http://localhost:8080/api/coupons/record-usage', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      userId: userId,
                      couponId: appliedCoupon.couponId,
                      orderId: verifyData.orderId,
                      discountAmount: couponDiscount
                    })
                  });
                } catch (error) {
                  console.error('Failed to record coupon usage:', error);
                }
              }
              
              // Check for auto-generated coupons
              try {
                const token = localStorage.getItem('token');
                const userId = userData._id || userData.id;
                const response = await fetch('http://localhost:8080/api/coupons/generate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    userId: userId,
                    orderAmount: subtotal,
                    orderId: verifyData.orderId
                  })
                });
                
                const data = await response.json();
                if (data.success && data.couponsGenerated?.length > 0) {
                  console.log('🎉 User earned new coupons:', data.couponsGenerated);
                }
              } catch (error) {
                console.error('Failed to generate coupons:', error);
              }
              
              // Clear cart from localStorage
              localStorage.removeItem('cart');
              localStorage.removeItem('checkoutCart');
              localStorage.setItem('lastOrderId', verifyData.orderId);
              
              // Trigger cart update event for other components
              window.dispatchEvent(new Event('cartUpdate'));
              
              // Clear local cart state
              setCart([]);
              
              // Download invoice
              if (verifyData.orderId) {
                handleInvoiceDownload(verifyData.orderId);
              }
              
              setShowSuccessMessage(true);
              setTimeout(() => {
                navigate('/myorders');
              }, 1500);
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

  const handleSubmitOrder = async () => {
    if (paymentMethod === 'online') {
      await handleRazorpayPayment();
      return;
    }

    // Handle COD orders
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to place an order');
        navigate('/login');
        return;
      }

      // Prepare order data for API
      const orderData = {
        paymentMethod: paymentMethod === 'card' ? 'online' : 'cod',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'prepaid',
        stripeSessionId: paymentMethod === 'card' ? localStorage.getItem('stripeSessionId') : null,
        subtotal,
        shipping,
        total,
        discount: couponDiscount,
        appliedCoupon: appliedCoupon ? {
          couponId: appliedCoupon.couponId,
          code: appliedCoupon.couponCode,
          discountType: appliedCoupon.discountType,
          discountValue: appliedCoupon.discountValue,
          discountAmount: appliedCoupon.discountAmount
        } : null,
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

      // Try to create order via API, with fallback to local storage
      let orderCreated = false;
      
      console.log('=== COD ORDER CREATION START ===');
      console.log('Order data:', JSON.stringify(orderData, null, 2));
      console.log('Token:', token);
      
      try {
        const response = await fetch('http://localhost:8080/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        });

        console.log('API Response status:', response.status);
        const result = await response.json();
        console.log('API Response data:', result);

        if (response.ok && result.success) {
          console.log('COD Order created successfully via API');
          orderCreated = true;
          
          // Store order ID for invoice download
          if (result.order && (result.order._id || result.order.orderId)) {
            localStorage.setItem('lastOrderId', result.order._id || result.order.orderId);
          }
        } else {
          throw new Error(result.error || 'API order creation failed');
        }
      } catch (apiError) {
        console.log('API not available, using local storage fallback:', apiError.message);
        
        // Fallback: Store order in localStorage for demo purposes
        const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const newOrder = {
          ...orderData,
          id: Date.now().toString(),
          orderNumber: `LH${Date.now()}`,
          createdAt: new Date().toISOString(),
          paymentMethod: paymentMethod
        };
        
        // Add new order at the beginning (latest first)
        existingOrders.unshift(newOrder);
        localStorage.setItem('userOrders', JSON.stringify(existingOrders));
        orderCreated = true;
      }

      if (orderCreated) {
        // Record coupon usage if coupon was applied
        if (appliedCoupon) {
          try {
            const token = localStorage.getItem('token');
            const lastOrderId = localStorage.getItem('lastOrderId');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user._id || user.id;
            
            await fetch('http://localhost:8080/api/coupons/record-usage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                userId: userId,
                couponId: appliedCoupon.couponId,
                orderId: lastOrderId,
                discountAmount: couponDiscount
              })
            });
          } catch (error) {
            console.error('Failed to record coupon usage:', error);
          }
        }
        
        // Check for auto-generated coupons
        try {
          const token = localStorage.getItem('token');
          const lastOrderId = localStorage.getItem('lastOrderId');
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = user._id || user.id;
          
          const response = await fetch('http://localhost:8080/api/coupons/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              userId: userId,
              orderAmount: subtotal, // Use original amount before discount
              orderId: lastOrderId
            })
          });
          
          const data = await response.json();
          if (data.success && data.couponsGenerated?.length > 0) {
            console.log('🎉 User earned new coupons:', data.couponsGenerated);
            // You could show a special notification here
          }
        } catch (error) {
          console.error('Failed to generate coupons:', error);
        }
        
        // Clear cart and temporary data
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('checkoutOrderTotal');
        localStorage.removeItem('checkoutOrderItems');
        localStorage.removeItem('checkoutOrderAddress');
        localStorage.removeItem('stripeSessionId');
        localStorage.removeItem('tempCheckoutAddress'); // Clean up address backup
        
        // Trigger cart update event for other components
        window.dispatchEvent(new Event('cartUpdate'));
        
        // Clear local cart state
        setCart([]);

        // Download invoice if order ID is available
        const lastOrderId = localStorage.getItem('lastOrderId');
        if (lastOrderId) {
          handleInvoiceDownload(lastOrderId);
        }

        // Show success message
        setShowSuccessMessage(true);
        setIsProcessing(false);
        
        // Navigate to My Orders after brief success message
        setTimeout(() => {
          navigate('/myorders');
        }, 1500);
      } else {
        throw new Error('Failed to create order');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert(`Failed to submit order: ${error.message}. Please try again.`);
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
      
      // Restore address data if available
      const savedAddress = localStorage.getItem('tempCheckoutAddress');
      if (savedAddress) {
        try {
          const parsedAddress = JSON.parse(savedAddress);
          setAddress(parsedAddress);
        } catch (error) {
          console.error('Error restoring address:', error);
        }
      }
      
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
        
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="success-message">
            <div className="success-content">
              <span className="success-icon">✅</span>
              <div className="success-text">
                <h3>Order Placed Successfully!</h3>
                <p>Your order has been placed successfully. {downloadingInvoice ? 'Downloading invoice...' : 'Invoice will be downloaded automatically.'}</p>
                <p>Redirecting you to My Orders...</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={async (e) => { e.preventDefault(); await handleSubmitOrder(); }} className="checkout-content">
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
                        value={address.phone.substring(2)} // Display only the digits after "91"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                          
                          if (value.length <= 10) { // Limit to 10 digits after country code
                            setAddress({...address, phone: '91' + value});
                            // Clear error when user starts typing
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
                      <strong>Cash on Delivery</strong>
                    </div>
                  </label>
                </div>

                <div 
                  className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('online')}
                >
                  <input 
                    type="radio" 
                    id="online" 
                    name="payment" 
                    value="online" 
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
              
              {/* Coupon Section - MUST BE VISIBLE */}
              <div className="coupon-section" style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#333' }}>Add Gift Card or Promo Code</h4>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Enter Code"
                    disabled={applyingCoupon || appliedCoupon}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: couponError ? '2px solid #dc3545' : '2px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!couponCode.trim()) {
                        setCouponError('Please enter a coupon code');
                        return;
                      }
                      
                      setApplyingCoupon(true);
                      setCouponError('');
                      setCouponSuccess('');
                      
                      try {
                        const token = localStorage.getItem('token');
                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                        
                        // Try to get userId from multiple sources
                        let userId = user._id || user.id || user.userId;
                        
                        // If not found, decode JWT token to get user ID
                        if (!userId && token) {
                          try {
                            const tokenParts = token.split('.');
                            if (tokenParts.length === 3) {
                              const payload = JSON.parse(atob(tokenParts[1]));
                              userId = payload._id || payload.id || payload.userId || payload.sub;
                              console.log('🔍 Extracted userId from token:', userId);
                            }
                          } catch (e) {
                            console.error('Failed to decode token:', e);
                          }
                        }
                        
                        console.log('🔍 Debug - Token:', token ? 'EXISTS' : 'MISSING');
                        console.log('🔍 Debug - User:', user);
                        console.log('🔍 Debug - UserID:', userId);
                        
                        if (!token) {
                          setCouponError('Please login to apply coupon - No token found');
                          return;
                        }
                        
                        if (!userId) {
                          setCouponError('User ID not found. Please log out and log in again.');
                          return;
                        }
                        
                        const response = await fetch('http://localhost:8080/api/coupons/apply', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            userId: userId,
                            couponCode: couponCode.toUpperCase(),
                            orderAmount: subtotal
                          })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                          setAppliedCoupon(data.data);
                          setCouponDiscount(data.data.discountAmount);
                          setCouponSuccess(`✅ ${data.message}`);
                          setCouponCode('');
                        } else {
                          setCouponError(data.message || 'Invalid coupon code');
                        }
                      } catch (error) {
                        setCouponError('Failed to apply coupon');
                      } finally {
                        setApplyingCoupon(false);
                      }
                    }}
                    disabled={applyingCoupon || appliedCoupon}
                    style={{
                      padding: '10px 24px',
                      background: appliedCoupon ? '#6c757d' : '#1dbf73',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: (applyingCoupon || appliedCoupon) ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                
                {/* Error Message */}
                {couponError && (
                  <div style={{
                    color: '#dc3545',
                    background: '#f8d7da',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    marginBottom: '8px'
                  }}>
                    ❌ {couponError}
                  </div>
                )}
                
                {/* Success Message */}
                {couponSuccess && (
                  <div style={{
                    color: '#155724',
                    background: '#d4edda',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    marginBottom: '8px'
                  }}>
                    {couponSuccess}
                  </div>
                )}
                
                {/* Applied Coupon Display */}
                {appliedCoupon && (
                  <div style={{
                    background: 'linear-gradient(135deg, #1dbf73, #16a085)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          🎉 {appliedCoupon.couponCode} Applied!
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                          You saved ₹{appliedCoupon.discountAmount}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponDiscount(0);
                          setCouponSuccess('');
                          setCouponCode('');
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Available Coupons */}
                {availableCoupons.length > 0 && !appliedCoupon && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowCoupons(!showCoupons)}
                      style={{
                        background: 'none',
                        border: '2px dashed #1dbf73',
                        color: '#1dbf73',
                        padding: '8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginTop: '8px'
                      }}
                    >
                      {showCoupons ? '▼' : '▶'} View Available Coupons ({availableCoupons.length})
                    </button>
                    
                    {showCoupons && (
                      <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                        {availableCoupons.map((coupon) => (
                          <div
                            key={coupon._id}
                            onClick={() => {
                              setCouponCode(coupon.code);
                              setShowCoupons(false);
                            }}
                            style={{
                              background: 'linear-gradient(135deg, #667eea, #764ba2)',
                              color: 'white',
                              padding: '10px',
                              borderRadius: '6px',
                              marginBottom: '8px',
                              cursor: 'pointer',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)' }
                          >
                            <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
                              {coupon.code}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                              {coupon.description || (coupon.discountType === 'PERCENT' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`)}
                            </div>
                            <div style={{ fontSize: '11px', opacity: 0.8 }}>
                              Min order: ₹{coupon.minOrderValue}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
                {appliedCoupon && (
                  <div className="summary-row discount" style={{ color: '#1dbf73', fontWeight: '600' }}>
                    <span>Discount ({appliedCoupon.couponCode}):</span>
                    <span className="discount-amount">-₹{Math.round(couponDiscount)}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Order Total:</span>
                  <span>₹{Math.round(total)}</span>
                </div>
                {appliedCoupon && (
                  <div style={{
                    background: '#d4edda',
                    color: '#155724',
                    padding: '10px',
                    borderRadius: '6px',
                    textAlign: 'center',
                    fontWeight: '600',
                    marginTop: '10px',
                    fontSize: '14px'
                  }}>
                    🎉 You saved ₹{Math.round(couponDiscount)}!
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isProcessing || (paymentMethod === 'online' && !razorpayLoaded)}
                onClick={(e) => {
                  if (!paymentMethod) {
                    e.preventDefault();
                    alert('Please select a payment method');
                  }
                }}
                style={{
                  background: (isProcessing || (paymentMethod === 'online' && !razorpayLoaded))
                    ? 'linear-gradient(135deg, #95a5a6, #7f8c8d)' 
                    : 'linear-gradient(135deg, #1dbf73, #16a085)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  padding: '16px 32px',
                  width: '100%',
                  cursor: (isProcessing || (paymentMethod === 'online' && !razorpayLoaded)) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isProcessing 
                    ? '0 4px 15px rgba(149, 165, 166, 0.3)' 
                    : '0 6px 20px rgba(29, 191, 115, 0.4)',
                  transform: isProcessing ? 'none' : 'translateY(-2px)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = 'linear-gradient(135deg, #16a085, #1dbf73)';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(29, 191, 115, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) {
                    e.target.style.background = 'linear-gradient(135deg, #1dbf73, #16a085)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(29, 191, 115, 0.4)';
                  }
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {isProcessing ? (
                    <>
                      <span style={{ marginRight: '8px' }}>⏳</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span style={{ marginRight: '8px' }}>
                        {paymentMethod === 'online' ? '💳' : '🛒'}
                      </span>
                      {paymentMethod === 'online' 
                        ? (razorpayLoaded ? 'Pay Now' : 'Loading Payment Gateway...') 
                        : 'Place Order'}
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
