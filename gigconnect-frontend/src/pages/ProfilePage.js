//ProfilePage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import FreelancerProfile from '../components/freelancer/FreelancerProfile';

const ProfilePage = () => {
  const { user, showAlert } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      showAlert('Please login to access your profile', 'warning');
      navigate('/login');
      return;
    }

    // Check if user is a freelancer
    if (user.role !== 'freelancer') {
      showAlert('Profile page is only available for freelancers', 'warning');
      navigate('/');
      return;
    }
  }, [user, navigate, showAlert]);

  // Show loading while checking authentication
  if (!user || user.role !== 'freelancer') {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return <FreelancerProfile />;
};

export default ProfilePage;