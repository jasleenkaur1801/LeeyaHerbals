import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Get in touch with our team!</p>
        </div>

        <div className="contact-content">
          <div className="contact-grid-unified">
            <div className="contact-item">
              <div className="contact-icon">📧</div>
              <div>
                <h3>Email Us</h3>
                <p>kpherbals300@gmail.com</p>
                <small>We respond within 24 hours</small>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div>
                <h3>Call Us</h3>
                <p>+91 9254473593</p>
                <small>Mon-Fri: 9:00 AM - 6:00 PM IST</small>
              </div>
            </div>

            <div className="contact-item visit-us-clickable" onClick={() => navigate('/contact/visitus')}>
              <div className="contact-icon">📍</div>
              <div>
                <h3>Visit Us</h3>
                <p>Leeya Herbals Pvt. Ltd.</p>
                <p>Mini Bypass, Shanti Nagar, Surya Nagar</p>
                <p>Near C R Resort, Surya Nagar</p>
                <p>Bhiwani, Haryana 127021</p>
                <small>Click to view on map</small>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🕒</div>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Sunday: 9:30 AM - 8:15 PM</p>
                <small>All times in IST</small>
              </div>
            </div>

            <div className="contact-item whatsapp-card">
              <div className="contact-icon">💬</div>
              <div>
                <h3>WhatsApp Support</h3>
                <p>+91-9254473593</p>
                <small>Quick support & order updates</small>
                <a href="https://wa.me/919254473593" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-item follow-us-card">
              <div className="contact-icon">🌐</div>
              <div>
                <h3>Follow Us</h3>
                <p>Stay connected for updates & tips</p>
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

            <div className="contact-item live-chat-card">
              <div className="contact-icon">🤖</div>
              <div>
                <h3>AI Assistant</h3>
                <p>Get instant answers 24/7</p>
                <button className="chat-btn" onClick={() => navigate('/chat')}>
                  Start Live Chat
                </button>
              </div>
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

        <div className="faq-cta">
          <div className="faq-cta-content">
            <h3>Have Questions?</h3>
            <p>Check out our comprehensive FAQ section for quick answers</p>
            <button className="btn primary" onClick={() => navigate('/faq')}>
              View All FAQs
            </button>
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
