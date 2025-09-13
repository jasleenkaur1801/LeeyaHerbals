import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import AddToCartButton from './components/AddToCartButton';

function StarRating({ value }) {
  const fullStars = Math.round(value)
  return (
    <div className="stars" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < fullStars ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

function ProductCard({ product, onWishlist, isInWishlist, isAuthenticated, onShowAuth, cart, setCart }) {
  const navigate = useNavigate()

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      onShowAuth()
      return
    }
    onWishlist(product)
  }

  return (
    <article className="card product" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="badge-row">
        {product.tag ? <span className="badge">{product.tag}</span> : null}
        <button 
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`} 
          onClick={handleWishlist}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-category">{product.category} • {product.weight}</p>
      <StarRating value={product.rating} />
      <div className="product-footer">
        <span className="price">₹{product.price}</span>
        <div onClick={(e) => e.stopPropagation()}>
          <AddToCartButton 
            product={product}
            cart={cart}
            setCart={setCart}
            isAuthenticated={isAuthenticated}
            onShowAuth={onShowAuth}
          />
        </div>
      </div>
    </article>
  )
}

function SkinCarePage({ products = [], cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState('all');

  // Filter products for Skin Care category
  const skinCareProducts = products.filter(product => 
    product.category === 'serum' ||
    product.category === 'cleanser' ||
    product.category === 'toner' ||
    product.category === 'facewash' ||
    product.category === 'facemask' ||
    product.category === 'acneoilgel' ||
    product.category === 'eyegel' ||
    product.category === 'bleachcream' ||
    product.category === 'skinconditioner' ||
    product.category === 'sunscreenlotion' ||
    product.category === 'cream' ||
    product.category === 'rosewater'
  );

  // Apply price filter
  const filteredProducts = skinCareProducts.filter(product => {
    let matchesPrice = true
    if (priceRange === 'under500') matchesPrice = product.price < 500
    else if (priceRange === '500to1000') matchesPrice = product.price >= 500 && product.price <= 1000
    else if (priceRange === 'over1000') matchesPrice = product.price > 1000
    return matchesPrice
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const clearAllFilters = () => {
    setPriceRange('all')
    setSortBy('relevance')
  }

  const hasActiveFilters = priceRange !== 'all'

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.filter(i => i.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const isProductInWishlist = (product) => {
    return wishlist.some(item => item.id === product.id)
  }

  return (
    <div className="search-results-page">
      <div className="container">
        <div className="search-header">
          <h1>Skin Care Collection</h1>
          <p>Showing {sortedProducts.length} skin care products</p>
        </div>

        <div className="search-layout">
          {/* Sidebar Filters */}
          <aside className="search-filters">
            <div className="filter-actions">
              {hasActiveFilters && (
                <button className="btn secondary" onClick={clearAllFilters} style={{ marginBottom: '1rem', width: '100%' }}>
                  Clear all filters
                </button>
              )}
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="500to1000">₹500 - ₹1000</option>
                <option value="over1000">Over ₹1000</option>
              </select>
            </div>

            <div className="filter-section">
              <h3>Sort By</h3>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <div className="filter-summary" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
              <div><strong>Active Filters:</strong></div>
              {priceRange !== 'all' && (
                <div>Price: {priceRange === 'under500' ? 'Under ₹500' : priceRange === '500to1000' ? '₹500-₹1000' : 'Over ₹1000'}</div>
              )}
              {!hasActiveFilters && <div>No filters applied</div>}
            </div>
          </aside>

          {/* Main Results */}
          <main className="search-results">
            {sortedProducts.length === 0 ? (
              <div className="no-results">
                <h2>No skin care products found</h2>
                <p>Try adjusting your filters</p>
                <button className="btn primary" onClick={clearAllFilters}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid products">
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onWishlist={toggleWishlist} 
                    isInWishlist={isProductInWishlist(product)}
                    isAuthenticated={isAuthenticated}
                    onShowAuth={onOpenAuth}
                    cart={cart}
                    setCart={setCart}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SkinCarePage;
