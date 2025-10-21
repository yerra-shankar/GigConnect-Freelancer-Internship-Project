// src/components/freelancer/SearchFreelancers.js
import React, { useState, useEffect, useCallback } from 'react';
import FreelancerCard from './FreelancerCard';
import { freelancerAPI } from '../../services/api';
import { useAppContext } from '../../context/AppContext';
import { debounce } from '../../utils/helpers';

const SearchFreelancers = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    minRating: ''
  });
  
  const { setLoading, showAlert, user } = useAppContext();

  const fetchFreelancers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await freelancerAPI.search(filters);
      setFreelancers(response.data);
    } catch (error) {
      showAlert('Failed to fetch freelancers', 'danger');
    } finally {
      setLoading(false);
    }
  }, [filters, setLoading, showAlert]);

  useEffect(() => {
    fetchFreelancers();
  }, [fetchFreelancers]);

  const debouncedSearch = debounce(fetchFreelancers, 500);

  const handleFilterChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    debouncedSearch();
  };

  const handleContact = (freelancer) => {
    if (!user) {
      showAlert('Please login to contact freelancers', 'warning');
      return;
    }
    
    if (user.role !== 'client') {
      showAlert('Only clients can contact freelancers', 'warning');
      return;
    }
    
    // Navigate to messages or open contact modal
    console.log('Contacting freelancer:', freelancer);
  };

  const clearFilters = () => {
    setFilters({
      skills: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      minRating: ''
    });
    fetchFreelancers();
  };

  return (
    <div className="search-freelancers-page">
      <div className="container mt-4 bg-secondary bg-opacity-10 p-4 rounded search-container">
        <div className="page-header">
          <h2 className="page-title">
            <i className="fas fa-search me-3 search-icon"></i>
            Find Freelancers
          </h2>
          <p className="page-subtitle">
            Discover talented professionals for your next project
          </p>
        </div>
        
        {/* Search Filters */}
        <div className="card mb-4 filter-card">
          <div className="card-body">
            <div className="filter-header mb-3">
              <h5 className="filter-title">
                <i className="fas fa-filter me-2"></i>
                Search Filters
              </h5>
            </div>
            
            <div className="row g-3">
              <div className="col-md-3" >
                <label className="form-label">
                  <i className="fas fa-code me-2"></i>
                  Skills
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="skills"
                  placeholder="e.g., React, Design"
                  value={filters.skills}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  placeholder="City"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-2">
                <label className="form-label">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Min Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-2">
                <label className="form-label">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Max Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="col-md-2">
                <label className="form-label">
                  <i className="fas fa-star me-2"></i>
                  Min Rating
                </label>
                <select
                  className="form-select"
                  name="minRating"
                  value={filters.minRating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>
            </div>
            
            <div className="mt-3 filter-actions">
              <button 
                type="button" 
                className="btn btn-primary search-btn" 
                onClick={fetchFreelancers}
              >
                <i className="fas fa-search me-2"></i>
                Search
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary ms-2 clear-btn" 
                onClick={clearFilters}
              >
                <i className="fas fa-times me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {freelancers.length > 0 && (
          <div className="results-summary mb-3">
            <p className="results-count">
              <i className="fas fa-users me-2"></i>
              Found <strong>{freelancers.length}</strong> freelancer{freelancers.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Results */}
        <div className="row g-4 results-grid">
          {freelancers.length === 0 ? (
            <div className="col-12 text-center">
              <div className="card no-results-card">
                <div className="card-body py-5">
                  <div className="no-results-icon-wrapper">
                    <i className="fas fa-search fa-4x text-muted mb-3 no-results-icon"></i>
                  </div>
                  <h4 className="no-results-title">No Freelancers Found</h4>
                  <p className="text-muted no-results-text">
                    Try adjusting your search criteria or clearing filters to see more results.
                  </p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={clearFilters}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Reset Search
                  </button>
                </div>
              </div>
            </div>
          ) : (
            freelancers.map((freelancer) => (
              <div key={freelancer.id} className="col-lg-4 col-md-6 freelancer-card-wrapper">
                <FreelancerCard 
                  freelancer={freelancer} 
                  onContact={handleContact} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFreelancers;