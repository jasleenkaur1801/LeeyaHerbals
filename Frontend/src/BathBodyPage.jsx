import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToCartButton from './components/AddToCartButton';

// Import ALL_PRODUCTS from App.jsx - we'll need to pass this as props
function BathBodyPage({ products = [], cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('name');

  // Filter products for Bath & Body category
  const bathBodyProducts = products.filter(product => 
    product.category === 'scalpoil' ||
    product.category === 'scrub'
  );

  // Sort products
  const sortedProducts = [...bathBodyProducts].sort((a, b) => {
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
          <h1>Bath & Body Collection</h1>
          <p>Luxurious body care products for complete wellness</p>
        </div>

        <div className="category-controls">
          <div className="results-info">
            <span>{sortedProducts.length} products found</span>
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
            <div className="no-products-icon">🛁</div>
            <h3>No Bath & Body products found</h3>
            <p>Check back soon for new arrivals!</p>
            <button className="btn" onClick={() => navigate('/categories')}>
              Browse Other Categories
            </button>
          </div>
        ) : (
          <div className="grid products">
            {sortedProducts.map(product => (
              <div key={product.id} className="card product">
                <div className="product-image-wrap">
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
                  <AddToCartButton 
                    product={product}
                    cart={cart}
                    setCart={setCart}
                    isAuthenticated={isAuthenticated}
                    onShowAuth={onOpenAuth}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BathBodyPage;
