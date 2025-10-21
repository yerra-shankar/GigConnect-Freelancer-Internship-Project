import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('gigconnect_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('gigconnect_user');
      return null;
    }
  });

  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ 
    show: false, 
    message: '', 
    type: 'info' 
  });

  // Auto-hide alerts after 5 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert(prev => ({ ...prev, show: false }));
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  // Login function
  const login = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem('gigconnect_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('gigconnect_user');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  };

  // Show alert function
  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
  };

  // Hide alert function
  const hideAlert = () => {
    setAlert({ show: false, message: '', type: 'info' });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user && user.token;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    // State
    user,
    loading,
    alert,
    
    // Actions
    login,
    logout,
    setLoading,
    showAlert,
    hideAlert,
    
    // Helpers
    isAuthenticated,
    hasRole
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
