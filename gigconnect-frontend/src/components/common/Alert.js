import React from 'react';
import { useAppContext } from '../../context/AppContext';

const Alert = () => {
  const { alert } = useAppContext();

  if (!alert.show) return null;

  const alertClass = `alert alert-${alert.type} custom-alert`;

  return (
    <div className="container mt-3">
      <div className={alertClass} role="alert">
        {alert.message}
      </div>
    </div>
  );
};

export default Alert;
