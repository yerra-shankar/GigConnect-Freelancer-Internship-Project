
// UserManagement.js

import React, { useState, useEffect, useCallback } from 'react';
// import './UserManagement.css';

const UserManagement = () => {
  // Mock functions for demo
  const showAlert = (message, type) => alert(`${type.toUpperCase()}: ${message}`);
  const setLoading = (loading) => console.log('Loading:', loading);
  
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'freelancer', status: 'active', location: 'New York, USA', createdAt: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'client', status: 'active', location: 'London, UK', createdAt: '2024-02-20' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'freelancer', status: 'suspended', location: 'Sydney, Australia', createdAt: '2024-03-10' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'admin', status: 'active', location: 'Toronto, Canada', createdAt: '2024-01-05' },
  ]);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated API call
      setTimeout(() => {
        setLoading(false);
        showAlert('Users refreshed successfully', 'success');
      }, 500);
    } catch (error) {
      showAlert('Failed to fetch users', 'danger');
      setLoading(false);
    }
  }, []);

  const filterAndSortUsers = useCallback(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || (user.status || 'active') === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    filterAndSortUsers();
  }, [filterAndSortUsers]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <i className="fas fa-sort text-muted"></i>;
    return sortOrder === 'asc' ? 
      <i className="fas fa-sort-up text-primary sort-icon-active"></i> : 
      <i className="fas fa-sort-down text-primary sort-icon-active"></i>;
  };

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Location', 'Join Date'].join(','),
      ...filteredUsers.map(user => [
        `"${user.name}"`,
        `"${user.email}"`,
        user.role,
        user.status || 'active',
        `"${user.location}"`,
        formatDate(user.createdAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users_export.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    
    showAlert('Users exported successfully', 'success');
  };

  return (
    <div className="user-management-wrapper">
      {/* Search and Filters */}
      <div className="row mb-4 filter-row">
        <div className="col-md-4">
          <div className="input-group user-search-group">
            <span className="input-group-text search-icon-wrapper">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control user-search-input"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select user-filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="freelancer">Freelancers</option>
            <option value="client">Clients</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select user-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100 export-btn" onClick={exportUsers}>
            <i className="fas fa-download me-2"></i>Export
          </button>
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100 refresh-btn" onClick={fetchUsers}>
            <i className="fas fa-sync-alt me-2"></i>Refresh
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="alert alert-info results-alert">
        <i className="fas fa-info-circle me-2"></i>
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Users Table */}
      <div className="card user-table-card">
        <div className="card-body user-table-body">
          <div className="table-responsive">
            <table className="table table-hover user-table">
              <thead className="table-light user-table-head">
                <tr>
                  <th 
                    role="button" 
                    onClick={() => handleSort('name')}
                    className="user-select-none sortable-header"
                  >
                    User {getSortIcon('name')}
                  </th>
                  <th 
                    role="button" 
                    onClick={() => handleSort('role')}
                    className="user-select-none sortable-header"
                  >
                    Role {getSortIcon('role')}
                  </th>
                  <th>Location</th>
                  <th>Status</th>
                  <th 
                    role="button" 
                    onClick={() => handleSort('createdAt')}
                    className="user-select-none sortable-header"
                  >
                    Joined {getSortIcon('createdAt')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="user-table-body-rows">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td>
                      <div className="d-flex align-items-center user-info-cell">
                        <div className="avatar avatar-sm me-2 user-avatar">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <div className="fw-bold user-name">{user.name}</div>
                          <small className="text-muted user-email">{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge user-role-badge ${
                        user.role === 'freelancer' ? 'bg-info role-freelancer' : 
                        user.role === 'client' ? 'bg-primary role-client' : 'bg-warning role-admin'
                      }`}>
                        <i className={`fas ${
                          user.role === 'freelancer' ? 'fa-user-tie' :
                          user.role === 'client' ? 'fa-briefcase' : 'fa-user-shield'
                        } me-1`}></i>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <i className="fas fa-map-marker-alt text-muted me-1 location-icon"></i>
                      <span className="user-location">{user.location}</span>
                    </td>
                    <td>
                      <span className={`badge user-status-badge ${
                        (user.status || 'active') === 'suspended' ? 'bg-danger status-suspended' : 'bg-success status-active'
                      }`}>
                        <i className={`fas ${
                          (user.status || 'active') === 'suspended' ? 'fa-ban' : 'fa-check-circle'
                        } me-1`}></i>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td>
                      <i className="fas fa-calendar text-muted me-1 date-icon"></i>
                      <span className="user-date">{formatDate(user.createdAt)}</span>
                    </td>
                    <td>
                      <div className="btn-group action-btn-group" role="group">
                        <button
                          className="btn btn-outline-info btn-sm action-btn view-btn"
                          title="View Profile"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm action-btn message-btn"
                          title="Send Message"
                        >
                          <i className="fas fa-envelope"></i>
                        </button>
                        <button
                          className={`btn btn-outline-${
                            (user.status || 'active') === 'suspended' ? 'success' : 'warning'
                          } btn-sm action-btn suspend-btn`}
                          title={(user.status || 'active') === 'suspended' ? 'Activate' : 'Suspend'}
                        >
                          <i className={`fas fa-${
                            (user.status || 'active') === 'suspended' ? 'play' : 'pause'
                          }`}></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm action-btn delete-btn"
                          title="Delete User"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-4 empty-state">
              <i className="fas fa-users fa-3x text-muted mb-3 empty-icon"></i>
              <h5 className="empty-title">No users found</h5>
              <p className="text-muted empty-text">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;