import { useMemo, useState, useEffect, useRef } from 'react'
import './App.css'
import './ContactUs.css'
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
  { key: 'facewashgel', label: 'Face Wash Gel' },
  { key: 'facemask', label: 'Face Masks' },
  { key: 'acneoilgel', label: 'Acne Oil Gel' },
  { key: 'facialkit', label: 'Facial Kits' },
  { key: 'moisturzinglotion', label: 'Moisturizing Lotion' },
  { key: 'rosewater', label: 'Rose Water' },
  { key: 'scalpoil', label: 'Scalp Oil' },
  { key: 'scrub', label: 'Scrubs' },
  { key: 'skinconditioner', label: 'Skin Conditioner' },
  { key: 'sunscreenlotion', label: 'Sunscreen Lotions' }
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
  // Facial Kits
  { id: 60, name: 'Diamond SPA Facial Kit', price: 1699, category: 'facialkit', weight: '510gm', image: '/items/facial kit/diamond spa.png', rating: 5, description: 'Complete Diamond SPA facial kit for radiant glow.' },
  { id: 61, name: '24 Carat Gold SPA Facial Kit', price: 1699, category: 'facialkit', weight: '510gm', image: '/items/facial kit/24 carat gold.png', rating: 5, description: 'Gold-infused SPA facial kit for luxurious glow.' },
  { id: 62, name: 'Papaya Facial Kit', price: 1699, category: 'facialkit', weight: '510gm', image: '/items/facial kit/papaya.png', rating: 4, description: 'Papaya based facial kit for clear and bright skin.' },
  { id: 63, name: 'Vitamin C Facial Kit', price: 1499, category: 'facialkit', weight: '510gm', image: '/items/facial kit/vitamin C.png', rating: 4, description: 'Vitamin C rich facial kit for glow and brightness.' },
  { id: 64, name: 'Fairness Treatment Facial Kit', price: 2999, category: 'facialkit', weight: '810gm', image: '/items/facial kit/Fairness treatment.png', rating: 4, description: '9-step fairness facial kit for salon-like results.' },
  { id: 65, name: 'Oil Free Anti Acne Problematic Skin Facial Kit', price: 1899, category: 'facialkit', weight: '510gm', image: '/items/facial kit/anti acne.png', rating: 4, description: 'Oil-free anti-acne facial kit for problematic skin.' },
  { id: 66, name: 'Green Tea Facial Kit', price: 1499, category: 'facialkit', weight: '510gm', image: '/items/facial kit/green tea.png', rating: 4, description: 'Refreshing green tea facial kit for balanced skin.' },
  { id: 67, name: 'Red Wine Facial Kit', price: 1499, category: 'facialkit', weight: '510gm', image: '/items/facial kit/red wine.png', rating: 4, description: 'Red wine extract facial kit for youthful glow.' },
  { id: 68, name: 'Bridal Glow Facial Kit', price: 1699, category: 'facialkit', weight: '510gm', image: '/items/facial kit/bridal glow.png', rating: 5, description: 'Bridal glow facial kit for special occasions.' },
  { id: 69, name: 'Platinum Superb Glow Facial Kit', price: 1499, category: 'facialkit', weight: '510gm', image: '/items/facial kit/platinum glow.png', rating: 4, description: 'Platinum superb glow kit for instant radiance.' },
  { id: 70, name: 'Pearl Glow SPA Facial Kit', price: 1499, category: 'facialkit', weight: '510gm', image: '/items/facial kit/pearl glow.png', rating: 4, description: 'Pearl glow spa facial kit for luminous skin.' },
  { id: 71, name: 'Aha Fruit Punch SPA Facial Kit', price: 999, category: 'facialkit', weight: '500gm', image: '/items/facial kit/aha fruit punch.png', rating: 4, description: 'Fruit punch AHA facial kit for smooth, glowing skin.' },
  // Moisturizing Lotion
  { id: 80, name: 'Green Tea & Acerola Cherry Deep Moisturizing Lotion', price: 299, category: 'moisturzinglotion', weight: '300ml', image: '/items/moisturzinglotion/green tea and acerola cherry.png', rating: 4, description: 'Deep moisturizing lotion for face & body.' },
  // Rose Water (two sizes)
  { id: 81, name: 'Rose Water (100ml)', price: 75, category: 'rosewater', weight: '100ml', image: '/items/rosewater/rose water.png', rating: 4, description: 'Pure rose water toner for refreshed skin.' },
  { id: 82, name: 'Rose Water (500ml)', price: 149, category: 'rosewater', weight: '500ml', image: '/items/rosewater/rose water.png', rating: 4, description: 'Pure rose water toner family pack.' },
  // Scalp Oil
  { id: 83, name: 'Ayurvedic Scalp & Roots Therapy Oil', price: 699, category: 'scalpoil', weight: '100ml', image: '/items/scalpoil/scalp & roots oil.png', rating: 5, description: 'Therapy oil for scalp massage with Ayurvedic actives.' },
  // Scrubs
  { id: 90, name: 'De-Tan Face Scrub', price: 175, category: 'scrub', weight: '100ml', image: '/items/scrub/De tan face scrub.png', rating: 4, description: 'De-tans and gently exfoliates for smoother skin.' },
  { id: 91, name: 'Apricot Face Scrub', price: 175, category: 'scrub', weight: '100ml', image: '/items/scrub/apricot.png', rating: 4, description: 'Apricot-based gentle exfoliating face scrub.' },
  { id: 92, name: 'Instant Tan Remover Soft Scrub (250gm)', price: 659, category: 'scrub', weight: '250gm', image: '/items/scrub/tan removal soft scrub.png', rating: 4, description: 'Soft scrub that removes tan; 250gm pouch.' },
  { id: 93, name: 'Instant Tan Remover Soft Scrub (600gm)', price: 1299, category: 'scrub', weight: '600gm', image: '/items/scrub/tan removal soft scrub.png', rating: 4, description: 'Soft scrub that removes tan; 600gm jar.' },
  // Serums
  { id: 94, name: 'Vitamin-C Face Serum', price: 299, category: 'serum', weight: '30ml', image: '/items/serum/vitaminC face.png', rating: 5, description: 'Brightening Vitamin-C face serum.' },
  { id: 95, name: '12% Niacinamide Face Serum', price: 299, category: 'serum', weight: '30ml', image: '/items/serum/niacinamide.png', rating: 5, description: 'Niacinamide 12% serum for spots and texture.' },
  { id: 96, name: '2% Salicylic Acid Face Serum', price: 299, category: 'serum', weight: '30ml', image: '/items/serum/salicylic acid.png', rating: 5, description: '2% salicylic acid serum for acne-prone skin.' },
  // Skin Conditioner
  { id: 100, name: 'Pre Treatment Skin Conditioner', price: 445, category: 'skinconditioner', weight: '200ml', image: '/items/skin conditioner/pre treatment.png', rating: 4, description: 'Pre-treatment skin conditioner to prep and calm skin.' },
  { id: 101, name: 'Post Treatment Skin Soother', price: 545, category: 'skinconditioner', weight: '200ml', image: '/items/skin conditioner/post treatment.png', rating: 4, description: 'Post-treatment skin soother for recovery.' },
  // Toners (100ml at 99, except Derma 225) + 1L Rose Toner 325
  { id: 102, name: 'Rose Face Toner', price: 99, category: 'toner', weight: '100ml', image: '/items/toner/rose face.png', rating: 4, description: 'Refreshing rose toner.' },
  { id: 103, name: 'Cucumber Face Toner', price: 99, category: 'toner', weight: '100ml', image: '/items/toner/cucumber.png', rating: 4, description: 'Cooling cucumber toner.' },
  { id: 104, name: 'Vitamin C Face Toner', price: 99, category: 'toner', weight: '100ml', image: '/items/toner/vitaminC.png', rating: 4, description: 'Brightening vitamin C toner.' },
  { id: 105, name: 'Derma Refreshing Toner', price: 225, category: 'toner', weight: '100ml', image: '/items/toner/derma refreshing.png', rating: 4, description: 'Derma refreshing toner for clean skin.' },
  { id: 106, name: 'Rose Toner (1 Litre)', price: 325, category: 'toner', weight: '1 Litre', image: '/items/toner/rose.png', rating: 4, description: 'Salon pack rose toner 1L.' },
  // Sunscreen Lotions
  { id: 110, name: 'Sun Screen Lotion SPF-50 PA++', price: 299, category: 'sunscreenlotion', weight: '100ml', image: '/items/sunscreenlotion/spf50++.png', rating: 4, description: 'SPF-50 PA++ sunscreen lotion.' },
  { id: 111, name: 'Sun Screen Lotion SPF-70 PA++', price: 325, category: 'sunscreenlotion', weight: '100ml', image: '/items/sunscreenlotion/spf70++.png', rating: 4, description: 'Higher protection SPF-70 PA++ lotion.' },
  { id: 112, name: 'Sun Block Lotion SPF-30 Matte Finish', price: 475, category: 'sunscreenlotion', weight: '100ml', image: '/items/sunscreenlotion/sun block spf30.png', rating: 4, description: 'Matte finish SPF-30 sun block.' },
  { id: 113, name: 'Sun Shield SPF Lotion (SPF 30)', price: 315, category: 'sunscreenlotion', weight: '100ml', image: '/items/sunscreenlotion/sun shield spf30.png', rating: 4, description: 'Sun shield SPF 30 lotion.' },
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
            <div className="brand" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/')} style={{ cursor: 'pointer' }}>
              <span className="leaf">✿</span>
              <span>Leeya Herbals</span>
            </div>
          </div>
          
          {user?.role !== 'admin' && (
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
          )}
          
          <div className="user-actions">
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
          <button className="hamburger" aria-label="Menu" onClick={onToggleMenu}>☰</button>
          
          <nav className="nav-links-main">
            {user?.role === 'admin' ? (
              // Admin-only navigation
              <a href="#admin" onClick={(e) => { e.preventDefault(); navigate('/admin') }} style={{ color: '#e74c3c', fontWeight: 'bold', margin: '0 auto' }}>
                🛡️ Admin Panel
              </a>
            ) : (
              // Regular user navigation
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('/') }}>Home</a>
                <a href="#profile" onClick={(e) => { e.preventDefault(); navigate('/profile') }}>Profile</a>
                <div className="nav-dropdown">
                  <a href="#categories" onClick={(e) => { e.preventDefault(); navigate('/#categories') }}>
                    Categories <span className="dropdown-arrow">▼</span>
                  </a>
                  <div className="dropdown-content">
                    <a href="#cat-serum">Serums</a>
                    <a href="#cat-cleanser">Cleansers</a>
                    <a href="#cat-toner">Toners</a>
                    <a href="#cat-facepack">Face Packs</a>
                    <a href="#cat-facewashgel">Face Wash Gel</a>
                    <a href="#cat-acneoilgel">Acne Oil Gel</a>
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
                    <a href="#reviews" onClick={(e)=>{ e.preventDefault(); navigate('/reviews') }}>Reviews</a>
                  </div>
                </div>
                <a href="#about" onClick={(e) => { e.preventDefault(); navigate('/#about') }}>About Us</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); navigate('/#contact') }}>Contact</a>
              </>
            )}
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
    // If category is 'all' and no search, show all products
    if (category === 'all' && !q) return ALL_PRODUCTS;
    return ALL_PRODUCTS.filter(p => {
      const name = p.name.toLowerCase();
      const nameCompact = name.replace(/\s+/g, '');
      const cat = p.category.toLowerCase();
      const matchesQuery = !q || name.includes(q) || nameCompact.includes(qCompact) || cat.includes(q);
      const matchesCategory = category === 'all' ? true : p.category === category;
      return matchesCategory && matchesQuery;
    });
  }, [category, search]);

  // Featured: show one product of each category
  const featuredByCategory = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const p of ALL_PRODUCTS) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        result.push(p);
      }
    }
    return result;
  }, []);


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
            <section className="reveal"><ProductReviews isAuthenticated={isAuthenticated} user={user} /></section>
            <section id="about" className="section reveal">
              <SkincareFlipCards />
              <div className="container section-head"><h2>About Leeya Herbals</h2><p>Our promise: gentle, effective, and honest skincare</p></div>
              <div className="container">
                <p>We craft nature-first skincare using clinically-backed herbal actives. Every formula is cruelty-free, free from parabens, sulfates, and mineral oils, and made in small batches for freshness. Our mission is to simplify routines with high-performance essentials that let your skin breathe and glow.</p>
              </div>
            </section>
            <section id="contact" className="section reveal">
              <div className="container section-head"><h2>Contact Us</h2><p>We'd love to hear from you and help with your skincare journey</p></div>
              <div className="container contact-content">
                <div className="contact-grid">
                  <div className="contact-info">
                    <div className="contact-card">
                      <div className="contact-icon">📧</div>
                      <h3>Email Us</h3>
                      <p>care@leeyaherbals.com</p>
                      <p>support@leeyaherbals.com</p>
                      <small>We respond within 24 hours</small>
                    </div>
                    
                    <div className="contact-card">
                      <div className="contact-icon">📞</div>
                      <h3>Call Us</h3>
                      <p>+91-98765 43210</p>
                      <p>+91-87654 32109</p>
                      <small>Mon-Sat: 9 AM - 7 PM IST</small>
                    </div>
                    
                    <div className="contact-card">
                      <div className="contact-icon">📍</div>
                      <h3>Visit Us</h3>
                      <p>Leeya Herbals Pvt. Ltd.</p>
                      <p>123 Herbal Street, Green Valley</p>
                      <p>Mumbai, Maharashtra 400001</p>
                      <small>India</small>
                    </div>
                    
                    <div className="contact-card">
                      <div className="contact-icon">🕒</div>
                      <h3>Business Hours</h3>
                      <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                      <p>Saturday: 10:00 AM - 5:00 PM</p>
                      <p>Sunday: Closed</p>
                      <small>All times in IST</small>
                    </div>
                    
                    <div className="contact-card social-card">
                      <div className="contact-icon">🌐</div>
                      <h3>Follow Us</h3>
                      <div className="social-links">
                        <a href="#" className="social-link">📘 Facebook</a>
                        <a href="#" className="social-link">📷 Instagram</a>
                        <a href="#" className="social-link">🐦 Twitter</a>
                        <a href="#" className="social-link">💼 LinkedIn</a>
                      </div>
                    </div>
                    
                    <div className="contact-card">
                      <div className="contact-icon">💬</div>
                      <h3>WhatsApp</h3>
                      <p>+91-98765 43210</p>
                      <small>Quick support & order updates</small>
                    </div>
                  </div>
                  
                  <div className="contact-form-section">
                    <div className="form-container">
                      <h3>Send us a Message</h3>
                      <form className="contact-form" onSubmit={(e)=>e.preventDefault()}>
                        <div className="form-row">
                          <input type="text" placeholder="Your Name *" required />
                          <input type="email" placeholder="Your Email *" required />
                        </div>
                        <input type="tel" placeholder="Phone Number" />
                        <select>
                          <option value="">Select Subject</option>
                          <option value="product">Product Inquiry</option>
                          <option value="order">Order Support</option>
                          <option value="skincare">Skincare Consultation</option>
                          <option value="wholesale">Wholesale/Business</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                        <textarea placeholder="Your Message *" rows="5" required></textarea>
                        <button className="btn primary" type="submit">Send Message</button>
                      </form>
                    </div>
                    
                    <div className="contact-features">
                      <div className="feature-item">
                        <span className="feature-icon">🚚</span>
                        <div>
                          <h4>Free Shipping</h4>
                          <p>On orders above ₹799</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">🔄</span>
                        <div>
                          <h4>Easy Returns</h4>
                          <p>30-day return policy</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">🛡️</span>
                        <div>
                          <h4>Secure Payment</h4>
                          <p>100% secure transactions</p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <span className="feature-icon">👩‍⚕️</span>
                        <div>
                          <h4>Expert Support</h4>
                          <p>Skincare consultation available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <Newsletter />
            <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button>
          </>
        } />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
        <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} setWishlist={setWishlist} setCart={setCart} />} />
        <Route path="/chat" element={isAuthenticated ? <Chatbot /> : <AuthRedirect />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<UserProfile user={user} onLogout={handleLogout} />} />
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
