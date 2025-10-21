//Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white footer-custom">
      <div className="container py-4">
        <div className="row footer-content">
          <div className="col-md-4 footer-brand-section">
            <h5 className="footer-title">
              <i className="fas fa-handshake me-2 footer-brand-icon"></i>
              GigConnect
            </h5>
            <p className="mt-3 footer-description">
              Connecting local freelancers with clients worldwide.<br/>
              Your trusted platform for quality work and collaboration.
            </p>
          </div>
          
          <div className="col-md-4 footer-links-section">
            <h6 className="footer-subtitle">Quick Links</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <a href="#" className="text-primary text-decoration-none footer-link">
                  <i className="fas fa-chevron-right footer-link-icon"></i>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-primary text-decoration-none footer-link">
                  <i className="fas fa-chevron-right footer-link-icon"></i>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-primary text-decoration-none footer-link">
                  <i className="fas fa-chevron-right footer-link-icon"></i>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary text-decoration-none footer-link">
                  <i className="fas fa-chevron-right footer-link-icon"></i>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 footer-social-section">
            <h6 className="footer-subtitle">Connect With Us</h6>
            <p className="footer-social-text">
              Follow us on social media for updates and news
            </p>
            <div className="social-icons">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-linkedin"
                aria-label="Visit our LinkedIn page"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-instagram"
                aria-label="Visit our Instagram page"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-whatsapp"
                aria-label="Contact us on WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon social-icon-twitter"
                aria-label="Visit our X (Twitter) page"
              >
                <i className="fab fa-twitter"></i>
              </a>

            </div>
          </div>
        </div>

        <hr className="my-4 footer-divider" />

        <div className="text-center footer-bottom">
          <p className="mb-0 text-white footer-copyright">
            &copy; 2024 GigConnect. All rights reserved.
          </p>
          <p className="mb-0 footer-tagline">
            Made with <i className="fas fa-heart footer-heart-icon"></i> for freelancers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
