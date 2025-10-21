import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Navbar = () => {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-custom">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary brand-logo" to="/">
          <i className="fas fa-handshake me-2 brand-icon"></i>
          <span className="brand-text">GigConnect</span>
        </Link>

        <button 
          className="navbar-toggler custom-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto nav-links-left">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/search">
                <i className="fas fa-search nav-link-icon"></i>
                Find Freelancers
              </Link>
            </li>
            
            {user && user.role === 'client' && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/gigs">
                  <i className="fas fa-briefcase nav-link-icon"></i>
                  My Gigs
                </Link>
              </li>
            )}
            
            {user && user.role === 'freelancer' && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/profile">
                  <i className="fas fa-user-circle nav-link-icon"></i>
                  My Profile
                </Link>
              </li>
            )}
            
            {user && (
              <li className="nav-item">
                <Link className="nav-link nav-link-custom" to="/messages">
                  <i className="fas fa-envelope nav-link-icon"></i>
                  Messages
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav nav-links-right">
            {user ? (
              <li className="nav-item dropdown user-dropdown">
                <a 
                  className="nav-link dropdown-toggle nav-link-custom user-menu-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-user me-1 user-icon"></i>
                  <span className="user-name">{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-custom">
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item dropdown-item-custom" to="/admin">
                        <i className="fas fa-cog me-2 dropdown-icon"></i>
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button className="dropdown-item dropdown-item-custom" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2 dropdown-icon"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom auth-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom btn-register" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;