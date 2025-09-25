import { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8080';

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/orders`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchOrders(); // Refresh orders list
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers(); // Refresh users list
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'orders') {
      fetchOrders();
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You don't have admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Top Header */}
      <header className="admin-top-header">
        <div className="header-brand">
          <span className="brand-icon">🌿</span>
          <span className="brand-text">Leeya Herbals Admin</span>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {user.name}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h3>Admin Dashboard</h3>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Overview</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => handleTabChange('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">User Management</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Order Management</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          <div className="content-header">
            <div className="content-title-section">
              <h1 className="content-title">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'users' && 'User Management'}
                {activeTab === 'orders' && 'Order Management'}
              </h1>
              {activeTab === 'orders' && (
                <button className="action-btn primary">
                  <span>📋</span> Export Orders
                </button>
              )}
            </div>
          </div>
          
          <div className="admin-content">
        {activeTab === 'dashboard' && (
          <DashboardOverview stats={stats} />
        )}
        
        {activeTab === 'users' && (
          <UserManagement 
            users={users} 
            loading={loading} 
            onDeleteUser={deleteUser}
          />
        )}
        
        {activeTab === 'orders' && (
          <OrderManagement 
            orders={orders} 
            loading={loading} 
            onUpdateStatus={updateOrderStatus}
          />
        )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardOverview({ stats }) {
  return (
    <div className="dashboard-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
            <small>+{stats.monthlyUsers || 0} this month</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{stats.totalOrders || 0}</h3>
            <p>Total Orders</p>
            <small>+{stats.monthlyOrders || 0} this month</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pendingOrders || 0}</h3>
            <p>Pending Orders</p>
            <small>Needs attention</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
            <small>₹{stats.monthlyRevenue?.toLocaleString() || 0} this month</small>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-cards">
          <div className="activity-card">
            <div className="activity-icon">🛒</div>
            <div className="activity-content">
              <h4>New Orders</h4>
              <p>{stats.monthlyOrders || 0} orders this month</p>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <h4>New Users</h4>
              <p>{stats.monthlyUsers || 0} users joined</p>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">💹</div>
            <div className="activity-content">
              <h4>Revenue Growth</h4>
              <p>₹{stats.monthlyRevenue?.toLocaleString() || 0} earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserManagement({ users, loading, onDeleteUser }) {
  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <p className="section-subtitle">Total Users: {users.length}</p>
      
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => onDeleteUser(user._id)}
                    className="delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderManagement({ orders, loading, onUpdateStatus }) {
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [activeOrderTab, setActiveOrderTab] = useState('pending');

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  // Filter orders based on status
  const pendingOrders = orders.filter(order => 
    order.status !== 'Delivered' && order.status !== 'Cancelled'
  );
  const completedOrders = orders.filter(order => order.status === 'Delivered');
  const cancelledOrders = orders.filter(order => order.status === 'Cancelled');

  const getCurrentOrders = () => {
    switch (activeOrderTab) {
      case 'pending': return pendingOrders;
      case 'completed': return completedOrders;
      case 'cancelled': return cancelledOrders;
      case 'all': return orders;
      default: return orders;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return '#ff9800';
      case 'Processing': return '#2196f3';
      case 'Shipped': return '#9c27b0';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#757575';
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'facialkit': 'Facial Kit',
      'cream': 'Face Cream',
      'serum': 'Face Serum',
      'cleanser': 'Cleanser',
      'toner': 'Toner',
      'scrub': 'Face Scrub',
      'sunscreenlotion': 'Sunscreen',
      'bleachcream': 'Bleach Cream',
      'rosewater': 'Rose Water',
      'moisturzinglotion': 'Moisturizer',
      'acneoilgel': 'Acne Control',
      'cleansingmilk': 'Cleansing Milk',
      'scalpoil': 'Hair Oil',
      'skinconditioner': 'Skin Conditioner'
    };
    return categoryMap[category] || category;
  };

  console.log('Orders data:', orders); // Debug log
  
  const currentOrders = getCurrentOrders();
  
  return (
    <div className="order-management">
      <h2>Order Management</h2>
      <p className="section-subtitle">Total Orders: {orders.length}</p>
      
      {/* Order Status Tabs */}
      <div className="order-tabs">
        <button 
          className={`order-tab ${activeOrderTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveOrderTab('pending')}
        >
          Pending Orders ({pendingOrders.length})
        </button>
        <button 
          className={`order-tab ${activeOrderTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveOrderTab('completed')}
        >
          Completed Orders ({completedOrders.length})
        </button>
        <button 
          className={`order-tab ${activeOrderTab === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveOrderTab('cancelled')}
        >
          Cancelled Orders ({cancelledOrders.length})
        </button>
        <button 
          className={`order-tab ${activeOrderTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveOrderTab('all')}
        >
          All Orders ({orders.length})
        </button>
      </div>
      
      <div className="orders-container">
        {currentOrders.length === 0 ? (
          <div style={{padding: '2rem', textAlign: 'center', color: '#666'}}>
            No {activeOrderTab} orders found.
          </div>
        ) : (
          currentOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header" onClick={() => toggleOrderExpansion(order._id)}>
              <div className="order-main-info">
                <div className="order-id-section">
                  <span className="order-id">#{order.orderId}</span>
                  <button className="expand-btn">
                    {expandedOrders.has(order._id) ? '▼' : '▶'}
                  </button>
                </div>
                
                <div className="customer-section">
                  <div className="customer-info">
                    <div className="customer-name">{order.userId?.name || 'N/A'}</div>
                    <small className="customer-email">{order.userId?.email || 'N/A'}</small>
                    {order.userId?.phone && <small className="customer-phone">{order.userId.phone}</small>}
                  </div>
                </div>

                <div className="order-meta">
                  <div className="order-date">
                    <span className="label">Date:</span>
                    <span>{new Date(order.placedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-items-count">
                    <span className="label">Items:</span>
                    <span>{order.items.length}</span>
                  </div>
                  <div className="order-total">
                    <span className="label">Total:</span>
                    <span className="amount">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="order-status-section">
                  <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                    {order.paymentMethod}
                  </span>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-actions" onClick={(e) => e.stopPropagation()}>
                  <select 
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {expandedOrders.has(order._id) && (
              <div className="order-details">
                <h4>Order Items</h4>
                <div className="items-grid">
                  {order.items.map((item, index) => (
                    <div key={index} className="item-card">
                      <div className="item-image">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-category">{getCategoryDisplayName(item.category || 'skincare')}</div>
                        <div className="item-pricing">
                          <div className="quantity">Qty: {item.qty}</div>
                          <div className="price">₹{item.price} each</div>
                          <div className="subtotal">Subtotal: ₹{item.subtotal}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Items Total:</span>
                    <span>₹{order.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Order Total:</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
