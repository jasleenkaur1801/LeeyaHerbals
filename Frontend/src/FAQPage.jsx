import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';

function FAQPage() {
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const faqData = [
    {
      question: "What makes Leeya Herbals products different?",
      answer: "Our products are 100% herbal, toxin-free, and made with clinically-backed natural actives. We use no parabens, sulfates, or mineral oils, and all formulas are dermatologically tested for safety.",
      category: "Products"
    },
    {
      question: "Are your products suitable for all skin types?",
      answer: "Yes! Our herbal formulations are gentle and suitable for all skin types, including sensitive skin. Each product is dermatologically tested to ensure safety and effectiveness.",
      category: "Products"
    },
    {
      question: "How long does shipping take?",
      answer: "We offer free shipping on orders above ₹799. Standard delivery takes 3-7 business days across India. You'll receive tracking information once your order is dispatched.",
      category: "Shipping"
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns only for damaged or expired products within 7 days of delivery. Please contact our support team with photos of the damaged product for quick replacement.",
      category: "Returns"
    },
    {
      question: "Do you test on animals?",
      answer: "Absolutely not! All Leeya Herbals products are cruelty-free. We believe in ethical beauty and never test on animals.",
      category: "Products"
    },
    {
      question: "How should I store the products?",
      answer: "Store products in a cool, dry place away from direct sunlight. Keep containers tightly closed and use within the recommended period after opening.",
      category: "Products"
    },
    {
      question: "Can I get skincare consultation?",
      answer: "Yes! Our expert team is available for skincare consultations. Contact us via email, phone, or WhatsApp, and we'll help you choose the right products for your skin concerns.",
      category: "Support"
    },
    {
      question: "Do you offer wholesale or bulk orders?",
      answer: "Yes, we do offer wholesale pricing for bulk orders. Please contact us directly at care@leeyaherbals.com with your requirements for special pricing.",
      category: "Business"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD) for orders above ₹500.",
      category: "Payment"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via SMS and email. You can also check your order status in the 'My Orders' section of your account.",
      category: "Orders"
    },
    {
      question: "Are your products certified organic?",
      answer: "Our products are made with natural herbal ingredients. While we follow organic practices, specific certifications vary by product. Check individual product descriptions for details.",
      category: "Products"
    },
    {
      question: "Do you have a physical store?",
      answer: "Yes, we have our main facility and showroom. You can visit us at our location mentioned in the contact section. We recommend calling ahead to ensure availability.",
      category: "Store"
    }
  ];

  const categories = [...new Set(faqData.map(faq => faq.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <div className="faq-hero-content">
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about our herbal skincare products and services</p>
          </div>
        </div>
      </div>

      <div className="container faq-content">
        <div className="faq-categories">
          <button
            className={`category-btn ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All ({faqData.length})
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category} ({faqData.filter(faq => faq.category === category).length})
            </button>
          ))}
        </div>

        <div className="faq-results">
          {filteredFAQs.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">❓</div>
              <h3>No FAQs found</h3>
              <p>Try adjusting your search or browse different categories</p>
            </div>
          ) : (
            <div className="faq-accordion">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className={`faq-item ${activeAccordion === index ? 'active' : ''}`}>
                  <button 
                    className="faq-question"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={activeAccordion === index}
                  >
                    <div className="question-content">
                      <span className="category-tag">{faq.category}</span>
                      <span className="question-text">{faq.question}</span>
                    </div>
                    <span className={`faq-icon ${activeAccordion === index ? 'rotate' : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
          )}
        </div>

        <div className="faq-help-section">
          <div className="help-card">
            <div className="help-icon">💬</div>
            <h3>Still need help?</h3>
            <p>Our support team is ready to assist you with any questions</p>
            <div className="help-actions">
              <button 
                className="btn primary" 
                onClick={() => navigate('/contact')}
              >
                Contact Support
              </button>
              <button 
                className="btn secondary" 
                onClick={() => navigate('/chat')}
              >
                Live Chat
              </button>
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

export default FAQPage;
