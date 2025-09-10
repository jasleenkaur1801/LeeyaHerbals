import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "How long does shipping take?",
      answer: "We typically ship within 1-2 working days, and delivery takes 3-7 working days depending on your location. We provide tracking information for all orders."
    },
    {
      question: "What is your return policy?",
      answer: "We only accept returns for damaged or expired products within 7 days of delivery. Please contact us with photos of the damaged product for return instructions."
    },
    {
      question: "Are your products suitable for sensitive skin?",
      answer: "Most of our products are formulated for all skin types using natural herbal ingredients. However, we recommend patch testing for sensitive skin before full application."
    },
    {
      question: "Do you supply products to retailers?",
      answer: "Yes! We are a production company with our own factory. We supply herbal products in bulk to shops and retailers. Contact us for bulk pricing and minimum order quantities."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for orders above ₹500."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can also check your order status in the 'My Orders' section of your account."
    },
    {
      question: "Do you offer skincare consultations?",
      answer: "Yes! Our expert team provides free skincare consultations. You can chat with us or call during business hours for personalized product recommendations."
    },
    {
      question: "Are your products certified organic?",
      answer: "Our products are made with natural herbal ingredients. While we follow organic practices, specific certifications vary by product. Check individual product descriptions for details."
    }
  ];

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

          <div className="faq-accordion-section">
            <div className="faq-header">
              <h3>Frequently Asked Questions</h3>
              <p>Find quick answers to common questions about our products and services</p>
            </div>
            
            <div className="faq-accordion">
              {faqData.map((faq, index) => (
                <div key={index} className={`faq-item ${activeAccordion === index ? 'active' : ''}`}>
                  <button 
                    className="faq-question"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={activeAccordion === index}
                  >
                    <span className="question-text">{faq.question}</span>
                    <span className={`faq-icon ${activeAccordion === index ? 'rotate' : ''}`}>
                      ▼
                    </span>
                  </button>
                  <div className={`faq-answer ${activeAccordion === index ? 'show' : ''}`}>
                    <div className="answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-footer">
              <div className="help-section">
                <h4>Still have questions?</h4>
                <p>Our support team is here to help you</p>
                <div className="help-actions">
                  <button 
                    className="btn primary" 
                    onClick={() => navigate('/chat')}
                  >
                    💬 Start Live Chat
                  </button>
                  <a 
                    href="tel:+919254473593" 
                    className="btn secondary"
                  >
                    📞 Call Us Now
                  </a>
                </div>
              </div>
            </div>
          </div>
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
              <p>Only damaged/expired products return within 7 days</p>
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
              <p>We only accept returns for damaged or expired products within 7 days of delivery. Please contact us for return instructions.</p>
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
