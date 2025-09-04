import React, { useState } from 'react';
import './SkincareFlipCards.css';

const SkincareFlipCards = () => {
  const [flippedCards, setFlippedCards] = useState({});

  const skinTypes = [
    {
      id: 'oily',
      title: 'Oily Skin',
      image: '/items/facewash/tea tree.png', // Using tea tree for oily skin
      tips: [
        'Use a gentle, oil-free cleanser twice daily',
        'Apply salicylic acid or niacinamide serum',
        'Use lightweight, non-comedogenic moisturizer',
        'Always wear broad-spectrum SPF 30+ sunscreen',
        'Avoid over-washing as it can increase oil production',
        'Use clay masks 1-2 times per week'
      ],
      color: '#e8f5e8'
    },
    {
      id: 'dry',
      title: 'Dry Skin',
      image: '/items/moisturzinglotion/green tea and acerola cherry.png',
      tips: [
        'Use a creamy, hydrating cleanser',
        'Apply hyaluronic acid or vitamin E serum',
        'Use rich, emollient moisturizers',
        'Apply moisturizer while skin is still damp',
        'Use gentle exfoliation only once a week',
        'Consider overnight hydrating masks'
      ],
      color: '#f0f8ff'
    },
    {
      id: 'normal',
      title: 'Normal Skin',
      image: '/items/serum/vitaminC face.png',
      tips: [
        'Maintain routine with gentle cleanser',
        'Use vitamin C serum for antioxidant protection',
        'Apply balanced moisturizer daily',
        'Regular exfoliation 2-3 times per week',
        'Always use sunscreen during the day',
        'Focus on prevention and maintenance'
      ],
      color: '#fff5ee'
    },
    {
      id: 'combination',
      title: 'Combination Skin',
      image: '/items/toner/cucumber.png',
      tips: [
        'Use different products for T-zone and cheeks',
        'Gentle cleanser for the entire face',
        'Oil-free moisturizer on T-zone, richer on cheeks',
        'Use targeted treatments for different areas',
        'Balance is key - avoid over-treating',
        'Consider multi-masking technique'
      ],
      color: '#f5f0ff'
    },
    {
      id: 'sensitive',
      title: 'Sensitive Skin',
      image: '/items/rosewater/rose water.png',
      tips: [
        'Use fragrance-free, hypoallergenic products',
        'Patch test new products before full use',
        'Gentle, minimal ingredient formulations',
        'Avoid harsh scrubs and strong actives',
        'Use lukewarm water for cleansing',
        'Focus on barrier repair and soothing ingredients'
      ],
      color: '#fdf2f8'
    },
    {
      id: 'acne-prone',
      title: 'Acne-Prone Skin',
      image: '/items/acneoilgel/acneoilcontrolgel.png',
      tips: [
        'Use non-comedogenic products only',
        'Incorporate salicylic acid or benzoyl peroxide',
        'Don\'t skip moisturizer - use oil-free formula',
        'Avoid picking or squeezing blemishes',
        'Change pillowcases frequently',
        'Consider professional treatments for severe acne'
      ],
      color: '#f0fff4'
    }
  ];

  const handleCardClick = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <section className="skincare-tips-section">
      <div className="container">
        <div className="section-header">
          <h2>Skincare Tips</h2>
          <p>Learn how to care for your skin naturally</p>
        </div>
        
        <div className="flip-cards-grid">
          {skinTypes.map((skinType) => (
            <div 
              key={skinType.id} 
              className={`flip-card ${flippedCards[skinType.id] ? 'flipped' : ''}`}
              onClick={() => handleCardClick(skinType.id)}
            >
              <div className="flip-card-inner">
                {/* Front of card */}
                <div className="flip-card-front" style={{ backgroundColor: skinType.color }}>
                  <div className="card-image-container">
                    <img 
                      src={skinType.image} 
                      alt={skinType.title}
                      className="skin-type-image"
                      onError={(e) => {
                        e.target.src = '/items/serum/vitaminC face.png'; // Fallback image
                      }}
                    />
                  </div>
                  <div className="card-content">
                    <h3>{skinType.title}</h3>
                    <p>Click to see tips</p>
                    <div className="flip-indicator">
                      <span>🔄</span>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="flip-card-back" style={{ backgroundColor: skinType.color }}>
                  <div className="card-back-content">
                    <h3>{skinType.title} Tips</h3>
                    <ul className="tips-list">
                      {skinType.tips.map((tip, index) => (
                        <li key={index} className="tip-item">
                          <span className="tip-bullet">✨</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    <div className="flip-back-indicator">
                      <span>🔄 Click to flip back</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkincareFlipCards;
