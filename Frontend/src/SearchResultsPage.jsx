import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './App.css'
import { ALL_PRODUCTS, CATEGORIES } from './products'
import AddToCartButton from './components/AddToCartButton'

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

function ProductCard({ product, onAdd, onWishlist, isInWishlist, isAuthenticated, onShowAuth, cart, setCart }) {
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

function SearchResultsPage({ cart, setCart, wishlist, setWishlist, isAuthenticated, onOpenAuth }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [selectedCategories, setSelectedCategories] = useState([])

  const searchQuery = searchParams.get('q') || ''

  // Filter and sort products
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    // Apply price range filter
    let matchesPrice = true
    if (priceRange === 'under500') matchesPrice = product.price < 500
    else if (priceRange === '500to1000') matchesPrice = product.price >= 500 && product.price <= 1000
    else if (priceRange === 'over1000') matchesPrice = product.price > 1000

    // Apply category filter - if categories are selected, product must match one of them
    let matchesCategory = true
    if (selectedCategories.length > 0) {
      matchesCategory = selectedCategories.includes(product.category)
    }

    // Apply search query filter if there's a search term
    let matchesSearch = true
    if (searchQuery) {
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
      
      matchesSearch = nameMatch || categoryMatch || descriptionMatch
    }

    // When both search and category filters are active:
    // - If search matches and no categories selected: show product
    // - If categories selected and no search: show products from selected categories
    // - If both search and categories: show products that match search OR are in selected categories
    if (searchQuery && selectedCategories.length > 0) {
      return matchesPrice && (matchesSearch || matchesCategory)
    }

    return matchesPrice && matchesSearch && matchesCategory
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

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange('all')
    setSortBy('relevance')
    setSearchParams({})
  }

  const hasActiveFilters = selectedCategories.length > 0 || priceRange !== 'all' || searchQuery

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
          <h1>{searchQuery ? 'Search Results' : 'All Products'}</h1>
          {searchQuery && (
            <p>Showing {sortedProducts.length} results for "{searchQuery}"</p>
          )}
          {!searchQuery && hasActiveFilters && (
            <p>Showing {sortedProducts.length} filtered products</p>
          )}
          {!searchQuery && !hasActiveFilters && (
            <p>Browse all {sortedProducts.length} products</p>
          )}
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

            <div className="filter-summary" style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '0.9rem' }}>
              <div><strong>Active Filters:</strong></div>
              {selectedCategories.length > 0 && (
                <div>Categories: {selectedCategories.join(', ')}</div>
              )}
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
                <h2>No products found</h2>
                <p>Try adjusting your search terms or filters</p>
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
                    onAdd={addToCart} 
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
  )
}

export default SearchResultsPage
