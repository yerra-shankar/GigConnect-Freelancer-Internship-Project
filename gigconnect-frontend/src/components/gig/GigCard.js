// gigconnect-frontend/src/components/gig/GigCard.js

import React from 'react';
import PropTypes from 'prop-types';

const GigCard = ({ 
  gig, 
  isOwner = false, 
  onEdit, 
  onDelete, 
  onViewApplications,
  onApply 
}) => {
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'open': 'bg-success',
      'in-progress': 'bg-warning text-dark',
      'completed': 'bg-info',
      'cancelled': 'bg-danger',
      'closed': 'bg-secondary'
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const getModernStatusClass = (status) => {
    const modernClasses = {
      'open': 'modern-badge-success',
      'in-progress': 'modern-badge-warning',
      'completed': 'modern-badge-info',
      'cancelled': 'modern-badge-danger',
      'closed': 'modern-badge-secondary'
    };
    return modernClasses[status] || 'modern-badge-secondary';
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card h-100 gig-card shadow-sm modern-gig-card">
      <div className="card-body d-flex flex-column modern-gig-body">
        <div className="d-flex justify-content-between align-items-start mb-2 modern-gig-header">
          <h5 className="card-title mb-0 modern-gig-title" title={gig.title}>
            {truncateText(gig.title, 60)}
          </h5>
          <span className={`badge ${getStatusBadgeClass(gig.status)} ms-2 modern-status-badge ${getModernStatusClass(gig.status)}`}>
            {gig.status?.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        
        <p className="card-text text-muted flex-grow-1 modern-gig-description" title={gig.description}>
          {truncateText(gig.description)}
        </p>
        
        <div className="mb-3 modern-gig-details">
          <div className="row g-2 small">
            <div className="col-6">
              <div className="modern-detail-item">
                <i className="fas fa-dollar-sign modern-detail-icon"></i>
                <div>
                  <strong className="modern-detail-label">Budget:</strong> 
                  <span className="modern-detail-value">{formatCurrency(gig.budget)}</span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="modern-detail-item">
                <i className="fas fa-calendar modern-detail-icon"></i>
                <div>
                  <strong className="modern-detail-label">Deadline:</strong> 
                  <span className="modern-detail-value">{formatDate(gig.deadline)}</span>
                </div>
              </div>
            </div>
            {gig.category && (
              <div className="col-12">
                <div className="modern-detail-item">
                  <i className="fas fa-tag modern-detail-icon"></i>
                  <div>
                    <strong className="modern-detail-label">Category:</strong> 
                    <span className="modern-detail-value">{gig.category}</span>
                  </div>
                </div>
              </div>
            )}
            {gig.experienceLevel && (
              <div className="col-12">
                <div className="modern-detail-item">
                  <i className="fas fa-star modern-detail-icon"></i>
                  <div>
                    <strong className="modern-detail-label">Level:</strong> 
                    <span className="modern-detail-value">{gig.experienceLevel.charAt(0).toUpperCase() + gig.experienceLevel.slice(1)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {gig.skills && gig.skills.length > 0 && (
          <div className="mb-3 modern-skills-section">
            <small className="text-muted d-block mb-1 modern-skills-label">Required Skills:</small>
            <div className="skills-container modern-skills-container">
              {gig.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge bg-light text-dark me-1 mb-1 small modern-skill-tag">
                  {skill}
                </span>
              ))}
              {gig.skills.length > 3 && (
                <span className="badge bg-light text-muted me-1 mb-1 small modern-skill-tag modern-skill-more">
                  +{gig.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="d-flex gap-2 flex-wrap mt-auto modern-gig-actions">
          {isOwner && onEdit && (
            <button 
              className="btn btn-outline-primary btn-sm modern-btn modern-btn-outline-primary" 
              onClick={() => onEdit(gig)}
              title="Edit gig"
            >
              <i className="fas fa-edit me-1"></i>Edit
            </button>
          )}
          
          {isOwner && onViewApplications && (
            <button 
              className="btn btn-outline-info btn-sm modern-btn modern-btn-outline-info" 
              onClick={() => onViewApplications(gig)}
              title="View applications"
            >
              <i className="fas fa-eye me-1"></i>Applications
            </button>
          )}
          
          {!isOwner && onApply && gig.status === 'open' && (
            <button 
              className="btn btn-primary btn-sm modern-btn modern-btn-primary" 
              onClick={() => onApply(gig)}
              title="Apply to this gig"
            >
              <i className="fas fa-paper-plane me-1"></i>Apply
            </button>
          )}
          
          {isOwner && onDelete && (
            <button 
              className="btn btn-outline-danger btn-sm modern-btn modern-btn-outline-danger" 
              onClick={() => onDelete(gig.id)}
              title="Delete gig"
            >
              <i className="fas fa-trash me-1"></i>Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

GigCard.propTypes = {
  gig: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    budget: PropTypes.number.isRequired,
    deadline: PropTypes.string.isRequired,
    status: PropTypes.string,
    category: PropTypes.string,
    experienceLevel: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  isOwner: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onViewApplications: PropTypes.func,
  onApply: PropTypes.func
};

export default GigCard;