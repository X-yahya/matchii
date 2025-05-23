import React from 'react';

const ErrorState = ({ error }) => (
  <div className="error-container">
    <p className="error-title">Loading Error</p>
    <p className="error-message">{error.message}</p>
  </div>
);

export default ErrorState;