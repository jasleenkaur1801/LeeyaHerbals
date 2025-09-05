import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './App.css'
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

function ProductCard({ product, onAdd, onWishlist, isInWishlist }) {
  const navigate = useNavigate()

  return (
    <article className="card product" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
      <div className="badge-row">
        {product.tag ? <span className="badge">{product.tag}</span> : null}
      </div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <button 
          className={`wishlist ${isInWishlist ? 'active' : ''}`} 
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation()
            onWishlist(product)
          }}
        >
          {isInWishlist ? '❤️' : '♡'}
        </button>
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

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [selectedCategories, setSelectedCategories] = useState([])

  const searchQuery = searchParams.get('q') || ''

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('leeya_cart')
    const savedWishlist = localStorage.getItem('leeya_wishlist')
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('leeya_cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('leeya_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  // Filter and sort products
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase().trim()
    const name = product.name.toLowerCase()
    const category = product.category.toLowerCase()
    const description = product.description.toLowerCase()
    
    // Handle plural/singular matching
    const querySingular = query.replace(/s$/, '') // Remove 's' from end
    const queryPlural = query + 's' // Add 's' to end
    const categorySingular = category.replace(/s$/, '')
    const categoryPlural = category + 's'
    
    // Check if query matches any part of the product
    const nameMatch = name.includes(query) || name.includes(querySingular) || name.includes(queryPlural)
    const categoryMatch = category.includes(query) || category.includes(querySingular) || category.includes(queryPlural) ||
                         query.includes(category) || query.includes(categorySingular) || query.includes(categoryPlural)
    const descriptionMatch = description.includes(query) || description.includes(querySingular) || description.includes(queryPlural)
    
    return nameMatch || categoryMatch || descriptionMatch
  }).filter(product => {
    // Filter by price range
    if (priceRange === 'under500') return product.price < 500
    if (priceRange === '500to1000') return product.price >= 500 && product.price <= 1000
    if (priceRange === 'over1000') return product.price > 1000
    return true
  }).filter(product => {
    // Filter by categories
    if (selectedCategories.length === 0) return true
    return selectedCategories.includes(product.category)
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleSearch = (query) => {
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    } else {
      setSearchParams({})
    }
  }

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id)
      if (found) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })

    alert(`${product.name} added to cart!`)
  }

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
          <h1>Search Results</h1>
          {searchQuery && (
            <p>Showing {sortedProducts.length} results for "{searchQuery}"</p>
          )}
        </div>

        <div className="search-layout">
          {/* Sidebar Filters */}
          <aside className="search-filters">
            <div className="filter-section">
              <h3>Categories</h3>
              {CATEGORIES.map(category => (
                <label key={category.key} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.key)}
                    onChange={() => handleCategoryToggle(category.key)}
                  />
                  {category.label}
                </label>
              ))}
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
          </aside>

          {/* Main Results */}
          <main className="search-results">
            {sortedProducts.length === 0 ? (
              <div className="no-results">
                <h2>No products found</h2>
                <p>Try adjusting your search terms or filters</p>
                <button className="btn primary" onClick={() => setSearchParams({})}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid products">
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={addToCart} 
                    onWishlist={toggleWishlist} 
                    isInWishlist={isProductInWishlist(product)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
