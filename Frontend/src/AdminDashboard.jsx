import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { CATEGORIES } from './products.js';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
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

  // Add product with image (single-step multipart)
  const addProductWithImage = async (fields, file) => {
    try {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('name', fields.name);
      fd.append('price', String(fields.price));
      fd.append('category', fields.category);
      fd.append('weight', fields.weight);
      fd.append('rating', String(fields.rating ?? 5));
      fd.append('description', fields.description);
      if (file) fd.append('image', file);

      const response = await fetch(`${API_BASE}/admin/products-with-image`, {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: fd
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts();
        alert('Product added successfully!');
        return true;
      } else {
        alert('Failed to add product: ' + (data.message || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error adding product with image:', error);
      alert('Error adding product with image');
      return false;
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/products`, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const addProduct = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh products list
        alert('Product added successfully!');
        return true;
      } else {
        alert('Failed to add product: ' + (data.message || 'Unknown error'));
        return false;
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchProducts(); // Refresh products list
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      fetchUsers();
    } else if (tab === 'orders') {
      fetchOrders();
    } else if (tab === 'products') {
      fetchProducts();
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
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => handleTabChange('products')}
            >
              <span className="nav-icon">🛍️</span>
              <span className="nav-text">Product Management</span>
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
                {activeTab === 'products' && 'Product Management'}
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
        
        {activeTab === 'products' && (
          <ProductManagement 
            products={products} 
            loading={loading} 
            onAddProduct={addProduct}
            onAddProductWithImage={addProductWithImage}
            onDeleteProduct={deleteProduct}
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

function ProductManagement({ products, loading, onAddProduct, onAddProductWithImage, onDeleteProduct }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    weight: '',
    image: '',
    rating: 5,
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/admin/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.message || 'Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.weight || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      // If a file is selected, use single-step multipart endpoint
      let success = false;
      if (imageFile) {
        const fields = {
          ...formData,
          price: parseFloat(formData.price),
          rating: parseInt(formData.rating)
        };
        success = await onAddProductWithImage(fields, imageFile);
      } else {
        // Otherwise, fall back to JSON path with image URL or placeholder
        const imageUrl = formData.image || '/placeholder-product.png';
        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          rating: parseInt(formData.rating),
          image: imageUrl
        };
        success = await onAddProduct(productData);
      }
      if (success) {
        // Reset form
        setFormData({
          name: '',
          price: '',
          category: '',
          weight: '',
          image: '',
          rating: 5,
          description: ''
        });
        setImageFile(null);
        setImagePreview(null);
        setShowAddForm(false);
      }
    } catch (error) {
      alert('Error adding product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getCategoryDisplayName = (category) => {
    const categoryObj = CATEGORIES.find(cat => cat.key === category);
    return categoryObj ? categoryObj.label : category;
  };

  return (
    <div className="product-management">
      <div className="product-header">
        <h2>Product Management</h2>
        <p className="section-subtitle">Total Products: {products.length}</p>
        <button 
          className="add-product-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '❌ Cancel' : '➕ Add New Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-product-form-container">
          <h3>Add New Product</h3>
          <form onSubmit={handleSubmit} className="add-product-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="weight">Weight/Size *</label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 100ml, 50gm"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <div className="image-upload-container">
                  <input
                    type="file"
                    id="image"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="image-upload-input"
                  />
                  <label htmlFor="image" className="image-upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <span className="change-image">Click to change image</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <span>Click to upload image</span>
                        <small>JPEG, PNG, WebP (Max 5MB)</small>
                      </div>
                    )}
                  </label>
                </div>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="Or enter image URL"
                  className="image-url-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="3"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={uploading}>
                {uploading ? 'Adding Product...' : 'Add Product'}
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="products-list">
        <h3>Existing Products</h3>
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id || product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image?.startsWith('/uploads') 
                    ? `http://localhost:8080${product.image}` 
                    : product.image || '/placeholder-product.png'
                  } 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </div>
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-category">{getCategoryDisplayName(product.category)}</p>
                <div className="product-details">
                  <span className="product-price">₹{product.price}</span>
                  <span className="product-weight">{product.weight}</span>
                  <span className="product-rating">⭐ {product.rating}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <button 
                  className="delete-product-btn"
                  onClick={() => onDeleteProduct(product._id || product.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="no-products">
            <p>No products found. Add your first product using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
