// gigconnect-frontend/src/pages/MessagesPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Messages from '../components/messaging/Messages';

const MessagesPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="messages-page-wrapper">
      <Messages />
    </div>
  );
};

export default MessagesPage;