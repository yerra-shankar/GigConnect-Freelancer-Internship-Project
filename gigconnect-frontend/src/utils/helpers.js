
// Format currency
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now - targetDate;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    if (diffInMs < minute) return 'Just now';
    if (diffInMs < hour) return `${Math.floor(diffInMs / minute)}m ago`;
    if (diffInMs < day) return `${Math.floor(diffInMs / hour)}h ago`;
    if (diffInMs < week) return `${Math.floor(diffInMs / day)}d ago`;
    if (diffInMs < month) return `${Math.floor(diffInMs / week)}w ago`;
    if (diffInMs < year) return `${Math.floor(diffInMs / month)}mo ago`;
    
    return formatDate(date);
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return formatDate(date);
  }
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate avatar initials
export const getInitials = (name) => {
  if (!name) return '??';
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'open': 'bg-success',
    'in-progress': 'bg-warning text-dark',
    'completed': 'bg-primary',
    'cancelled': 'bg-danger',
    'paused': 'bg-secondary',
    'pending': 'bg-info',
    'available': 'bg-success',
    'busy': 'bg-warning text-dark',
    'unavailable': 'bg-danger'
  };
  return statusClasses[status] || 'bg-secondary';
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if user has permission
export const hasPermission = (user, requiredRole) => {
  if (!user) return false;
  
  const roleHierarchy = {
    'admin': 3,
    'client': 2,
    'freelancer': 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
};

// Generate random ID (for mock data)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate form data
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return '';
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Download file
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.click();
  
  window.URL.revokeObjectURL(url);
};

// Format number with commas
export const formatNumber = (number) => {
  if (!number && number !== 0) return '0';
  return new Intl.NumberFormat('en-US').format(number);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  if (typeof obj === 'string') return obj.trim().length === 0;
  return false;
};

// Deep clone object
export const deepClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error deep cloning object:', error);
    return obj;
  }
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Generate color from string (for avatars)
export const stringToColor = (str) => {
  if (!str) return '#6f42c1';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#6f42c1', '#fd7e14', '#198754', '#0dcaf0', 
    '#ffc107', '#dc3545', '#20c997', '#6610f2'
  ];
  
  return colors[Math.abs(hash) % colors.length];
}