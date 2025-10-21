// src/components/gig/CreateGig.js


import React, { useState } from 'react';
import { gigAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const CreateGig = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    skills: [],
    location: '',
    category: '',
    experienceLevel: 'intermediate',
    projectType: 'one-time',
    estimatedDuration: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { showAlert } = useAppContext();

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design & Creative',
    'Writing & Translation',
    'Digital Marketing',
    'Data Science',
    'Engineering',
    'Business',
    'Other'
  ];

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }
    
    if (!formData.budget || isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a valid number greater than 0';
    } else if (parseFloat(formData.budget) > 50000) {
      newErrors.budget = 'Budget cannot exceed $50,000';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const gigData = {
        ...formData,
        budget: parseFloat(formData.budget),
        skills: formData.skills
      };

      await gigAPI.create(gigData);
      showAlert('Gig created successfully! It will be visible to freelancers shortly.', 'success');
      onSuccess();
    } catch (error) {
      console.error('Error creating gig:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create gig. Please try again.';
      showAlert(errorMessage, 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setNewSkill('');
      
      // Clear skills error
      if (errors.skills) {
        setErrors(prev => ({
          ...prev,
          skills: ''
        }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="card mb-4 shadow modern-form-card">
      <div className="card-header bg-primary text-white modern-form-header">
        <div className="d-flex justify-content-between align-items-center">
          <div className="modern-form-title-section">
            <div className="modern-form-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <div>
              <h5 className="mb-0 modern-form-title">
                Create New Gig
              </h5>
              <small className="modern-form-subtitle">Fill in the details to post your project</small>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white modern-close-btn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
          ><i className="fas fa-times"></i></button>
        </div>
      </div>
      <div className="card-body modern-form-body">
        <form onSubmit={handleSubmit} noValidate className="modern-form">
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="title" className="form-label modern-form-label">Project Title *</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''} modern-form-input`}
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build a responsive e-commerce website"
                maxLength={100}
                disabled={isSubmitting}
                required
              />
              {errors.title && <div className="invalid-feedback modern-form-error">{errors.title}</div>}
              <small className="text-muted modern-form-helper">{formData.title.length}/100 characters</small>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="category" className="form-label modern-form-label">Category *</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''} modern-form-select`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback modern-form-error">{errors.category}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="budget" className="form-label modern-form-label">Budget ($) *</label>
              <input
                type="number"
                className={`form-control ${errors.budget ? 'is-invalid' : ''} modern-form-input`}
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="1000"
                min="10"
                max="50000"
                step="0.01"
                disabled={isSubmitting}
                required
              />
              {errors.budget && <div className="invalid-feedback modern-form-error">{errors.budget}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="deadline" className="form-label modern-form-label">Deadline *</label>
              <input
                type="date"
                className={`form-control ${errors.deadline ? 'is-invalid' : ''} modern-form-input`}
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={getTomorrowDate()}
                disabled={isSubmitting}
                required
              />
              {errors.deadline && <div className="invalid-feedback modern-form-error">{errors.deadline}</div>}
            </div>
            
            <div className="col-md-6">
              <label htmlFor="location" className="form-label modern-form-label">Location</label>
              <input
                type="text"
                className="form-control modern-form-input"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Remote or City, State"
                disabled={isSubmitting}
              />
              <small className="text-muted modern-form-helper">Leave blank for remote work</small>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="experienceLevel" className="form-label modern-form-label">Experience Level</label>
              <select
                className="form-select modern-form-select"
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div className="col-md-6">
              <label htmlFor="projectType" className="form-label modern-form-label">Project Type</label>
              <select
                className="form-select modern-form-select"
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="one-time">One-time project</option>
                <option value="ongoing">Ongoing work</option>
                <option value="hourly">Hourly contract</option>
              </select>
            </div>
            
            <div className="col-12">
              <label htmlFor="description" className="form-label modern-form-label">Project Description *</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''} modern-form-textarea`}
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project in detail. Include specific requirements, deliverables, and any technical specifications..."
                maxLength={2000}
                disabled={isSubmitting}
                required
              />
              {errors.description && <div className="invalid-feedback modern-form-error">{errors.description}</div>}
              <small className="text-muted modern-form-helper">{formData.description.length}/2000 characters</small>
            </div>
            
            <div className="col-12">
              <label className="form-label modern-form-label">Required Skills *</label>
              <div className="input-group mb-2 modern-skill-input-group">
                <input
                  type="text"
                  className="form-control modern-form-input"
                  placeholder="Add a skill (e.g., React, JavaScript, Python)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleSkillKeyPress}
                  maxLength={50}
                  disabled={isSubmitting}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-primary modern-btn modern-btn-outline-primary" 
                  onClick={addSkill}
                  disabled={isSubmitting || !newSkill.trim()}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              <div className="skills-container mb-2 modern-skills-display">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary me-1 mb-1 p-2 modern-skill-tag-form">
                    {skill}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2 modern-skill-remove"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => removeSkill(skill)}
                      disabled={isSubmitting}
                      aria-label="Remove skill"
                    ></button>
                  </span>
                ))}
              </div>
              
              {errors.skills && (
                <div className="text-danger small modern-form-error">{errors.skills}</div>
              )}
              
              <small className="text-muted modern-form-helper">
                Add skills that freelancers should have to work on this project
              </small>
            </div>
          </div>
          
          <div className="mt-4 d-flex gap-2 modern-form-actions">
            <button 
              type="submit" 
              className="btn btn-success modern-btn modern-btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2 modern-spinner" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-check me-2"></i>
                  Create Gig
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary modern-btn modern-btn-outline-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-light rounded modern-form-tips">
            <h6 className="text-muted mb-2 modern-tips-header">
              <i className="fas fa-lightbulb me-2"></i>
              Tips for a successful gig:
            </h6>
            <ul className="small text-muted mb-0 modern-tips-list">
              <li>Write a clear, detailed description</li>
              <li>Set a realistic budget and deadline</li>
              <li>List all required skills accurately</li>
              <li>Include specific deliverables and requirements</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;