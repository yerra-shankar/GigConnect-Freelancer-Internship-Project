
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { freelancerAPI } from '../../services/api';
import { getInitials } from '../../utils/helpers';

const FreelancerProfile = () => {
  const { user, showAlert, setLoading } = useAppContext();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await freelancerAPI.getById(user.id);
      setProfile(prev => ({
        ...prev,
        ...response.data
      }));
    } catch (error) {
      console.log('Profile not found, using default values');
      setProfile(prev => ({
        ...prev,
        location: user?.location || ''
      }));
    } finally {
      setLoading(false);
    }
  }, [user, setLoading]);

  const [profile, setProfile] = useState({
    bio: '',
    skills: [],
    hourlyRate: '',
    portfolio: [],
    location: user?.location || '',
    experience: '',
    education: '',
    languages: [],
    availability: 'available'
  });

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && user.role === 'freelancer') {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profile.hourlyRate && (profile.hourlyRate < 5 || profile.hourlyRate > 500)) {
      showAlert('Hourly rate must be between $5 and $500', 'warning');
      return;
    }
    
    if (profile.bio && profile.bio.length > 500) {
      showAlert('Bio must be less than 500 characters', 'warning');
      return;
    }

    setIsSaving(true);

    try {
      await freelancerAPI.update(user.id, profile);
      showAlert('Profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      showAlert(errorMessage, 'danger');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (!skill) {
      showAlert('Please enter a skill', 'warning');
      return;
    }
    
    if (profile.skills.includes(skill)) {
      showAlert('Skill already exists', 'warning');
      return;
    }
    
    if (profile.skills.length >= 20) {
      showAlert('Maximum 20 skills allowed', 'warning');
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addLanguage = () => {
    const language = newLanguage.trim();
    if (!language) {
      showAlert('Please enter a language', 'warning');
      return;
    }
    
    if (profile.languages.includes(language)) {
      showAlert('Language already exists', 'warning');
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      languages: [...prev.languages, language]
    }));
    setNewLanguage('');
  };

  const removeLanguage = (languageToRemove) => {
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleLanguageKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  if (!user || user.role !== 'freelancer') {
    return (
      <div className="container mt-4 enhanced-container">
        <div className="alert alert-warning enhanced-alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          This page is only available for freelancers.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 enhanced-container">
      <div className="row enhanced-row">    
        {/* Main Profile Form */}
        <div className="col-lg-8 enhanced-main-col">
          <div className="card shadow enhanced-card enhanced-main-card">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center enhanced-header enhanced-primary-header">
              <h5 className="mb-0 enhanced-title">
                <i className="fas fa-user-edit me-2 enhanced-icon"></i>
                Profile Information
              </h5>
              <button
                className="btn btn-outline-light btn-sm enhanced-btn enhanced-edit-btn"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                <i className={`fas ${isEditing ? 'fa-times' : 'fa-edit'} me-1`}></i>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="card-body enhanced-body">
              <form onSubmit={handleSubmit} className="enhanced-form">
                <div className="row enhanced-form-row">
                  {/* Bio */}
                  <div className="col-12 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">
                      Bio / Description
                      <span className="text-danger">*</span>
                    </label>
                    {isEditing ? (
                      <>
                        <textarea
                          className="form-control enhanced-textarea"
                          name="bio"
                          rows="4"
                          placeholder="Tell clients about yourself, your expertise, and what makes you unique..."
                          value={profile.bio}
                          onChange={handleChange}
                          maxLength={500}
                        />
                        <small className="text-muted enhanced-char-count">
                          {profile.bio.length}/500 characters
                        </small>
                      </>
                    ) : (
                      <div className="form-control-plaintext bg-light p-3 rounded enhanced-display">
                        {profile.bio || (
                          <span className="text-muted enhanced-empty">
                            <i className="fas fa-info-circle me-2"></i>
                            No bio added yet. Add one to attract more clients!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div className="col-md-6 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control enhanced-input"
                        name="location"
                        placeholder="City, State, Country"
                        value={profile.location}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="form-control-plaintext enhanced-display">
                        <i className="fas fa-map-marker-alt me-2 text-primary enhanced-icon-primary"></i>
                        {profile.location || 'Location not set'}
                      </div>
                    )}
                  </div>
                  
                  {/* Hourly Rate */}
                  <div className="col-md-6 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">Hourly Rate ($)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control enhanced-input"
                        name="hourlyRate"
                        placeholder="e.g., 50"
                        min="5"
                        max="500"
                        value={profile.hourlyRate}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="form-control-plaintext enhanced-display">
                        <i className="fas fa-dollar-sign me-2 text-success enhanced-icon-success"></i>
                        {profile.hourlyRate ? (
                          <span className="text-success fw-bold enhanced-rate">${profile.hourlyRate}/hr</span>
                        ) : (
                          <span className="text-muted">Rate not set</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Experience Level */}
                  <div className="col-md-6 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">Experience Level</label>
                    {isEditing ? (
                      <select
                        className="form-select enhanced-select"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                      >
                        <option value="">Select experience</option>
                        <option value="entry">Entry Level (0-1 years)</option>
                        <option value="intermediate">Intermediate (2-5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext enhanced-display">
                        <i className="fas fa-chart-line me-2 text-info enhanced-icon-info"></i>
                        {profile.experience ? (
                          profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)
                        ) : (
                          'Not specified'
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Availability */}
                  <div className="col-md-6 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">Availability Status</label>
                    {isEditing ? (
                      <select
                        className="form-select enhanced-select"
                        name="availability"
                        value={profile.availability}
                        onChange={handleChange}
                      >
                        <option value="available">Available for work</option>
                        <option value="busy">Busy</option>
                        <option value="unavailable">Unavailable</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext enhanced-display">
                        <span className={`badge enhanced-badge ${
                          profile.availability === 'available' ? 'bg-success enhanced-badge-success' :
                          profile.availability === 'busy' ? 'bg-warning text-dark enhanced-badge-warning' : 'bg-danger enhanced-badge-danger'
                        }`}>
                          <i className={`fas ${
                            profile.availability === 'available' ? 'fa-check-circle' :
                            profile.availability === 'busy' ? 'fa-clock' : 'fa-times-circle'
                          } me-1`}></i>
                          {profile.availability.charAt(0).toUpperCase() + profile.availability.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="col-12 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">
                      Skills
                      <span className="text-danger">*</span>
                    </label>
                    {isEditing && (
                      <div className="input-group mb-2 enhanced-input-group">
                        <input
                          type="text"
                          className="form-control enhanced-input"
                          placeholder="Add a skill (e.g., React, JavaScript, Design)"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={handleSkillKeyPress}
                          maxLength={50}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary enhanced-btn enhanced-add-btn" 
                          onClick={addSkill}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    )}
                    
                    <div className="skills-container enhanced-skills">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span key={index} className="skill-tag me-1 mb-1 enhanced-skill-tag">
                            {skill}
                            {isEditing && (
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-1 enhanced-skill-remove"
                                style={{ fontSize: '0.7rem' }}
                                onClick={() => removeSkill(skill)}
                                aria-label="Remove skill"
                              ></button>
                            )}
                          </span>
                        ))
                      ) : (
                        <div className="text-muted enhanced-empty">
                          <i className="fas fa-info-circle me-2"></i>
                          No skills added yet. Add your skills to attract more clients!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="col-12 mb-3 enhanced-form-group">
                    <label className="form-label fw-bold enhanced-label">Languages</label>
                    {isEditing && (
                      <div className="input-group mb-2 enhanced-input-group">
                        <input
                          type="text"
                          className="form-control enhanced-input"
                          placeholder="Add a language (e.g., English, Spanish)"
                          value={newLanguage}
                          onChange={(e) => setNewLanguage(e.target.value)}
                          onKeyPress={handleLanguageKeyPress}
                          maxLength={30}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-primary enhanced-btn enhanced-add-btn" 
                          onClick={addLanguage}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    )}
                    
                    <div className="enhanced-languages">
                      {profile.languages.length > 0 ? (
                        profile.languages.map((language, index) => (
                          <span key={index} className="badge bg-info me-1 mb-1 enhanced-language-badge">
                            <i className="fas fa-language me-1"></i>
                            {language}
                            {isEditing && (
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-1 enhanced-language-remove"
                                style={{ fontSize: '0.7rem' }}
                                onClick={() => removeLanguage(language)}
                                aria-label="Remove language"
                              ></button>
                            )}
                          </span>
                        ))
                      ) : (
                        <div className="text-muted enhanced-empty">
                          <i className="fas fa-language me-2"></i>
                          No languages specified
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="d-flex gap-2 mt-4 enhanced-actions">
                    <button 
                      type="submit" 
                      className="btn btn-success enhanced-btn enhanced-save-btn"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2 enhanced-spinner"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary enhanced-btn enhanced-cancel-btn"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        
        {/* Profile Preview Sidebar */}
        <div className="col-lg-4 enhanced-sidebar-col">
          <div className="card shadow sticky-top enhanced-card enhanced-preview-card" style={{top: '20px'}}>
            <div className="card-header bg-light enhanced-header enhanced-light-header">
              <h5 className="mb-0 enhanced-title">
                <i className="fas fa-eye me-2 enhanced-icon"></i>
                Profile Preview
              </h5>
            </div>
            <div className="card-body enhanced-body">
              <div className="text-center mb-3 enhanced-preview-section">
                <div className="avatar avatar-lg mx-auto mb-2 enhanced-avatar">
                  {getInitials(user.name)}
                </div>
                <h5 className="mt-2 enhanced-name">{user.name}</h5>
                <p className="text-muted mb-2 enhanced-location">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {profile.location || 'Location not set'}
                </p>
                <span className={`badge enhanced-badge ${
                  profile.availability === 'available' ? 'bg-success enhanced-badge-success' :
                  profile.availability === 'busy' ? 'bg-warning text-dark enhanced-badge-warning' : 'bg-danger enhanced-badge-danger'
                }`}>
                  {profile.availability.charAt(0).toUpperCase() + profile.availability.slice(1)}
                </span>
              </div>
              
              {profile.bio && (
                <div className="mb-3 enhanced-preview-item">
                  <strong>About:</strong>
                  <p className="small mt-1 enhanced-bio-text">{profile.bio}</p>
                </div>
              )}
              
              {profile.hourlyRate && (
                <div className="mb-3 enhanced-preview-item">
                  <strong>Rate:</strong> 
                  <span className="text-success ms-1 fw-bold enhanced-rate">${profile.hourlyRate}/hr</span>
                </div>
              )}

              {profile.experience && (
                <div className="mb-3 enhanced-preview-item">
                  <strong>Experience:</strong> {profile.experience.charAt(0).toUpperCase() + profile.experience.slice(1)}
                </div>
              )}
              
              {profile.skills.length > 0 && (
                <div className="mb-3 enhanced-preview-item">
                  <strong>Skills:</strong>
                  <div className="mt-1 enhanced-preview-skills">
                    {profile.skills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="skill-tag me-1 mb-1 enhanced-skill-tag enhanced-skill-small">
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 10 && (
                      <span className="text-muted small enhanced-more-count">
                        +{profile.skills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {profile.languages.length > 0 && (
                <div className="enhanced-preview-item">
                  <strong>Languages:</strong>
                  <div className="mt-1 enhanced-preview-languages">
                    {profile.languages.map((language, index) => (
                      <span key={index} className="badge bg-info me-1 mb-1 enhanced-language-badge enhanced-language-small">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="card shadow mt-4 enhanced-card enhanced-tips-card">
            <div className="card-header bg-warning text-dark enhanced-header enhanced-warning-header">
              <h6 className="mb-0 enhanced-title">
                <i className="fas fa-lightbulb me-2 enhanced-icon"></i>
                Profile Tips
              </h6>
            </div>
            <div className="card-body enhanced-body">
              <ul className="list-unstyled mb-0 small enhanced-tips-list">
                <li className="mb-2 enhanced-tip-item">
                  <i className="fas fa-check text-success me-2 enhanced-check-icon"></i>
                  Complete your bio to attract more clients
                </li>
                <li className="mb-2 enhanced-tip-item">
                  <i className="fas fa-check text-success me-2 enhanced-check-icon"></i>
                  Add relevant skills for your expertise
                </li>
                <li className="mb-2 enhanced-tip-item">
                  <i className="fas fa-check text-success me-2 enhanced-check-icon"></i>
                  Set competitive hourly rates
                </li>
                <li className="mb-0 enhanced-tip-item">
                  <i className="fas fa-check text-success me-2 enhanced-check-icon"></i>
                  Keep your availability status updated
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;