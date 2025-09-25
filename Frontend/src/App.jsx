import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import './ContactUs.css'
import './responsive.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ProductPage from './ProductPage'
import SearchResultsPage from './SearchResultsPage'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'
import Chatbot from './Chatbot'
import Reviews from './Reviews'
import SkincareFlipCards from './SkincareFlipCards'
import CartPage from './CartPage'
import OrdersPage from './OrdersPage'
import PaymentSuccess from './PaymentSuccess'
import CheckoutPage from './CheckoutPage';
import AdminDashboard from './AdminDashboard'
import ProfilePage from './ProfilePage'
import CategoriesPage from './CategoriesPage'
import BathBodyPage from './BathBodyPage'
import SkinCarePage from './SkinCarePage'
import CollectionsPage from './CollectionsPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import VisitUsPage from './VisitUsPage';
import FAQPage from './FAQPage';
import FaceWashGelPage from './FaceWashGelPage';

function AuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    alert('Please login or signup to use AI chatbot.');
    navigate('/');
  }, []);
  return null;
}


import { ALL_PRODUCTS, CATEGORIES } from './products'

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

function Navbar({ active, search, onSearch, onOpenCart, onOpenWishlist, onOpenAuth, onToggleMenu, wishlistCount, isAuthenticated, user, onLogout, cart, showMenu }) {
  const navigate = useNavigate()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)

  // Generate search suggestions based on products and categories
  const generateSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }

    const queryLower = query.toLowerCase()
    const productSuggestions = ALL_PRODUCTS
      .filter(product => 
        product.name.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower)
      )
      .slice(0, 8) // Limit to 8 suggestions like Amazon
      .map(product => ({
        type: 'product',
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        weight: product.weight
      }))

    const categorySuggestions = CATEGORIES
      .filter(cat => cat.label.toLowerCase().includes(queryLower))
      .slice(0, 3) // Limit category suggestions
      .map(cat => ({
        type: 'category',
        id: cat.key,
        name: cat.label,
        category: 'category'
      }))

    setSuggestions([...productSuggestions, ...categorySuggestions])
    setSelectedIndex(-1)
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
      navigate(`/search?q=${suggestion.name}`)
    }
    setShowSuggestions(false)
    onSearch('')
    setSelectedIndex(-1)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else if (search.trim()) {
          navigate(`/search?q=${encodeURIComponent(search.trim())}`)
          setShowSuggestions(false)
          onSearch('')
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
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
    <header className="site-header">
      {/* Top navbar with branding, search, and user actions */}
      <div className="nav-top" style={{ '--header-height': '60px' }}>
        <div className="container nav-top-inner responsive-nav">
          {/* Mobile Hamburger - left aligned */}
          <button 
            className="hamburger mobile-only" 
            aria-label="Toggle Menu" 
            aria-expanded={showMenu}
            aria-controls="mobile-menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="hamburger-icon">
              <span className={`hamburger-line ${showMenu ? 'open' : ''}`}></span>
            </span>
          </button>
          <div className="brand-section">
            <div className="brand" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/')} style={{ cursor: 'pointer' }}>
              <span className="leaf">✿</span>
              <span>Leeya Herbals</span>
            </div>
          </div>
          
          {user?.role !== 'admin' && (
            <div className="search-container mobile-search" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-input-wrapper">
                  <span className="search-icon">🔍</span>
                  <input 
                    className="search" 
                    placeholder="    Search products, categories..." 
                    value={search} 
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => search.trim() && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                  <button type="submit" className="search-btn">Search</button>
                </div>
                {showSuggestions && (
                  <div className="amazon-search-dropdown">
                    {suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div 
                          key={`${suggestion.type}-${suggestion.id}`} 
                          className={`amazon-suggestion-item ${
                            index === selectedIndex ? 'selected' : ''
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          {suggestion.type === 'product' ? (
                            <>
                              <div className="suggestion-image">
                                <img 
                                  src={suggestion.image} 
                                  alt={suggestion.name}
                                  onError={(e) => {
                                    e.target.src = '/placeholder-product.png'
                                  }}
                                />
                              </div>
                              <div className="suggestion-details">
                                <div className="suggestion-name">{suggestion.name}</div>
                                <div className="suggestion-meta">
                                  <span className="suggestion-category">{suggestion.category}</span>
                                  <span className="suggestion-weight">{suggestion.weight}</span>
                                </div>
                                <div className="suggestion-price">₹{suggestion.price}</div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="suggestion-icon-category">
                                <span>🏷️</span>
                              </div>
                              <div className="suggestion-details">
                                <div className="suggestion-name">{suggestion.name}</div>
                                <div className="suggestion-meta">
                                  <span className="suggestion-category-label">Category</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-suggestions">
                        <div className="no-suggestions-icon">🔍</div>
                        <div className="no-suggestions-text">No products found</div>
                        <div className="no-suggestions-subtext">Try searching for something else</div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}
          
          <div className="user-actions mobile-actions">
            {user?.role !== 'admin' && (
              <>
                <button 
                  className="chat-btn" 
                  aria-label="Chatbot"
                  title="Ask LeeyaBot"
                  onClick={() => {
                    if (!isAuthenticated) {
                      onOpenAuth();
                    } else {
                      navigate('/chat');
                    }
                  }}
                >💬</button>
                <button 
                  className={`wishlist ${!isAuthenticated ? 'auth-required' : ''}`} 
                  aria-label={isAuthenticated ? "Wishlist" : "Login to view wishlist"} 
                  onClick={() => {
                    if (!isAuthenticated) {
                      onOpenAuth();
                    } else {
                      navigate('/wishlist');
                    }
                  }}
                  title={isAuthenticated ? "View wishlist" : "Login to view wishlist"}
                >
                  💖
                  {isAuthenticated && wishlistCount > 0 && <span className="wishlist-count">{wishlistCount}</span>}
                </button>
                
                <button 
                  className={`cart ${!isAuthenticated ? 'auth-required' : ''}`} 
                  aria-label={isAuthenticated ? "Cart" : "Login to view cart"} 
                  onClick={() => {
                    if (!isAuthenticated) {
                      onOpenAuth();
                    } else {
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
              </>
            )}
            
            {isAuthenticated ? (
              <>
                <button className="profile-btn" aria-label="Profile" onClick={() => navigate('/profile')}>👤</button>
                <UserProfile user={user} onLogout={onLogout} />
              </>
            ) : (
              <button className="login-btn" aria-label="Login" onClick={onOpenAuth}>👤</button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navbar with main navigation */}
      <div className="nav-bottom">
<div className="container nav-bottom-inner">
  <button 
    className="hamburger" 
    aria-label="Toggle Menu" 
    aria-expanded={showMenu}
    aria-controls="mobile-menu"
    onClick={() => setShowMenu(!showMenu)}
  >
    <span className="hamburger-icon">
      <span className={`hamburger-line ${showMenu ? 'open' : ''}`}></span>
    </span>
  </button>
  
  {/* Desktop Navigation - Hidden on mobile */}
  <nav className="nav-links-main desktop-nav">
    {user?.role !== 'admin' && (
      <>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
        <a href="#profile" onClick={(e) => { e.preventDefault(); navigate('/profile') }}>Profile</a>
        <div className="nav-dropdown">
          <a href="#categories" onClick={(e) => { e.preventDefault(); navigate('/categories') }}>
            Categories <span className="dropdown-arrow">▼</span>
          </a>
          <div className="dropdown-content">
            <a href="#cat-serum" onClick={(e) => { e.preventDefault(); navigate('/search?q=serum') }}>Serums</a>
            <a href="#cat-cleanser" onClick={(e) => { e.preventDefault(); navigate('/search?q=cleanser') }}>Cleansers</a>
            <a href="#cat-toner" onClick={(e) => { e.preventDefault(); navigate('/search?q=toner') }}>Toners</a>
            <a href="#cat-facemask" onClick={(e) => { e.preventDefault(); navigate('/search?q=facemask') }}>Face Masks</a>
            <a href="#cat-facewashgel" onClick={(e) => { e.preventDefault(); navigate('/search?q=facewashgel') }}>Face Wash Gel</a>
            <a href="#cat-acneoilgel" onClick={(e) => { e.preventDefault(); navigate('/search?q=acneoilgel') }}>Acne Oil Gel</a>
          </div>
        </div>
        <div className="nav-dropdown">
          <a href="#bath-body" onClick={(e) => { e.preventDefault(); navigate('/categories/bath-body') }}>
            Bath & Body <span className="dropdown-arrow">▼</span>
          </a>
          <div className="dropdown-content">
            <a href="#body-wash" onClick={(e) => { e.preventDefault(); navigate('/search?q=body wash') }}>Body Wash</a>
            <a href="#body-lotion" onClick={(e) => { e.preventDefault(); navigate('/search?q=body lotion') }}>Body Lotion</a>
            <a href="#bath-salts" onClick={(e) => { e.preventDefault(); navigate('/search?q=bath salts') }}>Bath Salts</a>
            <a href="#scrubs" onClick={(e) => { e.preventDefault(); navigate('/search?q=scrubs') }}>Body Scrubs</a>
          </div>
        </div>
        <div className="nav-dropdown">
          <a href="#skincare" onClick={(e) => { e.preventDefault(); navigate('/categories/skin-care') }}>
            Skin Care <span className="dropdown-arrow">▼</span>
          </a>
          <div className="dropdown-content">
            <a href="#anti-aging" onClick={(e) => { e.preventDefault(); navigate('/search?q=anti aging') }}>Anti-Aging</a>
            <a href="#moisturizers" onClick={(e) => { e.preventDefault(); navigate('/search?q=moisturizers') }}>Moisturizers</a>
            <a href="#sun-protection" onClick={(e) => { e.preventDefault(); navigate('/search?q=sunscreen') }}>Sun Protection</a>
            <a href="#treatments" onClick={(e) => { e.preventDefault(); navigate('/search?q=treatments') }}>Treatments</a>
          </div>
        </div>
        <div className="nav-dropdown">
          <a href="#collections" onClick={(e) => { e.preventDefault(); navigate('/collections') }}>
            Collections <span className="dropdown-arrow">▼</span>
          </a>
          <div className="dropdown-content">
            <a href="#face-kits" onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              setShowMenu(false); 
              setCategory('facialkit'); 
              setSearch('');
              setTimeout(() => { 
                document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); 
              }, 200); 
            }}>Facial Kits</a>
            <a href="#gift-sets" onClick={(e) => { e.preventDefault(); navigate('/search?q=gift set') }}>Gift Sets</a>
            <a href="#travel-kits" onClick={(e) => { e.preventDefault(); navigate('/search?q=travel kit') }}>Travel Kits</a>
            <a href="#seasonal" onClick={(e) => { e.preventDefault(); navigate('/search?q=seasonal') }}>Seasonal Collections</a>
          </div>
        </div>
        <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/about') }}>About Us</a>
        <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/contact') }}>Contact</a>
      </>
    )}
  </nav>

  {/* Mobile Menu Overlay */}
  {showMenu && (
    <div className={`mobile-menu-overlay ${showMenu ? 'open' : ''}`} onClick={() => setShowMenu(false)}>
      <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="mobile-menu-close" onClick={() => setShowMenu(false)}>×</button>
        </div>
        <nav className="mobile-nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); setShowMenu(false); }}>🏠 Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/profile'); setShowMenu(false); }}>👤 Profile</a>
          
          <div className="mobile-nav-section">
            <h4>Categories</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=serum'); setShowMenu(false); }}>💧 Serums</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=cleanser'); setShowMenu(false); }}>🫧 Cleansers</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=toner'); setShowMenu(false); }}>🌸 Toners</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=facemask'); setShowMenu(false); }}>🎭 Face Masks</a>
          </div>
          
          <div className="mobile-nav-section">
            <h4>Bath & Body</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=body wash'); setShowMenu(false); }}>🛁 Body Wash</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=body lotion'); setShowMenu(false); }}>🧴 Body Lotion</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=scrubs'); setShowMenu(false); }}>🧽 Body Scrubs</a>
          </div>
          
          <div className="mobile-nav-section">
            <h4>Skin Care</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=moisturizers'); setShowMenu(false); }}>🧴 Moisturizers</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=sunscreen'); setShowMenu(false); }}>🌞 Sun Protection</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/search?q=treatments'); setShowMenu(false); }}>🪄 Treatments</a>
          </div>
          
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/collections'); setShowMenu(false); }}>🌿 Collections</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); setShowMenu(false); }}>ℹ️ About Us</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); setShowMenu(false); }}>✉️ Contact</a>
        </nav>
      </div>
    </div>
  )}
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
            <img 
              src="/image1.jpeg" 
              alt="Herbal skincare" 
              className="hero-img" 
              loading="lazy"
              width="600"
              height="400"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
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
    { label: 'Cleansers', icon: '🫧', color: '#a7f3d0' },
    { label: 'Serums', icon: '💧', color: '#bfdbfe' },
    { label: 'Toners', icon: '🌸', color: '#fecaca' },
    { label: 'Masks', icon: '🧖‍♀️', color: '#fde68a' },
    { label: 'Natural Oils', icon: '🌿', color: '#bbf7d0' },
    { label: 'Lotions', icon: '🧴', color: '#e9d5ff' },
  ]
  return (
    <section className="section">
      <div className="container section-head"><h2>Explore by concern</h2><p>Shop Skin, Hair, and Bath & Body</p></div>
      <div className="container circle-grid">
        {items.map((it) => (
          <button key={it.label} className="circle-card" onClick={() => { onChoose('all'); location.hash = '#shop' }}>
            <span className="circle-wrap" style={{ background: `radial-gradient(120px 120px at 50% 40%, ${it.color}, transparent)` }}>
              <span className="big-emoji" aria-hidden>{it.icon}</span>
            </span>
            <span className="circle-title">{it.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function CategoryPills({ selected, onSelect }) {
  const iconByKey = {
    serum: '💧',
    cleanser: '🫧',
    toner: '🌸',
    facewash: '🧼',
    facewashgel: '🧴',
    facemask: '🎭',
    acneoilgel: '✨',
    facialkit: '🧖‍♀️',
    moisturzinglotion: '🧴',
    rosewater: '🌹',
    scalpoil: '🌿',
    scrub: '🧽',
    skinconditioner: '🪄',
    sunscreenlotion: '🌞'
  }
  return (
    <div className="pills" role="tablist" aria-label="Product categories">
      <button className={selected === 'all' ? 'pill active' : 'pill'} onClick={() => onSelect('all')}>All</button>
      {CATEGORIES.map(c => (
        <button key={c.key} className={selected === c.key ? 'pill active' : 'pill'} onClick={() => onSelect(c.key)} id={`cat-${c.key}`}>
          <span style={{ marginRight: 6 }}>{iconByKey[c.key] || '🛍️'}</span>{c.label}
        </button>
      ))}
    </div>
  )
}

import AddToCartButton from './components/AddToCartButton';

function ProductCard({ product, onAdd, onWishlist, isInWishlist, isAuthenticated, onShowAuth, cart, setCart }) {
  // Add touch interaction state
  const [isTouched, setIsTouched] = useState(false);
  
  // Handle touch events
  const handleTouchStart = () => setIsTouched(true);
  const handleTouchEnd = () => setIsTouched(false);
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }
    onWishlist(product);
  };

  return (
    <article 
      className={`card product ${isTouched ? 'touched' : ''}`}
      onClick={() => window.location.href = `/product/${product.id}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}>
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
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image" 
          loading="lazy"
          width="300"
          height="300"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          onError={(e) => {
            e.target.src = '/placeholder-product.png';
            e.target.onerror = null;
          }}
        />
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

function ProductsGrid({ products, onAdd, onWishlist, wishlist, isAuthenticated, onShowAuth, cart, setCart }) {
  return (
    <section id="shop" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Shop by category</h2>
          <p>Find the perfect ritual for your skin</p>
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
              cart={cart}
              setCart={setCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}




function StarDisplay({ value }) {
  return (
    <span className="stars" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  );
}

function ProductReviews({ isAuthenticated, user }) {
  const defaultReviews = [
    {
      name: 'Simran Kaur',
      product: 'Customer Service',
      rating: 5,
      text: 'Leeya Herbals team was so helpful and guided me to the right products for my skin. The support was quick and friendly!',
      image: '/public/profile-icon.png',
    },
    {
      name: 'Rahul Sharma',
      product: 'Order Experience',
      rating: 5,
      text: 'My order arrived on time and beautifully packed. The products are genuine and the whole process was smooth.',
      image: '/public/profile-icon.png',
    },
    {
      name: 'Priya Mehta',
      product: 'Overall Satisfaction',
      rating: 5,
      text: 'I love how Leeya Herbals cares for their customers. They answered all my queries and the products really work!',
      image: '/public/profile-icon.png',
    },
    {
      name: 'Amit Verma',
      product: 'After-Sales Support',
      rating: 4,
      text: 'Had a small issue with my order and it was resolved within a day. Very professional and polite staff.',
      image: '/public/profile-icon.png',
    },
    {
      name: 'Neha Joshi',
      product: 'Repeat Customer',
      rating: 5,
      text: 'I keep coming back to Leeya Herbals because of their honesty and the way they treat customers. Highly recommended!',
      image: '/public/profile-icon.png',
    },
  ];
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('leeya_company_reviews');
    return saved ? JSON.parse(saved) : defaultReviews;
  });

  useEffect(() => {
    localStorage.setItem('leeya_company_reviews', JSON.stringify(reviews));
  }, [reviews]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, text: '', reviewType: 'Customer Service' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([
      {
        name: user?.name || 'You',
        product: form.reviewType,
        rating: form.rating,
        text: form.text,
        image: '/public/profile-icon.png',
      },
      ...reviews,
    ]);
    setShowForm(false);
    setForm({ rating: 5, text: '', reviewType: 'Customer Service' });
  };

  return (
    <section className="section alt">
      <div className="container section-head">
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '.5rem', color: '#1dbf73' }}>Our Company Reviews</h2>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>See what our customers say about their experience with Leeya Herbals.</p>
      </div>
      <div className="container reviews-grid">
        {reviews.map((r, i) => (
          <div className="review-card" key={i}>
            <div className="review-header">
              <img className="avatar" src={r.image} alt={r.name} />
              <div>
                <strong>{r.name}</strong>
                <div className="review-product">{r.product}</div>
                <StarDisplay value={Number(r.rating)} />
              </div>
            </div>
            <div className="review-text">{r.text}</div>
          </div>
        ))}
      </div>
      {isAuthenticated && (
        <div className="add-review-wrap">
          {!showForm ? (
            <button className="btn primary" onClick={() => setShowForm(true)} style={{ marginTop: '2rem' }}>Add Your Company Review</button>
          ) : (
            <form className="review-form" onSubmit={handleSubmit} style={{ marginTop: '2rem', background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 8px 32px #0ea56a12', maxWidth: 420 }}>
              <h3 style={{ marginBottom: '1rem' }}>Add Your Company Review</h3>
              <label>Type of Review
                <select name="reviewType" value={form.reviewType} onChange={handleFormChange} required>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Sales Support">Sales Support</option>
                  <option value="Order Experience">Order Experience</option>
                  <option value="After-Sales Support">After-Sales Support</option>
                  <option value="Overall Satisfaction">Overall Satisfaction</option>
                </select>
              </label>
              <label>Star Rating
                <select name="rating" value={form.rating} onChange={handleFormChange} required>
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                </select>
              </label>
              <label>Your Review
                <textarea name="text" value={form.text} onChange={handleFormChange} required rows={3} placeholder="Share your experience..." />
              </label>
              <button className="btn primary" type="submit">Submit Review</button>
              <button className="btn" type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </form>
          )}
        </div>
      )}
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
  const navigate = useNavigate();
  
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
            <a href="#cat-facemask">Face Masks</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about">About us</a>
            <a href="#care">Ingredients</a>
            <a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>FAQ</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="#shipping">Shipping</a>
            <a href="#returns">Returns</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <p className="copyright"> Leeya Herbals. All rights reserved.</p>
      </div>
    </footer>
  )
}


function WishlistPage({ wishlist, setWishlist, setCart, showCartSuccessMessage }) {
  return (
    <div className="cart-page-container">
      <div className="container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            Continue Shopping
          </button>
          <h1>Your Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</h1>
        </div>
        <div className="wishlist-list">
          {wishlist.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            wishlist.map(item => (
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
                    // Remove item from wishlist when added to cart
                    setWishlist(prev => prev.filter(i => i.id !== item.id));
                    showCartSuccessMessage(item.name);
                  }}>Add to Cart</button>
                  <button className="wishlist-remove" onClick={() => setWishlist(prev => prev.filter(i => i.id !== item.id))}>Remove</button>
                </div>
              </div>
            ))
          )}
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
  const [cartSuccessMessage, setCartSuccessMessage] = useState('');
  const [showCartSuccess, setShowCartSuccess] = useState(false);

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Clear search when navigating to different routes and ensure category is set to 'all'
  useEffect(() => {
    if (location.pathname === '/') {
      setSearch('')
      setCategory('all') // Ensure category is properly initialized
    }
  }, [location.pathname])

  // Admin redirect logic - redirect admin users from homepage to admin dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser && location.pathname === '/') {
      try {
        const userData = JSON.parse(savedUser);
        if (userData.role === 'admin') {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location.pathname, navigate])

  useEffect(() => { document.body.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  
  // Save cart/wishlist to localStorage for the current user
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`leeya_cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(`leeya_wishlist_${user.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  // Check for existing authentication on app load and load user-specific cart/wishlist
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('cart');
      if (updatedCart) {
        setCart(JSON.parse(updatedCart));
      } else {
        setCart([]);
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        // Load cart/wishlist for this user
        if (userData && userData.email) {
          const savedCart = localStorage.getItem(`leeya_cart_${userData.email}`);
          setCart(savedCart ? JSON.parse(savedCart) : []);
          const savedWishlist = localStorage.getItem(`leeya_wishlist_${userData.email}`);
          setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    setShowAuth(false)
    // Load cart/wishlist for this user
    if (userData && userData.email) {
      const savedCart = localStorage.getItem(`leeya_cart_${userData.email}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
      const savedWishlist = localStorage.getItem(`leeya_wishlist_${userData.email}`);
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
    // Redirect admin users directly to admin dashboard
    if (userData.role === 'admin') {
      navigate('/admin');
    }
  }

  const handleLogout = () => {
    const currentUser = user;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null)
    setIsAuthenticated(false)
    setShowAuth(false)
    setCart([])
    setWishlist([])
    // Redirect admin users to homepage after logout
    if (currentUser?.role === 'admin') {
      navigate('/');
    }
  }

  const showCartSuccessMessage = (productName) => {
    setCartSuccessMessage(`${productName} added to cart!`);
    setShowCartSuccess(true);
    
    // Hide message after 4 seconds
    setTimeout(() => {
      setShowCartSuccess(false);
      setCartSuccessMessage('');
    }, 4000);
  }

  useEffect(() => {
    // Always re-apply reveal animation on navigation
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => el.classList.remove('visible'));
    let revealed = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
          revealed = true;
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    // Fallback: if nothing is revealed after 500ms, force all .reveal visible
    const timer = setTimeout(() => {
      if (!document.querySelector('.reveal.visible')) {
        els.forEach(el => el.classList.add('visible'));
      }
    }, 500);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [location.pathname]);

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
    
    // If category is 'all', show all products except facewashgel (with search filter if applicable)
    if (category === 'all') {
      const productsToShow = ALL_PRODUCTS.filter(p => p.category !== 'facewashgel');
      if (!q) return productsToShow; // No search, show all products
      return productsToShow.filter(p => {
        const name = p.name.toLowerCase();
        const nameCompact = name.replace(/\s+/g, '');
        const cat = p.category.toLowerCase();
        return name.includes(q) || nameCompact.includes(qCompact) || cat.includes(q);
      });
    }
    
    // For specific categories, show all products of that category (including facewashgel if selected)
    return ALL_PRODUCTS.filter(p => {
      const name = p.name.toLowerCase();
      const nameCompact = name.replace(/\s+/g, '');
      const cat = p.category.toLowerCase();
      const matchesQuery = !q || name.includes(q) || nameCompact.includes(qCompact) || cat.includes(q);
      const matchesCategory = p.category === category;
      return matchesCategory && matchesQuery;
    });
  }, [category, search]);

  // Featured: show one product of each category (exclude face wash gels)
  const featuredByCategory = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const p of ALL_PRODUCTS) {
      if (!seen.has(p.category) && p.category !== 'facewashgel') {
        seen.add(p.category);
        result.push(p);
      }
    }
    return result;
  }, []);


  return (
    <>
      {location.pathname !== '/admin' && (
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
          showMenu={showMenu}
        />
      )}
      
      {/* Cart Success Message */}
      {showCartSuccess && (
        <div className="cart-success-message">
          <div className="cart-success-content">
            <span className="cart-success-icon">✅</span>
            <span className="cart-success-text">{cartSuccessMessage}</span>
          </div>
        </div>
      )}
      
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
            <div className="reveal"><CircleCategories onChoose={setCategory} /></div>
            <section className="section benefits">
              <div className="container benefits-inner">
                <div className="benefit"><span>🌿</span><div><strong>100% Herbal</strong><p>Toxin-free, plant-powered formulas</p></div></div>
                <div className="benefit"><span>🚚</span><div><strong>Free Shipping</strong><p>On orders above ₹799</p></div></div>
                <div className="benefit"><span>🛡️</span><div><strong>Dermat Tested</strong><p>Safe for all skin types</p></div></div>
                <div className="benefit"><span>📦</span><div><strong>Return Damaged Product</strong><p>Quick replacement for damaged deliveries</p></div></div>
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
                  showCartSuccessMessage(p.name);
                }}
                onWishlist={(p) => {
                  setWishlist(prev => {
                    const found = prev.find(i => i.id === p.id);
                    if (found) {
                      // Remove from wishlist if already present
                      return prev.filter(i => i.id !== p.id);
                    }
                    // Add to wishlist if not present
                    return [...prev, p];
                  });
                }}
                wishlist={wishlist}
                isAuthenticated={isAuthenticated}
                onShowAuth={() => setShowAuth(true)}
                cart={cart}
                setCart={setCart}
              />
            </section>
            <section className="section reveal">
              <div className="container section-head"><h2>Featured</h2><p>Best sellers loved by our community</p></div>
              <div className="container carousel" id="featured">
                <div className="carousel-track">
                  {featuredByCategory.map(p => (
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
                          showCartSuccessMessage(p.name)
                        }}
                        onWishlist={(p) => {
                          setWishlist(prev => {
                            const found = prev.find(i => i.id === p.id);
                            if (found) {
                              // Remove from wishlist if already present
                              return prev.filter(i => i.id !== p.id);
                            }
                            // Add to wishlist if not present
                            return [...prev, p];
                          });
                        }}
                        isInWishlist={wishlist.some(item => item.id === p.id)}
                        isAuthenticated={isAuthenticated}
                        onShowAuth={() => setShowAuth(true)}
                        cart={cart}
                        setCart={setCart}
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
            <section className="reveal"><ProductReviews isAuthenticated={isAuthenticated} user={user} /></section>
            <section id="about" className="section reveal">
              <SkincareFlipCards />
              <div className="container section-head"><h2>About Leeya Herbals</h2><p>Our promise: gentle, effective, and honest skincare</p></div>
              <div className="container">
                <p>We craft nature-first skincare using clinically-backed herbal actives. Every formula is cruelty-free, free from parabens, sulfates, and mineral oils, and made in small batches for freshness. Our mission is to simplify routines with high-performance essentials that let your skin breathe and glow.</p>
              </div>
            </section>
            <Newsletter />
            <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
          </>
        } />
        <Route path="/search" element={<SearchResultsPage cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} showCartSuccessMessage={showCartSuccessMessage} />} />
        <Route path="/product/:productId" element={<ProductPage cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} showCartSuccessMessage={showCartSuccessMessage} />} />
        <Route path="/chat" element={isAuthenticated ? <Chatbot /> : <AuthRedirect />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/bath-body" element={<BathBodyPage products={ALL_PRODUCTS} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} />} />
        <Route path="/categories/skin-care" element={<SkinCarePage products={ALL_PRODUCTS} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} />} />
        <Route path="/categories/face-wash-gel" element={<FaceWashGelPage products={ALL_PRODUCTS} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} />} />
        <Route path="/collections" element={<CollectionsPage products={ALL_PRODUCTS} cart={cart} setCart={setCart} wishlist={wishlist} setWishlist={setWishlist} isAuthenticated={isAuthenticated} onOpenAuth={() => setShowAuth(true)} showCartSuccessMessage={showCartSuccessMessage} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact/visitus" element={<VisitUsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/myorders" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/admin" element={<AdminDashboard user={user} onLogout={handleLogout} />} />
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
                        // Remove item from wishlist when added to cart
                        setWishlist(prev => prev.filter(i => i.id !== item.id));
                        showCartSuccessMessage(item.name);
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
      {location.pathname !== '/admin' && location.pathname !== '/faq' && location.pathname !== '/contact' && location.pathname !== '/contact/visitus' && <Footer />}
    </>
  )
}

export default App
