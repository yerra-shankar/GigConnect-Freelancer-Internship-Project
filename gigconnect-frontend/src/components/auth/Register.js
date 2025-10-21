//Register.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { authAPI } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'freelancer',
    location: ''
  });
  const [errors, setErrors] = useState({});
  
  const { login, setLoading, showAlert } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authAPI.register(submitData);
      login(response.data);
      showAlert('Registration successful! Welcome to GigConnect!', 'success');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      showAlert(errorMessage, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="container mt-5 bg-primary bg-opacity-10 p-4 rounded register-container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow register-card">
              <div className="card-body p-4 bg-light register-card-body">
                <div className="register-header text-center mb-4">
                  <div className="register-icon-wrapper">
                    <i className="fas fa-handshake register-brand-icon"></i>
                  </div>
                  <h3 className="register-title">Join GigConnect</h3>
                  <p className="register-subtitle">Create your account and start connecting</p>
                </div>
                
                <form onSubmit={handleSubmit} noValidate className="register-form">
                  <div className="mb-3 input-group-custom">
                    <label htmlFor="name" className="form-label input-label1">
                      <i className="fas fa-user input-label-icon1"></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className={`form-control input-custom1 ${errors.name ? 'is-invalid1' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.name && <div className="invalid-feedback error-message1">{errors.name}</div>}
                  </div>
                  
                  <div className="mb-3 input-group-custom">
                    <label htmlFor="email" className="form-label input-label1">
                      <i className="fas fa-envelope input-label-icon1"></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control input-custom1 ${errors.email ? 'is-invalid1' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    {errors.email && <div className="invalid-feedback error-message1">{errors.email}</div>}
                  </div>
                  
                  <div className="mb-3 input-group-custom">
                    <label htmlFor="password" className="form-label input-label1">
                      <i className="fas fa-lock input-label-icon1"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control input-custom1 ${errors.password ? 'is-invalid1' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      required
                    />
                    {errors.password && <div className="invalid-feedback error-message1">{errors.password}</div>}
                  </div>
                  
                  <div className="mb-3 input-group-custom">
                    <label htmlFor="confirmPassword" className="form-label input-label1">
                      <i className="fas fa-lock input-label-icon1"></i>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className={`form-control input-custom1 ${errors.confirmPassword ? 'is-invalid1' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                    />
                    {errors.confirmPassword && <div className="invalid-feedback error-message1">{errors.confirmPassword}</div>}
                  </div>
                  
                  <div className="mb-3 input-group-custom">
                    <label htmlFor="location" className="form-label input-label1">
                      <i className="fas fa-map-marker-alt input-label-icon1"></i>
                      Location
                    </label>
                    <input
                      type="text"
                      className={`form-control input-custom1 ${errors.location ? 'is-invalid1' : ''}`}
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State"
                      required
                    />
                    {errors.location && <div className="invalid-feedback error-message1">{errors.location}</div>}
                  </div>
                  
                  <div className="mb-4 role-selection">
                    <label className="form-label role-label">
                      <i className="fas fa-users-cog me-2"></i>
                      I want to:
                    </label>
                    <div className="role-options">
                      <div className={`role-option ${formData.role === 'freelancer' ? 'active' : ''}`}>
                        <input
                          className="form-check-input role-radio"
                          type="radio"
                          name="role"
                          id="freelancer"
                          value="freelancer"
                          checked={formData.role === 'freelancer'}
                          onChange={handleChange}
                        />
                        <label className="role-option-label" htmlFor="freelancer">
                          <i className="fas fa-user-tie role-icon"></i>
                          <div className="role-text">
                            <span className="role-title">Freelancer</span>
                            <span className="role-description">Offer my services</span>
                          </div>
                        </label>
                      </div>
                      
                      <div className={`role-option ${formData.role === 'client' ? 'active' : ''}`}>
                        <input
                          className="form-check-input role-radio"
                          type="radio"
                          name="role"
                          id="client"
                          value="client"
                          checked={formData.role === 'client'}
                          onChange={handleChange}
                        />
                        <label className="role-option-label" htmlFor="client">
                          <i className="fas fa-briefcase role-icon"></i>
                          <div className="role-text">
                            <span className="role-title">Client</span>
                            <span className="role-description">Hire freelancers</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3 register-btn">
                    <i className="fas fa-user-plus me-2 btn-icon1"></i>
                    Create Account
                  </button>
                </form>
                
                <div className="text-center register-footer">
                  <p className="mb-0 footer-text1">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none login-link">
                      Login here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


