import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VisitUsPage.css';

function VisitUsPage() {
  const navigate = useNavigate();

  return (
    <div className="visit-us-page">
      <div className="container">
        <div className="page-header">
          <h1>Visit Our Store</h1>
          <p>Come and experience our herbal products in person</p>
        </div>

        <div className="visit-content">
          <div className="location-info">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div>
                <h3>Our Location</h3>
                <p><strong>Leeya Herbals Pvt. Ltd.</strong></p>
                <p>Mini Bypass, Shanti Nagar, Surya Nagar</p>
                <p>Near C R Resort, Surya Nagar</p>
                <p>Bhiwani, Haryana 127021</p>
                <p>India</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">🕒</div>
              <div>
                <h3>Store Hours</h3>
                <p>Monday - Sunday</p>
                <p><strong>9:30 AM - 8:15 PM</strong></p>
                <small>All times in IST</small>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <div>
                <h3>Contact Before Visit</h3>
                <p>+91 9254473593</p>
                <small>Call ahead to ensure availability</small>
              </div>
            </div>
          </div>

          <div className="map-section">
            <h3>Find Us on Map</h3>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3470.8234567890123!2d76.1563952!3d28.7841966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQ3JzAzLjEiTiA3NsKwMDknMjMuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Leeya Herbals Location"
              ></iframe>
            </div>
            
            <div className="map-actions">
              <a 
                href="https://www.google.com/maps/place//@28.7841915,76.1564012,16.99z/data=!4m6!1m5!3m4!2zMjjCsDQ3JzAzLjEiTiA3NsKwMDknMjMuMCJF!8m2!3d28.7841966!4d76.1563952?entry=ttu&g_ep=EgoyMDI1MDkwNy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="map-btn primary"
              >
                Open in Google Maps
              </a>
              <a 
                href="https://maps.google.com/maps?daddr=28.7841966,76.1563952"
                target="_blank"
                rel="noopener noreferrer"
                className="map-btn secondary"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="back-to-contact-section">
          <button className="back-btn" onClick={() => navigate('/contact')}>
            ← Back to Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisitUsPage;
