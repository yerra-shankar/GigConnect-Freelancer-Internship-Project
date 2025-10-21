// Loading.js

import React from 'react';

const Loading = () => {
  return (
    <div className="loading-overlay loading-centered">
      <div className="loading-content">
        <div className="spinner-border text-primary custom-spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="loading-text">Loading...</div>
      </div>
    </div>
  );
};

export default Loading;