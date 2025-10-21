

// SystemSettings.js

import React, { useState } from 'react';

const SystemSettings = () => {
  // Mock showAlert function for demo purposes
  const showAlert = (message, type) => {
    alert(`${type.toUpperCase()}: ${message}`);
  };
  const [settings, setSettings] = useState({
    platformName: 'GigConnect',
    platformUrl: 'https://gigconnect.com',
    description: 'Connecting local freelancers with clients worldwide',
    commissionRate: 10,
    minGigBudget: 50,
    maxGigBudget: 50000,
    allowRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    // Email settings
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@gigconnect.com',
    // Security settings
    minPasswordLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecialChar: false,
    sessionTimeout: 30,
    enable2FA: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e, section) => {
    e.preventDefault();
    
    try {
      // Here you would make an API call to save settings
      // await adminAPI.updateSettings(section, settings);
      
      showAlert(`${section} settings saved successfully!`, 'success');
    } catch (error) {
      showAlert(`Failed to save ${section} settings`, 'danger');
    }
  };

  const testEmailSettings = async () => {
    try {
      // Here you would test the email configuration
      // await adminAPI.testEmailSettings(settings);
      
      showAlert('Test email sent successfully! Check your inbox.', 'success');
    } catch (error) {
      showAlert('Failed to send test email. Please check your settings.', 'danger');
    }
  };

  return (
    <div className="row system-settings-wrapper">
      <div className="col-lg-8">
        {/* Platform Settings */}
        <div className="card mb-4 settings-card platform-card">
          <div className="card-header settings-card-header">
            <h5 className="mb-0 settings-title">
              <i className="fas fa-cog me-2 settings-icon"></i>Platform Settings
            </h5>
          </div>
          <div className="card-body settings-card-body">
            <form onSubmit={(e) => handleSubmit(e, 'platform')}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label settings-label">Platform Name</label>
                  <input
                    type="text"
                    className="form-control settings-input"
                    name="platformName"
                    value={settings.platformName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label settings-label">Platform URL</label>
                  <input
                    type="url"
                    className="form-control settings-input"
                    name="platformUrl"
                    value={settings.platformUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label settings-label">Platform Description</label>
                <textarea
                  className="form-control settings-textarea"
                  name="description"
                  rows="3"
                  value={settings.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label settings-label">Commission Rate (%)</label>
                  <input
                    type="number"
                    className="form-control settings-input"
                    name="commissionRate"
                    min="0"
                    max="50"
                    value={settings.commissionRate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label settings-label">Minimum Gig Budget ($)</label>
                  <input
                    type="number"
                    className="form-control settings-input"
                    name="minGigBudget"
                    min="1"
                    value={settings.minGigBudget}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label settings-label">Maximum Gig Budget ($)</label>
                  <input
                    type="number"
                    className="form-control settings-input"
                    name="maxGigBudget"
                    min="100"
                    value={settings.maxGigBudget}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <div className="form-check form-switch settings-switch">
                  <input
                    className="form-check-input settings-switch-input"
                    type="checkbox"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-switch-label">Allow new user registrations</label>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="form-check form-switch settings-switch">
                  <input
                    className="form-check-input settings-switch-input"
                    type="checkbox"
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-switch-label">Require email verification</label>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="form-check form-switch settings-switch">
                  <input
                    className="form-check-input settings-switch-input"
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-switch-label">Enable real-time notifications</label>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="form-check form-switch settings-switch maintenance-switch">
                  <input
                    className="form-check-input settings-switch-input maintenance-input"
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-switch-label">Maintenance mode</label>
                </div>
                <small className="text-muted settings-help-text">Temporarily disable the platform for maintenance</small>
              </div>
              
              <button type="submit" className="btn btn-primary settings-primary-btn">
                <i className="fas fa-save me-2"></i>Save Platform Settings
              </button>
            </form>
          </div>
        </div>
        
        {/* Email Settings */}
        <div className="card mb-4 settings-card email-card">
          <div className="card-header settings-card-header">
            <h5 className="mb-0 settings-title">
              <i className="fas fa-envelope me-2 settings-icon"></i>Email Settings
            </h5>
          </div>
          <div className="card-body settings-card-body">
            <form onSubmit={(e) => handleSubmit(e, 'email')}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label settings-label">SMTP Host</label>
                  <input
                    type="text"
                    className="form-control settings-input"
                    name="smtpHost"
                    placeholder="smtp.example.com"
                    value={settings.smtpHost}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label settings-label">Port</label>
                  <input
                    type="number"
                    className="form-control settings-input"
                    name="smtpPort"
                    value={settings.smtpPort}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label settings-label">Encryption</label>
                  <select
                    className="form-select settings-select"
                    name="smtpEncryption"
                    value={settings.smtpEncryption}
                    onChange={handleChange}
                  >
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label settings-label">Username</label>
                  <input
                    type="email"
                    className="form-control settings-input"
                    name="smtpUsername"
                    value={settings.smtpUsername}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label settings-label">Password</label>
                  <input
                    type="password"
                    className="form-control settings-input"
                    name="smtpPassword"
                    value={settings.smtpPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label settings-label">From Email</label>
                <input
                  type="email"
                  className="form-control settings-input"
                  name="fromEmail"
                  value={settings.fromEmail}
                  onChange={handleChange}
                />
              </div>
              
              <div className="d-flex gap-2 settings-btn-group">
                <button type="submit" className="btn btn-primary settings-primary-btn">
                  <i className="fas fa-save me-2"></i>Save Email Settings
                </button>
                <button type="button" className="btn btn-outline-secondary settings-secondary-btn" onClick={testEmailSettings}>
                  <i className="fas fa-paper-plane me-2"></i>Test Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Security & System Info Sidebar */}
      <div className="col-lg-4">
        {/* Security Settings */}
        <div className="card mb-4 settings-card security-card">
          <div className="card-header settings-card-header">
            <h5 className="mb-0 settings-title">
              <i className="fas fa-shield-alt me-2 settings-icon"></i>Security Settings
            </h5>
          </div>
          <div className="card-body settings-card-body">
            <form onSubmit={(e) => handleSubmit(e, 'security')}>
              <div className="mb-3">
                <label className="form-label settings-label">Password Policy</label>
                <div className="form-check settings-checkbox">
                  <input
                    className="form-check-input settings-checkbox-input"
                    type="checkbox"
                    name="requireUppercase"
                    checked={settings.requireUppercase}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-checkbox-label">Require uppercase letter</label>
                </div>
                <div className="form-check settings-checkbox">
                  <input
                    className="form-check-input settings-checkbox-input"
                    type="checkbox"
                    name="requireNumber"
                    checked={settings.requireNumber}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-checkbox-label">Require number</label>
                </div>
                <div className="form-check settings-checkbox">
                  <input
                    className="form-check-input settings-checkbox-input"
                    type="checkbox"
                    name="requireSpecialChar"
                    checked={settings.requireSpecialChar}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-checkbox-label">Require special character</label>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label settings-label">Minimum Password Length</label>
                <input
                  type="number"
                  className="form-control settings-input"
                  name="minPasswordLength"
                  min="6"
                  max="50"
                  value={settings.minPasswordLength}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label settings-label">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="form-control settings-input"
                  name="sessionTimeout"
                  min="5"
                  max="1440"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <div className="form-check form-switch settings-switch">
                  <input
                    className="form-check-input settings-switch-input"
                    type="checkbox"
                    name="enable2FA"
                    checked={settings.enable2FA}
                    onChange={handleChange}
                  />
                  <label className="form-check-label settings-switch-label">Enable two-factor authentication</label>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 settings-primary-btn">
                <i className="fas fa-shield-alt me-2"></i>Update Security
              </button>
            </form>
          </div>
        </div>
        
        {/* System Information */}
        <div className="card mb-4 settings-card system-info-card">
          <div className="card-header settings-card-header">
            <h5 className="mb-0 settings-title">
              <i className="fas fa-server me-2 settings-icon"></i>System Information
            </h5>
          </div>
          <div className="card-body settings-card-body">
            <div className="mb-2 settings-info-item">
              <small className="text-muted settings-info-label">Version</small>
              <div className="fw-bold settings-info-value">v1.0.0</div>
            </div>
            <div className="mb-2 settings-info-item">
              <small className="text-muted settings-info-label">Server Uptime</small>
              <div className="settings-info-value">15 days, 6 hours</div>
            </div>
            <div className="mb-2 settings-info-item">
              <small className="text-muted settings-info-label">Memory Usage</small>
              <div className="progress mb-1 settings-progress" style={{height: '8px'}}>
                <div className="progress-bar settings-progress-bar" style={{width: '45%'}}></div>
              </div>
              <small className="text-muted settings-info-text">45% (2.1GB / 4GB)</small>
            </div>
            <div className="mb-3 settings-info-item">
              <small className="text-muted settings-info-label">CPU Usage</small>
              <div className="progress mb-1 settings-progress" style={{height: '8px'}}>
                <div className="progress-bar bg-warning settings-progress-bar-warning" style={{width: '23%'}}></div>
              </div>
              <small className="text-muted settings-info-text">23%</small>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-info btn-sm settings-info-btn">
                <i className="fas fa-chart-line me-2"></i>View Details
              </button>
              <button className="btn btn-outline-warning btn-sm settings-warning-btn">
                <i className="fas fa-tools me-2"></i>System Maintenance
              </button>
            </div>
          </div>
        </div>
        
        {/* Database Management */}
        <div className="card settings-card database-card">
          <div className="card-header settings-card-header">
            <h5 className="mb-0 settings-title">
              <i className="fas fa-database me-2 settings-icon"></i>Database Management
            </h5>
          </div>
          <div className="card-body settings-card-body">
            <div className="mb-2 settings-info-item">
              <small className="text-muted settings-info-label">Last Backup</small>
              <div className="settings-info-value">2 hours ago</div>
            </div>
            <div className="mb-3 settings-info-item">
              <small className="text-muted settings-info-label">Database Size</small>
              <div className="fw-bold text-info settings-db-size">2.4 GB</div>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary btn-sm settings-db-btn">
                <i className="fas fa-download me-2"></i>Create Backup
              </button>
              <button className="btn btn-outline-success btn-sm settings-success-btn">
                <i className="fas fa-upload me-2"></i>Restore Backup
              </button>
              <button className="btn btn-outline-warning btn-sm settings-warning-btn">
                <i className="fas fa-broom me-2"></i>Clean Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;