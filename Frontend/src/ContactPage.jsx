import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="contact-page">
        <div className="container">
          <div className="success-message">
            <span className="success-icon">✅</span>
            <h2>Thank you for contacting us!</h2>
            <p>We've received your message and will get back to you within 24 hours.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team!</p>
        </div>

        <div className="contact-content">
          <div className="contact-methods">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email Us</h3>
                <p>kpherbals300@gmail.com</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Call Us</h3>
                <p>+91 9254473593</p>
                <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div>
                <h3>Visit Us</h3>
                <p>123 Herbal Street</p>
                <p>Natural City, NC 12345</p>
                <p>India</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">💬</div>
              <div>
                <h3>Live Chat</h3>
                <p>Available 24/7</p>
                <button className="btn small" onClick={() => navigate('/chat')}>
                  Start Chat
                </button>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="order-support">Order Support</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="returns">Returns & Refunds</option>
                <option value="partnership">Partnership Opportunities</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="social-whatsapp-section">
          <div className="whatsapp-card">
            <div className="contact-icon">💬</div>
            <h3>WhatsApp</h3>
            <p>+91-9254473593</p>
            <small>Quick support & order updates</small>
          </div>

          <div className="follow-us-card">
            <div className="contact-icon">🌐</div>
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://www.facebook.com/leeyaherbalsofficial?rdid=NtSw720FcKpPbzU8&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CNMek2Gjd%2F" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="social-logo" />
                Facebook
              </a>
              <a href="https://www.instagram.com/leeyaherbals/?igsh=OGQyZmF2N2lzd2kz" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" className="social-logo" />
                Instagram
              </a>
            </div>
          </div>
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
            <span className="feature-icon">🔒</span>
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

        <div className="contact-faq">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How long does shipping take?</h4>
              <p>We typically ship within 1-2 working days, and delivery takes 3-7 working days depending on your location.</p>
            </div>
            <div className="faq-item">
              <h4>What is your return policy?</h4>
              <p>We offer a 30-day return policy for unopened products. Please contact us for return instructions.</p>
            </div>
            <div className="faq-item">
              <h4>Are your products suitable for sensitive skin?</h4>
              <p>Most of our products are formulated for all skin types, but we recommend patch testing for sensitive skin.</p>
            </div>
            <div className="faq-item">
              <h4>Do you supply products to retailers?</h4>
              <p>Yes! We are a production company with our own factory. We supply herbal products in bulk to shops and retailers. Please contact us for bulk supply and pricing information.</p>
            </div>
          </div>
        </div>

        <div className="back-to-home-section">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
