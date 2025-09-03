import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import ProductPage from './ProductPage'
import SearchResultsPage from './SearchResultsPage'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'
import Chatbot from './Chatbot'
function AuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    alert('Please login or signup to use AI chatbot.');
    navigate('/');
  }, []);
  return null;
}


const CATEGORIES = [
  { key: 'serum', label: 'Serums' },
  { key: 'cleanser', label: 'Cleansers' },
  { key: 'toner', label: 'Toners' },
  { key: 'facewash', label: 'Face Wash' },
  { key: 'facemask', label: 'Face Masks' },
  { key: 'acne', label: 'Acne Gel' },
  { key: 'lotion', label: 'Lotions' },
]

const ALL_PRODUCTS = [
  {
    id: 33,
    name: 'Pimple & Pore Minimizing Face Wash Gel',
    price: 325,
    category: 'facewashgel',
    weight: '100ml',
    image: '/items/facewashgel/pimple & pore.png',
    rating: 5,
    description: 'Minimizes pimples and pores. For all skin types.'
  },
  {
    id: 34,
    name: 'Pigment Lightening Face Wash Gel',
    price: 299,
    category: 'facewashgel',
    weight: '100ml',
    image: '/items/facewashgel/pigment lightening.png',
    rating: 4,
    description: 'Lightens pigmentation. For all skin types.'
  },
  {
    id: 35,
    name: 'Pollution & Blackheads Removing Face Wash Gel',
    price: 299,
    category: 'facewashgel',
    weight: '100ml',
    image: '/items/facewashgel/pollution & blackheads.png',
    rating: 4,
    description: 'Removes pollution and blackheads. For all skin types.'
  },
  {
    id: 36,
    name: 'Vitamin C & Orange Skin Whitening Face Wash Gel',
    price: 299,
    category: 'facewashgel',
    weight: '100ml',
    image: '/items/facewashgel/vitamin c & orange.png',
    rating: 4,
    description: 'Vitamin C & orange for skin whitening. For all skin types.'
  },
  {
    id: 27,
    name: 'Sandal Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/sandal facewash.png',
    rating: 4,
    description: 'For brightening & glowing skin. For all skin types.'
  },
  {
    id: 28,
    name: 'De-Tan Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/De-tan facewash.png',
    rating: 4,
    description: 'For tan removal & glowing skin. For all skin types.'
  },
  {
    id: 29,
    name: 'Papaya Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/papaya.png',
    rating: 3,
    description: 'Enriched with papaya & liquorice extracts. For all skin types.'
  },
  {
    id: 30,
    name: 'Haldi Chandan Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/haldi chandan.png',
    rating: 4,
    description: 'Haldi chandan for glowing skin. For all skin types.'
  },
  {
    id: 31,
    name: 'Tea Tree Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/tea tree.png',
    rating: 5,
    description: 'Tea tree for clear skin. For all skin types.'
  },
  {
    id: 32,
    name: 'Coffee Hydrating Face Wash',
    price: 190,
    category: 'facewash',
    weight: '100ml',
    image: '/items/facewash/coffee.png',
    rating: 4,
    description: 'Hydrating coffee face wash. For all skin types.'
  },
  {
    id: 24,
    name: 'Instant Tan Remover Face Mask (Jasmine)',
    price: 899,
    category: 'facemask',
    weight: '600gm',
    image: '/items/facemask/tan removal jasmine.jpeg',
    rating: 5,
    description: 'Jasmine fragrance. For instant de-tanning. Paraben free.'
  },
  {
    id: 25,
    name: 'Instant Tan Remover Face Mask (Lavender)',
    price: 899,
    category: 'facemask',
    weight: '600gm',
    image: '/items/facemask/tan removal lavender.jpeg',
    rating: 4,
    description: 'Lavender fragrance. For instant de-tanning. Paraben free.'
  },
  {
    id: 26,
    name: 'Instant Tan Remover Face Mask',
    price: 225,
    category: 'facemask',
    weight: '80gm',
    image: '/items/facemask/instant tan removal facemask.png',
    rating: 4,
    description: 'For instant de-tanning. Paraben free. 80gm pack.'
  },
  {
    id: 23,
    name: 'Under Eye Gel',
    price: 125,
    category: 'eyegel',
    weight: '20gm',
    image: '/items/eyegel/under eye gel.png',
    rating: 4,
    description: 'For treatment of dark circles. Suitable for all skin types.'
  },
  // Bleach Creams (small box, 300gm, 349)
  {
    id: 10,
    name: 'Vitamin-C Bleach Cream',
    price: 349,
    category: 'bleachcream',
    weight: '300gm',
    image: '/items/bleech cream/vitamin c bleach cream.png',
    rating: 4,
    description: 'Vitamin-C enriched bleach cream for radiant skin.'
  },
  {
    id: 11,
    name: 'D-Tan Bleach Cream',
    price: 349,
    category: 'bleachcream',
    weight: '300gm',
    image: '/items/bleech cream/D tan bleach cream.png',
    rating: 4,
    description: 'Removes tan and brightens skin.'
  },
  {
    id: 12,
    name: 'Haldi Chandan Bleach Cream',
    price: 349,
    category: 'bleachcream',
    weight: '300gm',
    image: '/items/bleech cream/haldi chandan bleach cream.png',
    rating: 4,
    description: 'Haldi and chandan for glowing skin.'
  },
  {
    id: 13,
    name: 'Mango Bleach Cream',
    price: 349,
    category: 'bleachcream',
    weight: '300gm',
    image: '/items/bleech cream/mango bleach cream.png',
    rating: 3,
    description: 'Mango extract for soft, bright skin.'
  },
  // Bleach Creams (jars, 1kg, 849)
  {
    id: 14,
    name: 'Charcoal Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/charcoal bleach cream.png',
    rating: 4,
    description: 'Charcoal for deep cleansing and detox.'
  },
  {
    id: 15,
    name: 'OXY Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/oxy bleach cream.png',
    rating: 4,
    description: 'Oxygen boost for brighter skin.'
  },
  {
    id: 16,
    name: 'Diamond Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/diamond bleach cream.png',
    rating: 5,
    description: 'Diamond dust for glowing skin.'
  },
  {
    id: 17,
    name: 'Red Wine Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/red wine bleach cream.png',
    rating: 4,
    description: 'Red wine extract for anti-aging.'
  },
  {
    id: 18,
    name: 'Skin Whitening Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/skin whitening bleach cream.png',
    rating: 3,
    description: 'Whitening formula for even skin tone.'
  },
  {
    id: 19,
    name: 'Vitamin-C Bleach Cream (1kg)',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/vitamin c bleach.png',
    rating: 4,
    description: 'Vitamin-C enriched bleach cream for radiant skin (1kg jar).'
  },
  {
    id: 20,
    name: 'Gold Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/gold bleach cream.png',
    rating: 5,
    description: 'Gold particles for glowing skin.'
  },
  {
    id: 21,
    name: 'Haldi & Chandan Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/haldi & chandan bleach cream.png',
    rating: 4,
    description: 'Haldi and chandan for glowing skin (1kg jar).'
  },
  {
    id: 22,
    name: 'De-Tan Bleach Cream',
    price: 849,
    category: 'bleachcream',
    weight: '1kg',
    image: '/items/bleech cream/De-tan bleach.png',
    rating: 4,
    description: 'Removes tan and brightens skin (1kg jar).'
  },
  {
    id: 5,
    name: 'Anti Blemish Cream',
    price: 299,
    category: 'cream',
    weight: '30gm',
    image: '/items/cream/anti blemish cream.png',
    rating: 4,
    description: 'Reduces blemishes and evens skin tone. With Vitamin C, Vitamin B3, and herbal extracts.'
  },
  {
    id: 6,
    name: 'Wrinkle Lift Anti Ageing Cream',
    price: 425,
    category: 'cream',
    weight: '30gm',
    image: '/items/cream/wrinkle lift anti ageing.png',
    rating: 5,
    description: 'Reduces wrinkles and firms skin. With Vitamin C, Ginseng, and herbal actives.'
  },
  {
    id: 7,
    name: 'Shea Butter Nourishing Cream',
    price: 175,
    category: 'cream',
    weight: '30gm',
    image: '/items/cream/shea butter nourishing cream.png',
    rating: 4,
    description: 'Deeply nourishes and hydrates skin. Enriched with shea butter and almond oil.'
  },
  {
    id: 8,
    name: 'Skin Whitening Cream',
    price: 225,
    category: 'cream',
    weight: '30gm',
    image: '/items/cream/skin whiteing.png',
    rating: 3,
    description: 'Brightens and evens skin tone. With Vitamin E and herbal actives.'
  },
  {
    id: 9,
    name: 'Dark Spot & Marks Removing Cream',
    price: 269,
    category: 'cream',
    weight: '75gm',
    image: '/items/cream/dark spot & marks removing.png',
    rating: 4,
    description: 'Removes dark spots and marks. With SPF 20, mushrooms, mulethi, and tulsi.'
  },
  {
    id: 1,
    name: 'Clove & Basil Acne & Oil Control Gel',
    price: 299,
    category: 'acneoilgel',
    weight: '100ml',
    image: '/items/acneoilgel/acneoilcontrolgel.png',
    rating: 5,
    description: 'Clove & Basil Acne & Oil Control Gel helps control excess oil and acne. Paraben free. Suitable for all skin types.'
  },
  {
    id: 2,
    name: 'Fairness Cleanser',
    price: 245,
    category: 'cleanser',
    weight: '100gm',
    image: '/items/cleanser/fairness cleanser.png',
    rating: 4,
    description: 'Handmade Ayurvedic Fairness Cleanser Soap with herbs. Paraben free.'
  },
  {
    id: 3,
    name: 'Glow Cleanser',
    price: 245,
    category: 'cleanser',
    weight: '100gm',
    image: '/items/cleanser/glow cleanser.png',
    rating: 3,
    description: 'Handmade Ayurvedic Glow Cleanser Soap with herbs. Paraben free.'
  },
  {
    id: 4,
    name: 'Cleaning Milk',
    price: 325,
    category: 'cleansingmilk',
    weight: '1 Litre',
    image: '/items/cleansing milk/cleaning milk.png',
    rating: 4,
    description: 'Leeya Cleaning Milk for gentle and effective cleansing. Suitable for all skin types.'
  },
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
      
      {/* Top navbar with branding, search, and user actions */}
      <div className="nav-top">
        <div className="container nav-top-inner">
          <div className="brand-section">
            <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <span className="leaf">✿</span>
              <span>Leeya Herbals</span>
            </div>
          </div>
          
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
          
          <div className="user-actions">
            <button 
              className="chat-btn" 
              aria-label="Chatbot"
              title="Ask Leeya Guide"
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
            
            {isAuthenticated ? (
              <UserProfile user={user} onLogout={onLogout} />
            ) : (
              <button className="login-btn" aria-label="Login" onClick={onOpenAuth}>👤</button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navbar with main navigation */}
      <div className="nav-bottom">
        <div className="container nav-bottom-inner">
          <button className="hamburger" aria-label="Menu" onClick={onToggleMenu}>☰</button>
          
          <nav className="nav-links-main">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
            
            <div className="nav-dropdown">
              <a href="#categories" onClick={(e) => { e.preventDefault(); navigate('/#categories') }}>
                Categories <span className="dropdown-arrow">▼</span>
              </a>
              <div className="dropdown-content">
                <a href="#cat-serum">Serums</a>
                <a href="#cat-cleanser">Cleansers</a>
                <a href="#cat-toner">Toners</a>
                <a href="#cat-facepack">Face Packs</a>
                <a href="#cat-acne">Acne Care</a>
                <a href="#cat-lotion">Lotions</a>
              </div>
            </div>
            
            <div className="nav-dropdown">
              <a href="#bath-body">
                Bath & Body <span className="dropdown-arrow">▼</span>
              </a>
              <div className="dropdown-content">
                <a href="#body-wash">Body Wash</a>
                <a href="#body-lotion">Body Lotion</a>
                <a href="#bath-salts">Bath Salts</a>
                <a href="#scrubs">Body Scrubs</a>
              </div>
            </div>
            
            <div className="nav-dropdown">
              <a href="#skincare">
                Skin Care <span className="dropdown-arrow">▼</span>
              </a>
              <div className="dropdown-content">
                <a href="#anti-aging">Anti-Aging</a>
                <a href="#moisturizers">Moisturizers</a>
                <a href="#sun-protection">Sun Protection</a>
                <a href="#treatments">Treatments</a>
              </div>
            </div>
            
            <div className="nav-dropdown">
              <a href="#collections">
                Collections <span className="dropdown-arrow">▼</span>
              </a>
              <div className="dropdown-content">
                <a href="#face-kits">Face Care Kits</a>
                <a href="#gift-sets">Gift Sets</a>
                <a href="#travel-kits">Travel Kits</a>
                <a href="#seasonal">Seasonal Collections</a>
              </div>
            </div>
            
            <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/#about') }}>About Us</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/#contact') }}>Contact</a>
          </nav>
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

function WishlistPage({ wishlist, setWishlist, setCart }) {
  return (
    <div className="cart-page-container">
      <div className="container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            ← Continue Shopping
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
                    alert(`${item.name} added to cart!`);
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
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setShowAuth(false)
    setCart([])
    setWishlist([])
  }

  useEffect(() => {
    // Always re-apply reveal animation on navigation
    const els = document.querySelectorAll('.reveal');
    els.forEach(el => el.classList.remove('visible'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
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
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} />} />
        <Route path="/chat" element={isAuthenticated ? <Chatbot /> : <AuthRedirect />} />
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
