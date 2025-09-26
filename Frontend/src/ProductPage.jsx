import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ALL_PRODUCTS, CATEGORIES } from './products'
import AddToCartButton from './components/AddToCartButton'
import './App.css'

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

function ProductCard({ product, onAdd }) {
  const navigate = useNavigate()

  return (
    <article className="card product" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="badge-row">
        {product.tag ? <span className="badge">{product.tag}</span> : null}
      </div>
      <div className="product-image-wrap">
        <img 
          src={product.image?.startsWith('/uploads') 
            ? `http://localhost:8080${product.image}` 
            : product.image || '/placeholder-product.png'} 
          alt={product.name} 
          className="product-image" 
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-product.png'; e.target.onerror = null; }}
        />
        <button className="wishlist" aria-label="Add to wishlist" onClick={(e) => e.stopPropagation()}>♡</button>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <StarRating value={product.rating} />
      <div className="product-footer">
        <span className="price">₹{product.price}</span>
        <button className="btn small" onClick={(e) => { e.stopPropagation(); onAdd(product) }}>Add to cart</button>
      </div>
    </article>
  )
}

function ProductPage({ cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = ALL_PRODUCTS.find(p => p.id === parseInt(productId, 10));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="container product-page" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Product not found.</h2>
        <button className="btn primary" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }


  const toggleWishlist = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setWishlist(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.filter(i => i.id !== product.id)
      }
      return [...prev, product]
    })
  };

  const isInWishlist = wishlist.some(item => item.id === product.id);

  return (
    <div className="container product-page">
      <div className="product-details">
        <div className="product-images">
          <img 
            src={product.image?.startsWith('/uploads') 
              ? `http://localhost:8080${product.image}` 
              : product.image || '/placeholder-product.png'} 
            alt={product.name} 
            className="main-image"
            onError={(e) => { e.target.src = '/placeholder-product.png'; e.target.onerror = null; }}
          />
        </div>
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <StarRating value={product.rating} />
              <span className="rating-text">({product.rating} / 5)</span>
            </div>
            <p className="product-category">Category: <span>{product.category}</span></p>
          </div>
          <p className="product-description">{product.description}</p>
          <div className="product-price">₹{product.price}</div>
          <div className="product-actions">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
              <AddToCartButton 
                product={product}
                cart={cart}
                setCart={setCart}
                isAuthenticated={isAuthenticated}
                onShowAuth={onOpenAuth}
              />
              <button 
                className={`product-wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={toggleWishlist}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: isInWishlist ? '#ff4757' : '#f8f9fa',
                  color: isInWishlist ? '#ffffff' : '#495057',
                  border: `1px solid ${isInWishlist ? '#ff4757' : '#dee2e6'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {isInWishlist ? '❤️' : '♡'} {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
          <div className="product-features">
            <h3>Key Benefits</h3>
            <ul>
              <li>Natural ingredients</li>
              <li>Dermatologically tested</li>
              <li>Cruelty-free</li>
              <li>Suitable for all skin types</li>
            </ul>
          </div>
          <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            <button 
              className="back-btn" 
              onClick={() => navigate(-1)}
              style={{
                padding: '0.6rem 1.2rem',
                fontSize: '0.9rem',
                fontWeight: '500',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Back to products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage
