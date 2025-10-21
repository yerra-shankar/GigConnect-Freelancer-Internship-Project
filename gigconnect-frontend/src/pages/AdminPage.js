/// AdminPage.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const AdminPage = () => {
  const { user, showAlert } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!user) {
      showAlert('Please login to access the admin panel', 'warning');
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      showAlert('Access denied. Admin privileges required.', 'danger');
      navigate('/');
      return;
    }
  }, [user, navigate, showAlert]);

  // Show loading or redirect message while checking authentication
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;


