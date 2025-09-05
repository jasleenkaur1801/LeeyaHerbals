import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FaceWashGelPage({ products = [], cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');

  // Filter products for Face Wash Gel category
  const faceWashGelProducts = products.filter(product => 
    product.category === 'facewashgel'
  );

  // Sort products
  const sortedProducts = [...faceWashGelProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const addToCart = (product) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const toggleWishlist = (product) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    
    const isInWishlist = wishlist.some(item => item.id === product.id);
    if (isInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <div className="page-layout">
      <div className="page-header">
        <h1>Face Wash Gels</h1>
        <p>Deep cleansing gels for healthy, glowing skin</p>
      </div>

      <div className="page-controls">
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="product-count">
          {sortedProducts.length} products found
        </div>
      </div>

      <div className="products-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <button 
                className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                ♡
              </button>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-rating">
                {'★'.repeat(Math.floor(product.rating))}
                <span>({product.rating})</span>
              </div>
              <div className="product-price">₹{product.price}</div>
              <div className="product-weight">{product.weight}</div>
              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="no-products">
          <p>No face wash gel products found.</p>
        </div>
      )}
    </div>
  );
}

export default FaceWashGelPage;
