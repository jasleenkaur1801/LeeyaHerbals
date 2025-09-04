import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get orders from localStorage instead of backend
      const storedOrders = localStorage.getItem('userOrders');
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders);
      } else {
        // Create sample orders if none exist
        const sampleOrders = [
          {
            id: Date.now(),
            createdAt: new Date().toISOString(),
            status: 'completed',
            items: JSON.parse(localStorage.getItem('lastOrderItems') || '[]'),
            subtotal: parseFloat(localStorage.getItem('lastOrderTotal') || '0'),
            shipping: 0,
            total: parseFloat(localStorage.getItem('lastOrderTotal') || '0'),
            paymentMethod: 'online',
            address: {
              fullName: 'Customer',
              phone: '1234567890',
              addressLine1: 'Sample Address',
              city: 'City',
              state: 'State',
              pincode: '123456'
            }
          }
        ];
        
        // Only add sample order if there was a recent purchase
        if (localStorage.getItem('lastOrderTotal')) {
          setOrders(sampleOrders);
          localStorage.setItem('userOrders', JSON.stringify(sampleOrders));
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error">
            <h2>Error Loading Orders</h2>
            <p>{error}</p>
            <button className="btn primary" onClick={fetchOrders}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <button className="btn secondary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-content">
              <span className="no-orders-icon">📦</span>
              <h2>No Orders Yet</h2>
              <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
              <button className="btn primary" onClick={() => navigate('/')}>
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {getStatusIcon(order.status)} {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-meta">{item.weight} • Qty: {item.qty}</p>
                        <p className="item-price">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping:</span>
                    <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{order.total}</span>
                  </div>
                  <div className="payment-method">
                    <span>Payment: </span>
                    <span className={`payment-badge ${order.paymentMethod}`}>
                      {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}
                    </span>
                  </div>
                </div>

                <div className="delivery-address">
                  <h4>Delivery Address</h4>
                  <div className="address">
                    <p><strong>{order.address.fullName}</strong></p>
                    <p>{order.address.phone}</p>
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                    <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                    {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
                  </div>
                </div>

                <div className="order-actions">
                  {order.status === 'pending' && (
                    <button className="btn secondary small">
                      Cancel Order
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button className="btn primary small">
                      Reorder
                    </button>
                  )}
                  <button className="btn ghost small">
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
