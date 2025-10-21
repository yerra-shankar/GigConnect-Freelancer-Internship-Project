// src/pages/GigsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate,} from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { gigAPI } from '../services/api';
import GigCard from '../components/gig/GigCard';
import CreateGig from '../components/gig/CreateGig';
import Loading from '../components/common/Loading';

const GigsPage = () => {
  const { user, showAlert } = useAppContext();
  const navigate = useNavigate();
  
  const [gigs, setGigs] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchGigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = user.role === 'client'
        ? await gigAPI.getMyGigs()
        : await gigAPI.getAppliedGigs();
      if (response?.data) {
        setGigs(response.data);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
      showAlert('Failed to fetch gigs', 'danger');
      setGigs([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, showAlert]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'freelancer' || user.role === 'client') {
      fetchGigs();
    } else {
      showAlert('Access denied.', 'warning');
      navigate('/');
    }
  }, [user, navigate, showAlert, fetchGigs]);

  const handleDelete = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) {
      return;
    }

    setIsLoading(true);
    try {
      await gigAPI.deleteGig(gigId);
      showAlert('Gig deleted successfully', 'success');
      await fetchGigs();
    } catch (error) {
      console.error('Error deleting gig:', error);
      showAlert('Failed to delete gig', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (gig) => {
    navigate(`/gigs/${gig.id}/edit`);
  };

  const handleViewApplications = (gig) => {
    navigate(`/gigs/${gig.id}/applications`);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchGigs();
    showAlert('Gig created successfully!', 'success');
  };

  const filteredGigs = gigs.filter(gig => {
    if (filter === 'all') return true;
    return gig.status === filter;
  });

  const getStatusCount = (status) => {
    return gigs.filter(gig => gig.status === status).length;
  };

  if (!user) {
    return (
      <div className="container mt-4 modern-container">
        <div className="alert alert-warning modern-alert modern-alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Please log in to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 modern-container modern-page-wrapper">
      {isLoading && <Loading />}
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 modern-page-header">
        <div className="modern-header-content">
          <h2 className="modern-page-title">
            <i className="fas fa-briefcase me-2 text-primary modern-title-icon"></i>
            {user.role === 'client' ? 'My Gigs' : 'Applied Gigs'}
          </h2>
          <p className="text-muted mb-0 modern-page-subtitle">
            {user.role === 'client' 
              ? 'Manage your project listings and find the perfect freelancers'
              : 'Track your gig applications and project status'
            }
          </p>
        </div>
        {user.role === 'client' && (
          <button
            className="btn btn-primary modern-btn modern-btn-primary modern-btn-create"
            onClick={() => setShowCreateForm(true)}
            disabled={isLoading}
          >
            <i className="fas fa-plus me-2"></i>
            Create New Gig
          </button>
        )}
      </div>

      {/* Stats Cards - Only for clients */}
      {user.role === 'client' && gigs.length > 0 && (
        <div className="row mb-4 modern-stats-row">
          <div className="col-md-3">
            <div className="card bg-primary text-white modern-stats-card modern-stats-primary">
              <div className="card-body text-center modern-stats-body">
                <div className="modern-stats-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3 className="modern-stats-number">{gigs.length}</h3>
                <p className="mb-0 modern-stats-label">Total Gigs</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white modern-stats-card modern-stats-success">
              <div className="card-body text-center modern-stats-body">
                <div className="modern-stats-icon">
                  <i className="fas fa-door-open"></i>
                </div>
                <h3 className="modern-stats-number">{getStatusCount('open')}</h3>
                <p className="mb-0 modern-stats-label">Open</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white modern-stats-card modern-stats-warning">
              <div className="card-body text-center modern-stats-body">
                <div className="modern-stats-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3 className="modern-stats-number">{getStatusCount('in-progress')}</h3>
                <p className="mb-0 modern-stats-label">In Progress</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white modern-stats-card modern-stats-info">
              <div className="card-body text-center modern-stats-body">
                <div className="modern-stats-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h3 className="modern-stats-number">{getStatusCount('completed')}</h3>
                <p className="mb-0 modern-stats-label">Completed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs - Only for clients with gigs */}
      {user.role === 'client' && gigs.length > 0 && (
        <ul className="nav nav-tabs mb-4 modern-nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'all' ? 'active' : ''} modern-tab-btn ${filter === 'all' ? 'modern-tab-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Gigs ({gigs.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'open' ? 'active' : ''} modern-tab-btn ${filter === 'open' ? 'modern-tab-active' : ''}`}
              onClick={() => setFilter('open')}
            >
              Open ({getStatusCount('open')})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'in-progress' ? 'active' : ''} modern-tab-btn ${filter === 'in-progress' ? 'modern-tab-active' : ''}`}
              onClick={() => setFilter('in-progress')}
            >
              In Progress ({getStatusCount('in-progress')})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${filter === 'completed' ? 'active' : ''} modern-tab-btn ${filter === 'completed' ? 'modern-tab-active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({getStatusCount('completed')})
            </button>
          </li>
        </ul>
      )}

      
      {/* Create Gig Form */}
      {showCreateForm && (
        <div className="modern-modal-overlay">
          <CreateGig
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleCreateSuccess}
          />
        </div>
      )}

      {/* Gigs List */}
      <div className="row g-4 modern-gigs-grid">
        {filteredGigs.length === 0 ? (
          <div className="col-12">
            <div className="card text-center modern-empty-card">
              <div className="card-body py-5 modern-empty-body">
                <div className="modern-empty-icon">
                  <i className="fas fa-briefcase fa-4x text-muted mb-3"></i>
                </div>
                <h4 className="modern-empty-title">
                  {filter === 'all' ? 'No Gigs Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Gigs`}
                </h4>
                <p className="text-muted mb-4 modern-empty-description">
                  {user.role === 'client'
                    ? filter === 'all' 
                      ? 'Create your first gig to start finding talented freelancers for your projects.'
                      : `You don't have any ${filter} gigs at the moment.`
                    : "You haven't applied to any gigs yet."
                  }
                </p>
                {user.role === 'client' && filter === 'all' && (
                  <button
                    className="btn btn-primary btn-lg modern-btn modern-btn-primary modern-btn-large"
                    onClick={() => setShowCreateForm(true)}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Your First Gig
                  </button>
                )}
                {user.role === 'freelancer' && (
                  <button
                    className="btn btn-primary btn-lg modern-btn modern-btn-primary modern-btn-large"
                    onClick={() => navigate('/search')}
                  >
                    <i className="fas fa-search me-2"></i>
                    Browse Available Gigs
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          filteredGigs.map(gig => (
            <div key={gig.id} className="col-lg-6 col-xl-4">
              <GigCard
                gig={gig}
                isOwner={user.role === 'client'}
                onDelete={user.role === 'client' ? () => handleDelete(gig.id) : undefined}
                onEdit={user.role === 'client' ? () => handleEdit(gig) : undefined}
                onViewApplications={user.role === 'client' ? () => handleViewApplications(gig) : undefined}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GigsPage;