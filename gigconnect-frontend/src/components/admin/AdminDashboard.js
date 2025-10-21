// AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { formatDate, formatCurrency, getStatusBadgeClass, formatNumber } from '../../utils/helpers';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';

const AdminDashboard = () => {
  const { user, showAlert, setLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalGigs: 0,
    openGigs: 0,
    completedGigs: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0
  });
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, gigsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getGigs()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setGigs(gigsRes.data);

      // Mock transaction data
      setTransactions([
        {
          id: 1,
          amount: 2500,
          type: 'gig_payment',
          status: 'completed',
          fromUser: 'John Doe',
          toUser: 'Sarah Johnson',
          gigTitle: 'E-commerce Website Development',
          date: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          amount: 1200,
          type: 'gig_payment',
          status: 'pending',
          fromUser: 'Jane Smith',
          toUser: 'Mike Chen',
          gigTitle: 'Mobile App UI Design',
          date: '2024-01-16T15:45:00Z'
        }
      ]);

    } catch (error) {
      showAlert('Failed to load dashboard data', 'danger');
    } finally {
      setLoading(false);
    }
  }, [setLoading, showAlert]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);


  // handleUserAction was removed because user management is handled by UserManagement component

  const handleGigAction = async (gigId, action) => {
    try {
      const gig = gigs.find(g => g.id === gigId);
      if (!gig) return;

      const confirmed = window.confirm(`Are you sure you want to ${action} "${gig.title}"?`);
      if (!confirmed) return;

      if (action === 'remove') {
        setGigs(prev => prev.filter(g => g.id !== gigId));
        showAlert('Gig removed successfully', 'success');
      } else if (action === 'feature') {
        setGigs(prev => prev.map(g =>
          g.id === gigId ? { ...g, featured: !g.featured } : g
        ));
        showAlert('Gig updated successfully', 'success');
      }
    } catch (error) {
      showAlert('Failed to perform action', 'danger');
    }
  };

  const exportData = (type) => {
    let data = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.map(user => ({
          Name: user.name,
          Email: user.email,
          Role: user.role,
          Location: user.location,
          Status: user.status || 'active',
          'Join Date': formatDate(user.createdAt)
        }));
        filename = 'users_export.csv';
        break;
      case 'gigs':
        data = gigs.map(gig => ({
          Title: gig.title,
          Client: gig.client?.name,
          Budget: gig.budget,
          Status: gig.status,
          'Created Date': formatDate(gig.createdAt),
          Skills: gig.skills?.join(', ')
        }));
        filename = 'gigs_export.csv';
        break;
      case 'transactions':
        data = transactions.map(transaction => ({
          'Transaction ID': transaction.id,
          Amount: transaction.amount,
          Type: transaction.type,
          Status: transaction.status,
          From: transaction.fromUser,
          To: transaction.toUser,
          Date: formatDate(transaction.date)
        }));
        filename = 'transactions_export.csv';
        break;
      default:
        showAlert('No data to export', 'info');
        return;
    }

    const csv = convertToCSV(data);
    downloadCSV(csv, filename);
    showAlert(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully`, 'success');
  };

  const convertToCSV = (data) => {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // filteredUsers is managed inside UserManagement component

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <i className="fas fa-arrow-up text-success adm-stat-icon-up"></i>;
    if (growth < 0) return <i className="fas fa-arrow-down text-danger adm-stat-icon-down"></i>;
    return <i className="fas fa-minus text-muted"></i>;
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid pt-5 px-3 adm-dashboard-container">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4 adm-header-bar">
            <div>
              <h2 className="adm-main-title">
                <i className="fas fa-tachometer-alt me-2 text-primary adm-icon"></i>
                Admin Dashboard
              </h2>
              <p className="text-muted mb-0 adm-subtitle">Manage and monitor your GigConnect platform</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary adm-action-btn" onClick={() => fetchDashboardData()}>
                <i className="fas fa-sync-alt me-2 adm-refresh-icon"></i>
                Refresh
              </button>
              <div className="dropdown">
                <button
                  className="btn btn-success dropdown-toggle adm-action-btn adm-export-btn"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="fas fa-download me-2 adm-export-icon"></i>
                  Export
                </button>
                <ul className="dropdown-menu adm-dropdown-menu">
                  <li><button className="dropdown-item adm-dropdown-item" type="button" onClick={() => exportData('users')}>Export Users</button></li>
                  <li><button className="dropdown-item adm-dropdown-item" type="button" onClick={() => exportData('gigs')}>Export Gigs</button></li>
                  <li><button className="dropdown-item adm-dropdown-item" type="button" onClick={() => exportData('transactions')}>Export Transactions</button></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4 adm-stats-row">
            <div className="col-xl-3 col-md-6 adm-col-card">
              <div className="card bg-gradient-primary text-white h-100 adm-stat-card adm-stat-card-primary">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-uppercase mb-1 adm-stat-label">Total Users</div>
                      <div className="h5 mb-0 adm-stat-value">{formatNumber(stats.totalUsers)}</div>
                      <div className="mt-2 mb-0 text-xs adm-stat-growth">
                        {getGrowthIcon(12)}
                        <span className="ms-1">12% from last month</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-users fa-2x adm-stat-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 adm-col-card">
              <div className="card bg-gradient-success text-white h-100 adm-stat-card adm-stat-card-success">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-uppercase mb-1 adm-stat-label">Active Gigs</div>
                      <div className="h5 mb-0 adm-stat-value">{formatNumber(stats.totalGigs)}</div>
                      <div className="mt-2 mb-0 text-xs adm-stat-growth">
                        {getGrowthIcon(8)}
                        <span className="ms-1">8% from last month</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-briefcase fa-2x adm-stat-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 adm-col-card">
              <div className="card bg-gradient-info text-white h-100 adm-stat-card adm-stat-card-info">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-uppercase mb-1 adm-stat-label">Total Revenue</div>
                      <div className="h5 mb-0 adm-stat-value">{formatCurrency(stats.totalRevenue || 125000)}</div>
                      <div className="mt-2 mb-0 text-xs adm-stat-growth">
                        {getGrowthIcon(15)}
                        <span className="ms-1">15% from last month</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x adm-stat-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 adm-col-card">
              <div className="card bg-gradient-warning text-white h-100 adm-stat-card adm-stat-card-warning">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="text-xs font-weight-bold text-uppercase mb-1 adm-stat-label">Transactions</div>
                      <div className="h5 mb-0 adm-stat-value">{formatNumber(stats.totalTransactions)}</div>
                      <div className="mt-2 mb-0 text-xs adm-stat-growth">
                        {getGrowthIcon(5)}
                        <span className="ms-1">5% from last month</span>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-credit-card fa-2x adm-stat-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="row g-3 mb-4 adm-secondary-stats-row">
            <div className="col-md-3 adm-col-card-secondary">
              <div className="card border-start-primary adm-secondary-stat-card">
                <div className="card-body">
                  <div className="text-primary adm-secondary-label">Freelancers</div>
                  <div className="h6 mb-0 adm-secondary-value">{formatNumber(stats.totalFreelancers || Math.floor(stats.totalUsers * 0.6))}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 adm-col-card-secondary">
              <div className="card border-start-success adm-secondary-stat-card">
                <div className="card-body">
                  <div className="text-success adm-secondary-label">Clients</div>
                  <div className="h6 mb-0 adm-secondary-value">{formatNumber(stats.totalClients || Math.floor(stats.totalUsers * 0.4))}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 adm-col-card-secondary">
              <div className="card border-start-info adm-secondary-stat-card">
                <div className="card-body">
                  <div className="text-info adm-secondary-label">Completed Gigs</div>
                  <div className="h6 mb-0 adm-secondary-value">{formatNumber(stats.completedGigs || Math.floor(stats.totalGigs * 0.3))}</div>
                </div>
              </div>
            </div>
            <div className="col-md-3 adm-col-card-secondary">
              <div className="card border-start-warning adm-secondary-stat-card">
                <div className="card-body">
                  <div className="text-warning adm-secondary-label">Active Users (24h)</div>
                  <div className="h6 mb-0 adm-secondary-value">{formatNumber(stats.activeUsers || Math.floor(stats.totalUsers * 0.15))}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="card adm-main-content-card">
            <div className="card-header adm-tabs-header">
              <ul className="nav nav-tabs card-header-tabs adm-nav-tabs">
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''} adm-nav-link adm-nav-link-overview`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="fas fa-chart-pie me-2"></i>Overview
                  </button>
                </li>
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'users' ? 'active' : ''} adm-nav-link adm-nav-link-users`}
                    onClick={() => setActiveTab('users')}
                  >
                    <i className="fas fa-users me-2"></i>Users ({users.length})
                  </button>
                </li>
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'gigs' ? 'active' : ''} adm-nav-link adm-nav-link-gigs`}
                    onClick={() => setActiveTab('gigs')}
                  >
                    <i className="fas fa-briefcase me-2"></i>Gigs ({gigs.length})
                  </button>
                </li>
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''} adm-nav-link adm-nav-link-transactions`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    <i className="fas fa-credit-card me-2"></i>Transactions
                  </button>
                </li>
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'reports' ? 'active' : ''} adm-nav-link adm-nav-link-reports`}
                    onClick={() => setActiveTab('reports')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>Reports
                  </button>
                </li>
                <li className="nav-item adm-nav-item">
                  <button
                    className={`nav-link ${activeTab === 'settings' ? 'active' : ''} adm-nav-link adm-nav-link-settings`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="fas fa-cog me-2"></i>Settings
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body adm-tab-content-body">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="row adm-tab-pane">
                  <div className="col-lg-8 adm-col-chart">
                    <div className="card adm-chart-card adm-animated-fade">
                      <div className="card-header adm-card-header">
                        <h5 className="mb-0 adm-card-title">
                          <i className="fas fa-chart-line me-2 adm-chart-icon"></i>Platform Growth
                        </h5>
                      </div>
                      <div className="card-body adm-chart-body">
                        <div className="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center adm-chart-placeholder" style={{height: '300px'}}>
                          <div className="text-center text-muted">
                            <i className="fas fa-chart-line fa-3x mb-3 chart-body-icon"></i>
                            <h5>Revenue & User Growth Chart</h5>
                            <p>Chart.js integration would go here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 adm-col-activity">
                    <div className="card mb-3 adm-activity-card adm-animated-slide">
                      <div className="card-header adm-card-header">
                        <h6 className="mb-0 adm-card-title-sm">Recent Activity</h6>
                      </div>
                      <div className="card-body adm-activity-body">
                        <div className="timeline adm-timeline">
                          <div className="timeline-item adm-timeline-item">
                            <div className="timeline-marker bg-success adm-timeline-marker"></div>
                            <div className="timeline-content adm-timeline-content">
                              <h6 className="timeline-title adm-timeline-title">New user registered</h6>
                              <p className="timeline-description adm-timeline-description">Sarah Johnson joined as freelancer</p>
                              <small className="text-muted adm-timeline-time">2 hours ago</small>
                            </div>
                          </div>
                          <div className="timeline-item adm-timeline-item">
                            <div className="timeline-marker bg-info adm-timeline-marker"></div>
                            <div className="timeline-content adm-timeline-content">
                              <h6 className="timeline-title adm-timeline-title">Gig completed</h6>
                              <p className="timeline-description adm-timeline-description">Website Development project finished</p>
                              <small className="text-muted adm-timeline-time">5 hours ago</small>
                            </div>
                          </div>
                          <div className="timeline-item adm-timeline-item">
                            <div className="timeline-marker bg-warning adm-timeline-marker"></div>
                            <div className="timeline-content adm-timeline-content">
                              <h6 className="timeline-title adm-timeline-title">Payment processed</h6>
                              <p className="timeline-description adm-timeline-description">{formatCurrency(2500)} transaction completed</p>
                              <small className="text-muted adm-timeline-time">1 day ago</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card adm-actions-card adm-animated-fade">
                      <div className="card-header adm-card-header">
                        <h6 className="mb-0 adm-card-title-sm">Quick Actions</h6>
                      </div>
                      <div className="card-body adm-actions-body">
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-primary btn-sm adm-quick-action-btn">
                            <i className="fas fa-plus me-2"></i>Add New Admin
                          </button>
                          <button className="btn btn-outline-info btn-sm adm-quick-action-btn">
                            <i className="fas fa-bell me-2"></i>Send Announcement
                          </button>
                          <button className="btn btn-outline-success btn-sm adm-quick-action-btn">
                            <i className="fas fa-file-export me-2"></i>Generate Report
                          </button>
                          <button className="btn btn-outline-warning btn-sm adm-quick-action-btn">
                            <i className="fas fa-tools me-2"></i>System Maintenance
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab - render UserManagement component */}
              {activeTab === 'users' && (
                <div className="adm-tab-pane adm-animated-slide-delayed">
                  <UserManagement />
                </div>
              )}

              {/* Gigs Tab */}
              {activeTab === 'gigs' && (
                <div className='adm-tab-pane adm-animated-fade-delayed'>
                  <div className="row mb-3 adm-search-row">
                    <div className="col-md-9">
                      <div className="input-group adm-search-input-group">
                        <span className="input-group-text adm-search-icon-span">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control adm-search-input"
                          placeholder="Search gigs..."
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-success w-100 adm-export-data-btn"
                        onClick={() => exportData('gigs')}
                      >
                        <i className="fas fa-download me-2"></i>Export Gigs
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive adm-table-responsive">
                    <table className="table table-hover adm-data-table">
                      <thead className="table-light adm-table-head">
                        <tr>
                          <th>Gig</th>
                          <th>Client</th>
                          <th>Budget</th>
                          <th>Status</th>
                          <th>Applications</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gigs.map((gig) => (
                          <tr key={gig.id} className="adm-table-row">
                            <td>
                              <div className='adm-table-cell-title'>
                                <div className="fw-bold">{gig.title}</div>
                                <small className="text-muted adm-table-cell-subtitle">
                                  {gig.skills?.slice(0, 3).join(', ')}
                                  {gig.skills?.length > 3 && ` +${gig.skills.length - 3} more`}
                                </small>
                              </div>
                            </td>
                            <td>{gig.client?.name}</td>
                            <td><span className='adm-budget-value'>{formatCurrency(gig.budget)}</span></td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(gig.status)} adm-status-badge`}>
                                {gig.status}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark adm-app-count-badge">
                                {gig.applicationCount || 0}
                              </span>
                            </td>
                            <td>{formatDate(gig.createdAt)}</td>
                            <td>
                              <div className="btn-group adm-action-group" role="group">
                                <button
                                  className="btn btn-outline-info btn-sm adm-action-icon-btn"
                                  title="View Details"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className={`btn btn-outline-${gig.featured ? 'warning' : 'success'} btn-sm adm-action-icon-btn`}
                                  onClick={() => handleGigAction(gig.id, 'feature')}
                                  title={gig.featured ? 'Unfeature' : 'Feature'}
                                >
                                  <i className={`fas fa-${gig.featured ? 'star-half-alt' : 'star'}`}></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm adm-action-icon-btn"
                                  onClick={() => handleGigAction(gig.id, 'remove')}
                                  title="Remove"
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
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className='adm-tab-pane adm-animated-fade-delayed'>
                  <div className="row mb-3 adm-search-row">
                    <div className="col-md-9">
                      <div className="input-group adm-search-input-group">
                        <span className="input-group-text adm-search-icon-span">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control adm-search-input"
                          placeholder="Search transactions..."
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-success w-100 adm-export-data-btn"
                        onClick={() => exportData('transactions')}
                      >
                        <i className="fas fa-download me-2"></i>Export Transactions
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive adm-table-responsive">
                    <table className="table table-hover adm-data-table">
                      <thead className="table-light adm-table-head">
                        <tr>
                          <th>Transaction ID</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="adm-table-row">
                            <td><span className='fw-bold text-primary'>#{transaction.id}</span></td>
                            <td>
                              <span className="badge bg-info adm-trans-type-badge">
                                {transaction.type.replace('_', ' ')}
                              </span>
                            </td>
                            <td><span className='adm-budget-value'>{formatCurrency(transaction.amount)}</span></td>
                            <td>{transaction.fromUser}</td>
                            <td>{transaction.toUser}</td>
                            <td>
                              <span className={`badge ${
                                transaction.status === 'completed' ? 'bg-success' :
                                transaction.status === 'pending' ? 'bg-warning' :
                                'bg-danger'
                              } adm-status-badge`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td>{formatDate(transaction.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {transactions.length === 0 && (
                    <div className="text-center py-4 adm-empty-state">
                      <i className="fas fa-credit-card fa-3x text-muted mb-3 adm-empty-icon"></i>
                      <h5 className='adm-empty-title'>No transactions found</h5>
                      <p className="text-muted adm-empty-message">There are no transactions to display</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <div className="row g-4 adm-tab-pane adm-animated-fade-delayed">
                  <div className="col-md-6 adm-col-report">
                    <div className="card adm-report-card">
                      <div className="card-header adm-card-header">
                        <h5 className="mb-0 adm-card-title">User Growth</h5>
                      </div>
                      <div className="card-body adm-chart-body">
                        <div className="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center adm-chart-placeholder" style={{height: '300px'}}>
                          <div className="text-center text-muted">
                            <i className="fas fa-chart-line fa-3x mb-3"></i>
                            <p>User growth chart will be displayed here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 adm-col-report">
                    <div className="card adm-report-card">
                      <div className="card-header adm-card-header">
                        <h5 className="mb-0 adm-card-title">Revenue Analytics</h5>
                      </div>
                      <div className="card-body adm-chart-body">
                        <div className="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center adm-chart-placeholder" style={{height: '300px'}}>
                          <div className="text-center text-muted">
                            <i className="fas fa-chart-bar fa-3x mb-3"></i>
                            <p>Revenue analytics chart will be displayed here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 adm-col-report">
                    <div className="card adm-report-card">
                      <div className="card-header adm-card-header">
                        <h5 className="mb-0 adm-card-title">Platform Statistics</h5>
                      </div>
                      <div className="card-body adm-stats-list-body">
                        <div className="row g-4">
                          <div className="col-md-4">
                            <div className="border rounded p-3 adm-stat-list-item">
                              <h6 className='adm-stat-list-title'>User Demographics</h6>
                              <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Freelancers</span>
                                  <span className="text-primary fw-bold">{stats.totalFreelancers}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Clients</span>
                                  <span className="text-success fw-bold">{stats.totalClients}</span>
                                </li>
                                <li className="d-flex justify-content-between adm-list-item">
                                  <span>Active Users</span>
                                  <span className="text-info fw-bold">{stats.activeUsers}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="border rounded p-3 adm-stat-list-item">
                              <h6 className='adm-stat-list-title'>Gig Breakdown</h6>
                              <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Total Gigs</span>
                                  <span className="text-primary fw-bold">{stats.totalGigs}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Open Gigs</span>
                                  <span className="text-warning fw-bold">{stats.openGigs}</span>
                                </li>
                                <li className="d-flex justify-content-between adm-list-item">
                                  <span>Completed Gigs</span>
                                  <span className="text-success fw-bold">{stats.completedGigs}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="border rounded p-3 adm-stat-list-item">
                              <h6 className='adm-stat-list-title'>Financials</h6>
                              <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Total Transactions</span>
                                  <span className="text-primary fw-bold">{formatNumber(stats.totalTransactions)}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2 adm-list-item">
                                  <span>Total Revenue</span>
                                  <span className="text-success fw-bold">{formatCurrency(stats.totalRevenue || 125000)}</span>
                                </li>
                                <li className="d-flex justify-content-between adm-list-item">
                                  <span>Monthly Growth</span>
                                  <span className="text-info fw-bold">{stats.monthlyGrowth}%</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="adm-tab-pane adm-animated-slide-delayed">
                  <SystemSettings />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;