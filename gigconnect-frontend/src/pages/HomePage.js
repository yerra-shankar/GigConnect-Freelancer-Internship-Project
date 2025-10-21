//HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const HomePage = () => {
  const { user } = useAppContext();

  return (
    <div className="homepage-wrapper">
      <div className="container">
        {/* Hero Section */}
        <div className="row align-items-center mb-5 hero-section">
          <div className="col-lg-6 hero-content">
            <h1 className="display-4 fw-bold text-primary mb-3 hero-title">
              Connect with Local Freelancers
            </h1>
            <p className="lead mb-4 hero-subtitle">
              Find skilled professionals in your area for all your project needs. 
              From web development to graphic design, connect with the best talent nearby.
            </p>
            <div className="d-flex gap-3 hero-buttons">
              <Link to="/search" className="btn btn-lg custom-btn-primary">
                Find Freelancers
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-outline-primary btn-lg custom-btn-outline">
                  Join as Freelancer
                </Link>
              )}
            </div>
          </div>
          <div className="col-lg-6 text-center hero-icon-wrapper">
            <i className="fas fa-users fa-10x text-primary opacity-75 hero-icon"></i>
          </div>
        </div>

        {/* Features Section */}
        <div className="row g-4 mb-5 features-section">
          <div className="col-md-4">
            <div className="card h-100 text-center feature-card">
              <div className="card-body">
                <i className="fas fa-map-marker-alt fa-3x text-primary mb-3 feature-icon"></i>
                <h5 className="card-title feature-title">Hyperlocal Matching</h5>
                <p className="card-text feature-description">
                  Find freelancers in your city or neighborhood for faster collaboration.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center feature-card">
              <div className="card-body">
                <i className="fas fa-shield-alt fa-3x text-success mb-3 feature-icon"></i>
                <h5 className="card-title feature-title">Secure Payments</h5>
                <p className="card-text feature-description">
                  Safe and secure payment processing with escrow protection.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 text-center feature-card">
              <div className="card-body">
                <i className="fas fa-star fa-3x text-warning mb-3 feature-icon"></i>
                <h5 className="card-title feature-title">Quality Assurance</h5>
                <p className="card-text feature-description">
                  Verified reviews and ratings to help you choose the best freelancers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="row text-center mb-5 stats-section">
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h3 className="text-primary stat-number">1000+</h3>
                <p className="text-muted stat-label">Freelancers</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h3 className="text-success stat-number">500+</h3>
                <p className="text-muted stat-label">Completed Projects</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h3 className="text-info stat-number">50+</h3>
                <p className="text-muted stat-label">Cities</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card stat-card">
              <div className="card-body">
                <h3 className="text-warning stat-number">98%</h3>
                <p className="text-muted stat-label">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="row cta-section mb-5">
            <div className="col-12">
              <div className="card bg-primary text-white text-center cta-card">
                <div className="card-body py-5">
                  <h3 className="cta-title">Ready to Get Started?</h3>
                  <p className="lead cta-subtitle">Join thousands of freelancers and clients already using GigConnect.</p>
                  <div className="d-flex justify-content-center gap-3 cta-buttons">
                    <Link to="/register" className="btn btn-light btn-lg custom-btn-light">
                      Sign Up Now
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg custom-btn-outline-light">
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
