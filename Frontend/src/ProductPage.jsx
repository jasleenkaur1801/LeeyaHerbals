import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ALL_PRODUCTS, CATEGORIES } from './products'
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
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
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
  const [quantity, setQuantity] = useState(1);

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    setCart(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + quantity } : i)
      }
      return [...prev, { ...product, qty: quantity }]
    })
    alert(`${quantity} x ${product.name} added to cart!`);
  };

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
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to products</button>
      <div className="product-details">
        <div className="product-images">
          <img src={product.image} alt={product.name} className="main-image" />
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
            <button 
              className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                backgroundColor: isInWishlist ? '#ff4757' : '#f8f9fa',
                color: isInWishlist ? '#ffffff' : '#495057',
                border: `2px solid ${isInWishlist ? '#ff4757' : '#dee2e6'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isInWishlist ? '❤️' : '♡'} {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button className="qty-btn" onClick={() => setQuantity(prev => Math.max(1, prev - 1))} disabled={quantity === 1}>-</button>
                <span className="quantity-value">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(prev => prev + 1)}>+</button>
              </div>
            </div>
            <button 
              onClick={handleAddToCart}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '300px',
                padding: '1.2rem 2.5rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                backgroundColor: isAuthenticated ? '#1dbf73' : '#6c757d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '1rem',
                boxShadow: `0 4px 15px ${isAuthenticated ? 'rgba(24,167,99,.3)' : 'rgba(108,117,125,.3)'}`,
                transition: 'all 0.3s ease',
                opacity: '1',
                visibility: 'visible',
                position: 'relative',
                zIndex: '10'
              }}
              onMouseEnter={(e) => {
                if (isAuthenticated) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(24,167,99,.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (isAuthenticated) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(24,167,99,.3)';
                }
              }}
            >
              {isAuthenticated ? `Add to Cart - ₹${product.price * quantity}` : 'Login to Add to Cart'}
            </button>
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
        </div>
      </div>
    </div>
  );
}

export default ProductPage
