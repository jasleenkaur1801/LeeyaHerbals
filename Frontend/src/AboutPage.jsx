import React from 'react';
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <div className="container">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
          <h1>About Leeya Herbals</h1>
          <p>Your trusted partner in natural wellness and beauty</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded with a passion for natural wellness, Leeya Herbals has been dedicated to providing 
              high-quality herbal products that nurture your skin and enhance your natural beauty. 
              Our journey began with a simple belief: nature holds the key to healthy, radiant skin.
            </p>
            <p>
              Every product in our collection is carefully crafted using traditional herbal knowledge 
              combined with modern scientific research. We source our ingredients from trusted suppliers 
              who share our commitment to sustainability and quality.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              To make natural, effective skincare accessible to everyone while promoting sustainable 
              practices and supporting local communities. We believe that taking care of your skin 
              should be a delightful, guilt-free experience.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🌿</span>
              <h3>100% Natural</h3>
              <p>All our products are made from carefully selected natural ingredients with no harmful chemicals.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🧪</span>
              <h3>Scientifically Tested</h3>
              <p>Each formula is rigorously tested for safety and effectiveness before reaching you.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">♻️</span>
              <h3>Eco-Friendly</h3>
              <p>We're committed to sustainable practices and environmentally conscious packaging.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">❤️</span>
              <h3>Cruelty-Free</h3>
              <p>We never test on animals and ensure all our suppliers follow the same ethical standards.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🏆</span>
              <h3>Award-Winning</h3>
              <p>Recognized for excellence in natural skincare and customer satisfaction.</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🤝</span>
              <h3>Community Support</h3>
              <p>We support local farmers and communities involved in growing our herbal ingredients.</p>
            </div>
          </div>

          <div className="about-section">
            <h2>Why Choose Leeya Herbals?</h2>
            <ul>
              <li>✨ Premium quality herbal ingredients sourced ethically</li>
              <li>🔬 Formulations backed by traditional wisdom and modern science</li>
              <li>🌍 Commitment to environmental sustainability</li>
              <li>💝 Personalized customer care and support</li>
              <li>📦 Secure packaging and fast delivery</li>
              <li>💰 Competitive prices without compromising on quality</li>
            </ul>
          </div>

          <div className="category-stats">
            <div className="stat">
              <strong>5+</strong>
              <span>Years Experience</span>
            </div>
            <div className="stat">
              <strong>10,000+</strong>
              <span>Happy Customers</span>
            </div>
            <div className="stat">
              <strong>50+</strong>
              <span>Natural Products</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
