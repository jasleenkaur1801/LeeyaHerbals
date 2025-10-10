import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { key: 'serum', label: 'Serums', icon: '✨', description: 'Concentrated treatments for targeted skin concerns' },
  { key: 'cleanser', label: 'Cleansers', icon: '🧼', description: 'Gentle cleansing for all skin types' },
  { key: 'toner', label: 'Toners', icon: '💧', description: 'Balance and refresh your skin' },
  { key: 'facemask', label: 'Face Masks', icon: '🎭', description: 'Deep cleansing and nourishing masks' },
  { key: 'facewashgel', label: 'Face Wash Gel', icon: '🫧', description: 'Daily cleansing gel for fresh skin', image: '/items/facewashgel/vitamin c & orange.png' },
  { key: 'acneoilgel', label: 'Acne Oil Gel', icon: '🌿', description: 'Targeted acne treatment solutions' },
  { key: 'bath-body', label: 'Bath & Body', icon: '🛁', description: 'Complete body care essentials' },
  { key: 'skin-care', label: 'Skin Care', icon: '✨', description: 'Complete skincare solutions' }
];

function CategoriesPage() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryKey) => {
    if (categoryKey === 'bath-body') {
      navigate('/categories/bath-body');
    } else if (categoryKey === 'skin-care') {
      navigate('/categories/skin-care');
    } else if (categoryKey === 'facewashgel') {
      navigate('/categories/face-wash-gel');
    } else {
      navigate(`/search?q=${categoryKey}`);
    }
  };

  return (
    <div className="categories-page">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>Shop by Category</h1>
          <p>Discover our complete range of natural herbal products</p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map(category => (
            <div 
              key={category.key} 
              className="category-card-large"
              onClick={() => handleCategoryClick(category.key)}
            >
              {category.image ? (
                <div className="category-image-large">
                  <img src={category.image} alt={category.label} />
                </div>
              ) : (
                <div className="category-icon-large">
                  {category.icon}
                </div>
              )}
              <div className="category-content">
                <h3>{category.label}</h3>
                <p>{category.description}</p>
                <button className="btn small">
                  Browse {category.label} →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="category-stats">
          <div className="stat">
            <strong>50+</strong>
            <span>Products</span>
          </div>
          <div className="stat">
            <strong>8</strong>
            <span>Categories</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>Natural</span>
          </div>
          <div className="stat">
            <strong>1000+</strong>
            <span>Happy Customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
