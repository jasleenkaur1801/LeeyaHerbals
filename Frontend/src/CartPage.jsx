import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
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
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal >= 799 ? 0 : 50;
  const total = subtotal + shipping;

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeItem(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setShowAddressForm(true);
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setShowAddressForm(true);
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    return required.every(field => address[field].trim() !== '');
  };

  const handleOnlinePayment = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    // Store order details for the checkout page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    localStorage.setItem('checkoutAddress', JSON.stringify(address));
    
    // Redirect to checkout page for online payment
    navigate('/checkout', { state: { paymentMethod: 'online' } });
  };

  const handleCODPayment = async () => {
    if (!validateAddress()) {
      alert('Please fill in all required address fields');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cart,
        subtotal,
        shipping,
        total,
        paymentMethod: 'cod',
        address,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();
      
      // Clear cart and redirect to orders page
      setCart([]);
      alert('Order placed successfully! You will receive a confirmation call within 24 hours.');
      navigate('/myorders');
      
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Add some products to your cart to continue shopping</p>
            <button className="btn primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            <h2>Items in Cart ({cart.length})</h2>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-weight">{item.weight}</p>
                  <p className="item-price">₹{item.price}</p>
                </div>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.qty}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₹{item.price * item.qty}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="order-summary-content">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((sum, item) => sum + item.qty, 0)} items):</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{total}</span>
              </div>
            </div>
            
            <div className="order-summary-actions">
              <div className="shipping-message">
                You saved ₹50 on shipping!
              </div>

              <button 
                className="proceed-to-buy-btn"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Proceed to Buy clicked - navigating to checkout');
                  
                  // Store cart data for checkout page
                  localStorage.setItem('checkoutCart', JSON.stringify(cart));
                  
                  // Navigate to checkout
                  try {
                    navigate('/checkout');
                    console.log('Navigation successful');
                  } catch (error) {
                    console.error('Navigation error:', error);
                    // Force page navigation as fallback
                    window.location.href = window.location.origin + '/checkout';
                  }
                }}
                style={{
                  cursor: 'pointer',
                  pointerEvents: 'auto'
                }}
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
