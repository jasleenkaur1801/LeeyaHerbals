import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CollectionsPage({ products = [], cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');

  // Filter products for Collections/Kits category
  const collectionProducts = products.filter(product => 
    product.category === 'facialkit'
  );

  // Sort products
  const sortedProducts = [...collectionProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const addToCart = (product) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    alert(`${product.name} added to cart!`);
  };

  const toggleWishlist = (product) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
    } else {
      setWishlist(prev => [...prev, product]);
    }
  };

  return (
    <div className="category-page">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/categories')}>
            ← Back to Categories
          </button>
          <h1>Collections & Kits</h1>
          <p>Curated product collections for complete care routines</p>
        </div>

        <div className="collections-features">
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">🎁</div>
              <h3>Gift Sets</h3>
              <p>Perfect combinations for gifting</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✈️</div>
              <h3>Travel Kits</h3>
              <p>Compact essentials for on-the-go</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌟</div>
              <h3>Complete Routines</h3>
              <p>Full skincare regimens in one package</p>
            </div>
          </div>
        </div>

        <div className="category-controls">
          <div className="results-info">
            <span>{sortedProducts.length} collections found</span>
          </div>
          <div className="sort-controls">
            <label htmlFor="sort">Sort by:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No Collections available yet</h3>
            <p>We're working on curating amazing product collections for you!</p>
            <button className="btn" onClick={() => navigate('/categories')}>
              Browse Individual Products
            </button>
          </div>
        ) : (
          <div className="grid products">
            {sortedProducts.map(product => (
              <div key={product.id} className="card product collection-card">
                <div className="product-image-wrap">
                  <div className="collection-badge">Collection</div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  <button 
                    className={`wishlist ${wishlist.some(item => item.id === product.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    title={wishlist.some(item => item.id === product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    💖
                  </button>
                </div>
                <h3 className="product-name">{product.name}</h3>
                <div className="stars">
                  {'★'.repeat(5).split('').map((star, i) => (
                    <span key={i} className={`star ${i < 4 ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <div className="product-footer">
                  <span className="price">₹{product.price}</span>
                  <button 
                    className="btn small" 
                    onClick={() => addToCart(product)}
                  >
                    Add Collection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CollectionsPage;
