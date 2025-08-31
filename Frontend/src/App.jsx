import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ProductPage from './ProductPage'
import SearchResultsPage from './SearchResultsPage'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'

const CATEGORIES = [
  { key: 'serum', label: 'Serums' },
  { key: 'cleanser', label: 'Cleansers' },
  { key: 'toner', label: 'Toners' },
  { key: 'facewash', label: 'Face Wash' },
  { key: 'facepack', label: 'Face Packs' },
  { key: 'acne', label: 'Acne Gel' },
  { key: 'lotion', label: 'Lotions' },
]

const ALL_PRODUCTS = [
  { id: 1, name: 'Vitamin C Glow Serum', price: 699, category: 'serum', rating: 4.7, tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Gentle Foam Face Wash', price: 349, category: 'facewash', rating: 4.5, tag: 'New', image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Hydra Balance Toner', price: 299, category: 'toner', rating: 4.4, image: 'https://images.unsplash.com/photo-1571781923300-5c41ce3d9a2c?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Neem Purify Cleanser', price: 399, category: 'cleanser', rating: 4.3, image: 'https://images.unsplash.com/photo-1610173826124-1d8d2eddf65a?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Clay Detox Face Pack', price: 449, category: 'facepack', rating: 4.6, tag: 'Hot', image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Targeted Acne Gel', price: 379, category: 'acne', rating: 4.2, image: 'https://images.unsplash.com/photo-1600275669283-5b56309f3a3a?q=80&w=800&auto=format&fit=crop' },
  { id: 7, name: 'Daily Moisture Lotion', price: 499, category: 'lotion', rating: 4.5, image: 'https://images.unsplash.com/photo-1611930022110-0c4e8b4fcb13?q=80&w=800&auto=format&fit=crop' },
  { id: 8, name: 'Aloe Calm Toner', price: 279, category: 'toner', rating: 4.1, image: 'https://images.unsplash.com/photo-1618477461849-4729ce312e34?q=80&w=800&auto=format&fit=crop' },
]

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

function Navbar({ active, search, onSearch, onOpenCart, onOpenWishlist, onOpenAuth, onToggleMenu, wishlistCount, isAuthenticated, user, onLogout, cart }) {
  const navigate = useNavigate()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const searchRef = useRef(null)

  // Generate search suggestions based on products and categories
  const generateSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    const queryLower = query.toLowerCase()
    const productSuggestions = ALL_PRODUCTS
      .filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower)
      )
      .map(product => ({
        type: 'product',
        id: product.id,
        text: product.name,
        category: product.category,
        price: product.price
      }))

    const categorySuggestions = CATEGORIES
      .filter(cat => cat.label.toLowerCase().includes(queryLower))
      .map(cat => ({
        type: 'category',
        id: cat.key,
        text: cat.label,
        category: 'category'
      }))

    setSuggestions([...productSuggestions, ...categorySuggestions])
  }

  const handleSearchChange = (value) => {
    onSearch(value)
    generateSuggestions(value)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`)
    } else if (suggestion.type === 'category') {
      navigate(`/search?q=${suggestion.text}`)
    }
    setShowSuggestions(false)
    onSearch('')
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setShowSuggestions(false)
      onSearch('')
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header>
      <div className="promo">
        <div className="promo-inner">Free shipping on orders over ₹799 • Use code LEEYA10 for 10% off</div>
      </div>
      <div className="nav">
        <div className="container nav-inner">
          <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="leaf">✿</span>
            <span>Leeya Herbals</span>
          </div>
          <nav className="nav-links">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
            <a href="#shop" onClick={(e) => { e.preventDefault(); navigate('/#shop') }}>Shop</a>
            <a href="#categories" onClick={(e) => { e.preventDefault(); navigate('/#categories') }}>Categories</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/#about') }}>About</a>
            <a href="#blog" onClick={(e) => { e.preventDefault(); navigate('/#blog') }}>Blog</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/#contact') }}>Contact</a>
          </nav>
          <button className="hamburger" aria-label="Menu" onClick={onToggleMenu}>☰</button>
          <div className="nav-actions">
            <div className="search-container" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input 
                    className="search" 
                    placeholder="Search products, categories..." 
                    value={search} 
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => search.trim() && setShowSuggestions(true)}
                  />
                  <button type="submit" className="search-btn">Search</button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="search-suggestions">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="suggestion-icon">
                          {suggestion.type === 'product' ? '🛍️' : '🏷️'}
                        </span>
                        <div className="suggestion-content">
                          <span className="suggestion-text">{suggestion.text}</span>
                          {suggestion.type === 'product' && (
                            <span className="suggestion-meta">
                              {suggestion.category} • ₹{suggestion.price}
                            </span>
                          )}
                          {suggestion.type === 'category' && (
                            <span className="suggestion-meta">Category</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
                          <button 
                className={`cart ${!isAuthenticated ? 'auth-required' : ''}`} 
                aria-label={isAuthenticated ? "Cart" : "Login to view cart"} 
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuth();
                  } else {
                    // Navigate to cart page instead of opening drawer
                    navigate('/cart');
                  }
                }}
                title={isAuthenticated ? "View cart" : "Login to view cart"}
              >
                🛒
                {isAuthenticated && cart.length > 0 && (
                  <span className="cart-count">{cart.reduce((total, item) => total + item.qty, 0)}</span>
                )}
              </button>
              <button 
                className={`wishlist ${!isAuthenticated ? 'auth-required' : ''}`} 
                aria-label={isAuthenticated ? "Wishlist" : "Login to view wishlist"} 
                onClick={() => {
                  if (!isAuthenticated) {
                    onOpenAuth();
                  } else {
                    onOpenWishlist();
                  }
                }}
                title={isAuthenticated ? "View wishlist" : "Login to view wishlist"}
              >
                💖
                {isAuthenticated && wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
              </button>
              {isAuthenticated ? (
                <UserProfile user={user} onLogout={onLogout} />
              ) : (
                <button className="cart" aria-label="Login" onClick={onOpenAuth}>👤</button>
              )}
          </div>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <h1>Nature-first skincare for radiant, calm skin</h1>
          <p>Scientifically-crafted herbal formulas — gentle, effective, and toxin-free.</p>
          <div className="hero-cta">
            <a href="#shop" className="btn primary">Shop now</a>
            <a href="#about" className="btn ghost">Our story</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden>
          <div className="hero-image-wrap">
            <img src="/image1.jpeg" alt="Herbal skincare" className="hero-img" />
            <span className="chip">Herbal Active</span>
            <span className="chip rating">★ Trusted by 2k+</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function CircleCategories({ onChoose }) {
  const items = [
    { label: 'Skin', image: 'https://images.unsplash.com/photo-1601042879364-f3947d3f9c36?q=80&w=800&auto=format&fit=crop' },
    { label: 'Hair', image: 'https://images.unsplash.com/photo-1510414696678-2415ad8474aa?q=80&w=800&auto=format&fit=crop' },
    { label: 'Bath & Body', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop' },
  ]
  return (
    <section className="section">
      <div className="container section-head"><h2>Explore by concern</h2><p>Shop Skin, Hair, and Bath & Body</p></div>
      <div className="container circle-grid">
        {items.map((it) => (
          <button key={it.label} className="circle-card" onClick={() => { onChoose('all'); location.hash = '#shop' }}>
            <span className="circle-wrap"><img src={it.image} alt={it.label} /></span>
            <span className="circle-title">{it.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function CategoryPills({ selected, onSelect }) {
  return (
    <div className="pills" role="tablist" aria-label="Product categories">
      <button className={selected === 'all' ? 'pill active' : 'pill'} onClick={() => onSelect('all')}>All</button>
      {CATEGORIES.map(c => (
        <button key={c.key} className={selected === c.key ? 'pill active' : 'pill'} onClick={() => onSelect(c.key)} id={`cat-${c.key}`}>{c.label}</button>
      ))}
    </div>
  )
}

function ProductCard({ product, onAdd, onWishlist, isInWishlist, isAuthenticated, onShowAuth }) {
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }
    onAdd(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }
    onWishlist(product);
  };

  return (
    <article className="card product">
      <div className="badge-row">
        {product.tag ? <span className="badge">{product.tag}</span> : null}
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button 
          className={`wishlist ${isInWishlist ? 'active' : ''} ${!isAuthenticated ? 'auth-required' : ''}`} 
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={handleWishlist}
          title={isAuthenticated ? (isInWishlist ? "Remove from wishlist" : "Add to wishlist") : "Login to manage wishlist"}
        >
          {isInWishlist ? '❤️' : '♡'}
        </button>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <StarRating value={product.rating} />
      <div className="product-footer">
        <span className="price">₹{product.price}</span>
        <button 
          className={`btn small ${isAuthenticated ? 'authenticated' : 'auth-required'}`}
          onClick={handleAddToCart}
        >
          {isAuthenticated ? 'Add to cart' : 'Login to Add'}
        </button>
      </div>
    </article>
  )
}

function ProductsGrid({ products, onAdd, onWishlist, wishlist, isAuthenticated, onShowAuth }) {
  return (
    <section id="shop" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Featured products</h2>
          <p>Clean, cruelty-free skincare for every skin type.</p>
        </div>
        <div className="grid products">
          {products.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onAdd={onAdd} 
              onWishlist={onWishlist}
              isInWishlist={wishlist.some(item => item.id === p.id)}
              isAuthenticated={isAuthenticated}
              onShowAuth={onShowAuth}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section alt">
      <div className="container testimonials">
        <blockquote>
          <img className="avatar" src="https://i.pravatar.cc/60?img=5" alt="Aisha" />
          “My acne calmed in two weeks. The toner is magic!”
          <cite>— Aisha</cite>
        </blockquote>
        <blockquote>
          <img className="avatar" src="https://i.pravatar.cc/60?img=12" alt="Rohan" />
          “Finally a lotion that hydrates without greasiness.”
          <cite>— Rohan</cite>
        </blockquote>
        <blockquote>
          <img className="avatar" src="https://i.pravatar.cc/60?img=24" alt="Meera" />
          “The clay pack is my Sunday ritual.”
          <cite>— Meera</cite>
        </blockquote>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="section">
      <div className="container newsletter">
        <h3>Get skincare tips and 10% off your first order</h3>
        <form className="subscribe" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" required />
          <button className="btn primary" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

function ImageGallery() {
  const images = [
    'https://images.unsplash.com/photo-1610173826124-1d8d2eddf65a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571781923300-5c41ce3d9a2c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600275669283-5b56309f3a3a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618477461849-4729ce312e34?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
  ]
  return (
    <section id="gallery" className="section">
      <div className="container section-head">
        <h2>Leeya Herbals in pictures</h2>
        <p>Product highlights, textures and natural ingredients</p>
      </div>
      <div className="container gallery-grid">
        {images.map((src, i) => (
          <figure key={i} className="gallery-item">
            <img src={src} alt={`Leeya gallery ${i+1}`} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand small">
          <span className="leaf">✿</span>
          <span>Leeya Herbals</span>
        </div>
        <div className="footer-grid">
          <div>
            <h4>Shop</h4>
            <a href="#cat-serum">Serums</a>
            <a href="#cat-cleanser">Cleansers</a>
            <a href="#cat-toner">Toners</a>
            <a href="#cat-facepack">Face Packs</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about">About us</a>
            <a href="#care">Ingredients</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#shipping">Shipping</a>
            <a href="#returns">Returns</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Leeya Herbals. All rights reserved.</p>
      </div>
    </footer>
  )
}

function CartPage({ cart, setCart }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState('cod');
  const [coupon, setCoupon] = useState('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const onlineDiscount = method === 'online' ? subtotal * 0.10 : 0;
  const couponDiscount = coupon.trim().toUpperCase() === 'FIRST10' ? subtotal * 0.10 : 0;
  const total = Math.max(0, subtotal - onlineDiscount - couponDiscount);

  const updateQuantity = (itemId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, qty: newQty } : item
    ));
  };

  const removeItem = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button className="btn primary" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Continue Shopping
          </button>
          <h1>Your Cart ({cart.reduce((total, item) => total + item.qty, 0)} items)</h1>
        </div>
        
        <div className="cart-content">
          <div className="cart-items-section">
            <h2>Cart Items</h2>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">₹{item.price}</div>
                  <div className="cart-item-category">{item.category}</div>
                </div>
                <div className="cart-item-quantity">
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.qty}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-total">
                  ₹{item.price * item.qty}
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeItem(item.id)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary-section">
            <h2>Order Summary</h2>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal ({cart.reduce((total, item) => total + item.qty, 0)} items)</span>
                <span>₹{subtotal}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{subtotal >= 799 ? 'Free' : '₹99'}</span>
              </div>
              
              {subtotal < 799 && (
                <div className="shipping-notice">
                  <span>Add ₹{799 - subtotal} more for free shipping!</span>
                </div>
              )}
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{subtotal + (subtotal >= 799 ? 0 : 99)}</span>
              </div>
              
              <button className="btn primary checkout-btn">
                Proceed to Checkout
              </button>
              
              <div className="payment-options">
                <h3>Payment Options</h3>
                <div className="payment-method">
                  <label>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={method === 'cod'} 
                      onChange={(e) => setMethod(e.target.value)} 
                    />
                    Cash on Delivery
                  </label>
                  <label>
                    <input type="radio" 
                      name="payment" 
                      value="online" 
                      checked={method === 'online'} 
                      onChange={(e) => setMethod(e.target.value)} 
                    />
                    Online Payment (10% off)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [dark, setDark] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Clear search when navigating to different routes
  useEffect(() => {
    if (location.pathname === '/') {
      setSearch('')
    }
  }, [location.pathname])

  useEffect(() => { document.body.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => {
    const savedCart = localStorage.getItem('leeya_cart');
    const savedWishlist = localStorage.getItem('leeya_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);
  useEffect(() => { localStorage.setItem('leeya_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('leeya_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  
  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
              } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setShowAuth(false)
  }

  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const carousel = document.querySelector('.carousel .carousel-track')
    if (!carousel) return
    const timer = setInterval(() => {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth
      if (carousel.scrollLeft >= maxScroll - 8) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        carousel.scrollBy({ left: 320, behavior: 'smooth' })
      }
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const qCompact = q.replace(/\s+/g, '');
    return ALL_PRODUCTS.filter(p => {
      const name = p.name.toLowerCase();
      const nameCompact = name.replace(/\s+/g, '');
      const cat = p.category.toLowerCase();
      const matchesQuery = !q || name.includes(q) || nameCompact.includes(qCompact) || cat.includes(q);
      const matchesCategory = q ? true : (category === 'all' || p.category === category);
      return matchesCategory && matchesQuery;
    });
  }, [category, search]);



  return (
    <>
                      <Navbar 
                  active={category} 
                  search={search} 
                  onSearch={setSearch} 
                  onOpenCart={() => setShowCart(true)} 
                  onOpenWishlist={() => setShowWishlist(true)} 
                  onOpenAuth={() => setShowAuth(true)} 
                  onToggleMenu={() => setShowMenu(s => !s)} 
                  wishlistCount={wishlist.length}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                  cart={cart}
                />
      <Routes>
        <Route path="/" element={
          <>
            <div className="theme-toggle-wrap"><button className="theme-toggle" onClick={() => setDark(v => !v)}>{dark ? '🌙' : '☀️'}</button></div>
            {showMenu ? (
              <div className="mobile-menu">
                <a href="#" onClick={() => setShowMenu(false)}>Home</a>
                <a href="#shop" onClick={() => setShowMenu(false)}>Shop</a>
                <a href="#about" onClick={() => setShowMenu(false)}>About</a>
                <a href="#contact" onClick={() => setShowMenu(false)}>Contact</a>
              </div>
            ) : null}
            <Hero />
            <section className="section reveal" id="categories">
              <div className="container section-head"><h2>Shop by category</h2><p>Find the perfect ritual for your skin</p></div>
              <div className="container cat-grid">
                {[
                  {icon:'🫧',label:'Cleansers'},
                  {icon:'💧',label:'Serums'},
                  {icon:'🌸',label:'Toners'},
                  {icon:'🧖‍♀️',label:'Masks'},
                  {icon:'🌿',label:'Natural Oils'},
                  {icon:'🧴',label:'Lotions'},
                ].map((c,i)=> (
                  <div key={i} className="cat-card"><span className="cat-icn">{c.icon}</span><span>{c.label}</span></div>
                ))}
              </div>
            </section>
            <div className="reveal"><CircleCategories onChoose={setCategory} /></div>
            <section className="section benefits">
              <div className="container benefits-inner">
                <div className="benefit"><span>🌿</span><div><strong>100% Herbal</strong><p>Toxin-free, plant-powered formulas</p></div></div>
                <div className="benefit"><span>🚚</span><div><strong>Free Shipping</strong><p>On orders above ₹799</p></div></div>
                <div className="benefit"><span>🛡️</span><div><strong>Dermat Tested</strong><p>Safe for all skin types</p></div></div>
                <div className="benefit"><span>↩️</span><div><strong>Easy Returns</strong><p>7-day hassle-free returns</p></div></div>
              </div>
            </section>
            <section className="section brands">
              <div className="container brands-inner">
                <span className="brand-pill">Amla</span>
                <span className="brand-pill">Aloe</span>
                <span className="brand-pill">Neem</span>
                <span className="brand-pill">Turmeric</span>
                <span className="brand-pill">Tea Tree</span>
                <span className="brand-pill">Rose</span>
              </div>
            </section>
            <section className="section">
              <div className="container">
                <CategoryPills selected={category} onSelect={setCategory} />
              </div>
            </section>
            <section className="section reveal">
              <ProductsGrid 
                products={filtered} 
                onAdd={(p)=>{
                  setCart(prev => {
                    const found = prev.find(i => i.id === p.id);
                    if (found) { return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i); }
                    return [...prev, { ...p, qty: 1 }];
                  });
                  // Show success message instead of opening cart
                  alert(`${p.name} added to cart!`);
                }}
                onWishlist={(p) => {
                  setWishlist(prev => {
                    const found = prev.find(i => i.id === p.id)
                    if (found) {
                      return prev.filter(i => i.id !== p.id)
                    }
                    return [...prev, p]
                  })
                }}
                wishlist={wishlist}
                isAuthenticated={isAuthenticated}
                onShowAuth={() => setShowAuth(true)}
              />
            </section>
            <section className="section reveal">
              <div className="container section-head"><h2>Featured</h2><p>Best sellers loved by our community</p></div>
              <div className="container carousel" id="featured">
                <div className="carousel-track">
                  {ALL_PRODUCTS.slice(0,6).map(p => (
                    <div key={`f-${p.id}`} className="carousel-slide">
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        onAdd={(p)=>{
                          setCart(prev => {
                            const found = prev.find(i => i.id === p.id)
                            if (found) { return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) }
                            return [...prev, { ...p, qty: 1 }]
                          })
                          // Show success message instead of opening cart
                          alert(`${p.name} added to cart!`)
                        }}
                        onWishlist={(p) => {
                          setWishlist(prev => {
                            const found = prev.find(i => i.id === p.id)
                            if (found) {
                              return prev.filter(i => i.id !== p.id)
                            }
                            return [...prev, p]
                          })
                        }}
                        isInWishlist={wishlist.some(item => item.id === p.id)}
                        isAuthenticated={isAuthenticated}
                        onShowAuth={() => setShowAuth(true)}
                      />
                    </div>
                  ))}
                </div>
                <div className="carousel-controls">
                  <a href="#featured" className="car-btn prev" onClick={(e)=>{e.preventDefault(); const t=e.currentTarget.closest('.carousel').querySelector('.carousel-track'); t.scrollBy({left:-320,behavior:'smooth'});}}>‹</a>
                  <a href="#featured" className="car-btn next" onClick={(e)=>{e.preventDefault(); const t=e.currentTarget.closest('.carousel').querySelector('.carousel-track'); t.scrollBy({left:320,behavior:'smooth'});}}>›</a>
                </div>
              </div>
            </section>
            <section className="reveal"><Testimonials /></section>
            <section id="about" className="section reveal">
              <div className="container section-head"><h2>About Leeya Herbals</h2><p>Our promise: gentle, effective, and honest skincare</p></div>
              <div className="container">
                <p>We craft nature-first skincare using clinically-backed herbal actives. Every formula is cruelty-free, free from parabens, sulfates, and mineral oils, and made in small batches for freshness. Our mission is to simplify routines with high-performance essentials that let your skin breathe and glow.</p>
              </div>
            </section>
            <section id="contact" className="section reveal">
              <div className="container section-head"><h2>Contact Us</h2><p>We'd love to hear from you</p></div>
              <div className="container">
                <form className="subscribe" onSubmit={(e)=>e.preventDefault()}>
                  <input type="text" placeholder="Your name" required />
                  <input type="email" placeholder="Your email" required />
                  <button className="btn primary" type="submit">Send</button>
                </form>
                <p className="muted">Email: care@leeyaherbals.example • Phone: +91-90000 00000 • Address: Mumbai, India</p>
              </div>
            </section>
            <section className="section reveal" id="blog">
              <div className="container section-head"><h2>Skincare Tips</h2><p>Learn how to care for your skin naturally</p></div>
              <div className="container blog-grid">
                {[1,2,3].map((i)=> (
                  <article key={i} className="blog-card">
                    <img src={`https://images.unsplash.com/photo-15${i}6228720-195a672e8a03?q=80&w=800&auto=format&fit=crop`} alt="Blog" />
                    <div className="blog-body">
                      <h3>Herbal skincare routine #{i}</h3>
                      <p>Simple steps to keep your skin calm, clear and hydrated.</p>
                      <a href="#" className="btn small">Read More</a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <div className="reveal"><ImageGallery /></div>
            <Newsletter />
            <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
          </>
        } />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>
      {showCart ? (
        <div className="drawer" role="dialog" aria-label="Cart">
          <div className="drawer-panel">
            <div className="drawer-head"><strong>Cart</strong><button onClick={() => setShowCart(false)}>✕</button></div>
            {cart.length === 0 ? <p>Your cart is empty.</p> : (
              <div className="cart-list">
                {cart.map(item => (
                  <div key={item.id} className="cart-row">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-info">
                      <div className="cart-name">{item.name}</div>
                      <div className="cart-meta">₹{item.price} ×
                        <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i, qty: Math.max(1, i.qty-1)}:i))} className="qty">−</button>
                        <span className="qtyv">{item.qty}</span>
                        <button onClick={()=>setCart(c=>c.map(i=>i.id===item.id?{...i, qty: i.qty+1}:i))} className="qty">+</button>
                      </div>
                    </div>
                    <div className="cart-sum">₹{item.price * item.qty}</div>
                    <button className="cart-remove" onClick={()=>setCart(c=>c.filter(i=>i.id!==item.id))}>Remove</button>
                  </div>
                ))}
                <div className="cart-total">Subtotal: ₹{cart.reduce((s,i)=>s + i.price * i.qty, 0)}</div>
                <button className="btn primary" onClick={() => window.location.href = '/cart'}>Go to Cart</button>
              </div>
            )}
          </div>
          <div className="drawer-overlay" onClick={() => setShowCart(false)}></div>
        </div>
      ) : null}
      {showWishlist ? (
        <div className="drawer" role="dialog" aria-label="Wishlist">
          <div className="drawer-panel">
            <div className="drawer-head"><strong>Wishlist</strong><button onClick={() => setShowWishlist(false)}>✕</button></div>
            {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
              <div className="wishlist-list">
                {wishlist.map(item => (
                  <div key={item.id} className="wishlist-row">
                    <img src={item.image} alt={item.name} />
                    <div className="wishlist-info">
                      <div className="wishlist-name">{item.name}</div>
                      <div className="wishlist-meta">₹{item.price}</div>
                    </div>
                    <div className="wishlist-actions">
                      <button className="btn small" onClick={() => {
                        setCart(prev => {
                          const found = prev.find(i => i.id === item.id);
                          if (found) {
                            return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
                          }
                          return [...prev, { ...item, qty: 1 }];
                        });
                        alert(`${item.name} added to cart!`);
                      }}>Add to Cart</button>
                      <button className="wishlist-remove" onClick={() => setWishlist(prev => prev.filter(i => i.id !== item.id))}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="drawer-overlay" onClick={() => setShowWishlist(false)}></div>
        </div>
      ) : null}
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
      
      {/* Authentication Required Prompt */}
      {!isAuthenticated && (
        <div className="auth-notice" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#2d5a27',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} onClick={() => setShowAuth(true)}>
          🔒 Login to access cart & wishlist
        </div>
      )}
      <Footer />
    </>
  )
}

export default App
