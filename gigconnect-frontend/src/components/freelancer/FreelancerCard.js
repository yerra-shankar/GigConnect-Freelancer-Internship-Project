import React from 'react';
import { getInitials, formatCurrency } from '../../utils/helpers';


const FreelancerCard = ({ freelancer, onContact }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning star-icon"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning star-icon"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-muted star-icon"></i>);
      }
    }
    return stars;
  };

  return (
    <div className="card freelancer-card h-100 shadow-sm bg-primary bg-opacity-10 position-relative">
      <div className="card-body freelancer-card-body">
        <div className="d-flex align-items-start mb-3 freelancer-header">
          <div className="avatar me-3 flex-shrink-0 freelancer-avatar-wrapper">
            {freelancer.avatar ? (
              <img 
                src={freelancer.avatar} 
                alt={freelancer.name} 
                className="rounded-circle freelancer-avatar" 
                width="50" 
                height="50" 
              />
            ) : (
              <div 
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center freelancer-avatar-placeholder" 
                style={{width: '50px', height: '50px'}}
              >
                <span className="avatar-initials">{getInitials(freelancer.name)}</span>
              </div>
            )}
          </div>
          <div className="flex-grow-1 freelancer-info">
            <h5 className="mb-1 text-dark freelancer-name">{freelancer.name}</h5>
            <p className="text-muted mb-1 small freelancer-location">
              <i className="fas fa-map-marker-alt me-1 location-icon"></i>
              {freelancer.location}
            </p>
            <div className="rating d-flex align-items-center freelancer-rating">
              {renderStars(freelancer.rating || 0)}
              <span className="ms-2 small text-muted rating-text">
                ({freelancer.rating?.toFixed(1) || '0.0'}) 
                {freelancer.reviewCount && ` • ${freelancer.reviewCount} reviews`}
              </span>
            </div>
          </div>
        </div>
        
        <p className="card-text text-muted small mb-3 freelancer-bio" style={{lineHeight: '1.4'}}>
          {freelancer.bio || 'No bio provided'}
        </p>
        
        {freelancer.skills && freelancer.skills.length > 0 && (
          <div className="mb-3 freelancer-skills-section">
            <small className="text-muted d-block mb-1 skills-label">Skills:</small>
            <div className="skills-container freelancer-skills">
              {freelancer.skills.slice(0, 5).map((skill, index) => (
                <span key={index} className="skill-tag me-1 mb-1">
                  {skill}
                </span>
              ))}
              {freelancer.skills.length > 5 && (
                <span className="text-muted small skills-more">+{freelancer.skills.length - 5} more</span>
              )}
            </div>
          </div>
        )}
        
        <div className="d-flex justify-content-between align-items-center mt-auto freelancer-footer">
          <div className="freelancer-rate">
            <strong className="text-success rate-amount">
              {freelancer.hourlyRate ? formatCurrency(freelancer.hourlyRate) : 'Rate not set'}/hr
            </strong>
          </div>
          {onContact && (
            <button 
              className="btn btn-primary btn-sm freelancer-action-btn"
              onClick={() => onContact(freelancer)}
            >
              <i className="fas fa-envelope me-1 btn-icon"></i>
              Contact
            </button>
          )}
        </div>
        
        {freelancer.isOnline && (
          <div className="position-absolute top-0 end-0 p-2 online-badge-wrapper">
            <span className="badge bg-success online-badge">
              <i className="fas fa-circle me-1 online-dot" style={{fontSize: '0.5rem'}}></i>
              Online
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerCard