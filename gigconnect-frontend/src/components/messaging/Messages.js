
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { messageAPI } from '../../services/api';
import socketService from '../../services/socket';
import { getInitials, formatRelativeTime } from '../../utils/helpers';

const Messages = () => {
  const { user, showAlert, setLoading } = useAppContext();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedConversationRef = useRef(null);

  const handleNewMessage = useCallback((message) => {
    if (selectedConversationRef.current && message.conversationId === selectedConversationRef.current.id) {
      setMessages(prev => [...prev, message]);
    }
    setConversations(prev => 
      prev.map(conv => 
        conv.id === message.conversationId ? { ...conv, lastMessage: message } : conv
      )
    );
  }, []);

  const handleTyping = useCallback((data) => {
    if (selectedConversationRef.current && data.conversationId === selectedConversationRef.current.id && data.userId !== user?.id) {
      setIsTyping(true);
    }
  }, [user]);

  const handleStopTyping = useCallback((data) => {
    if (selectedConversationRef.current && data.conversationId === selectedConversationRef.current.id) {
      setIsTyping(false);
    }
  }, []);

  const handleUserOnline = useCallback((userId) => {
    setOnlineUsers(prev => [...new Set([...prev, userId])]);
  }, []);

  const handleUserOffline = useCallback((userId) => {
    setOnlineUsers(prev => prev.filter(id => id !== userId));
  }, []);

  const initializeSocket = useCallback(() => {
    if (!user) return;
    socketService.connect(user.token);

    socketService.on('message', handleNewMessage);
    socketService.on('typing', handleTyping);
    socketService.on('stop_typing', handleStopTyping);
    socketService.on('user_online', handleUserOnline);
    socketService.on('user_offline', handleUserOffline);
  }, [user, handleNewMessage, handleTyping, handleStopTyping, handleUserOnline, handleUserOffline]);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      showAlert('Failed to fetch conversations', 'danger');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, showAlert]);

  useEffect(() => {
    if (user) {
      initializeSocket();
      fetchConversations();
    }

    return () => {
      if (socketService.socket) {
        socketService.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [user, initializeSocket, fetchConversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
 

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messageAPI.getMessages(conversationId);
      setMessages(response.data || []);
    } catch (error) {
      showAlert('Failed to fetch messages', 'danger');
      setMessages([]);
    }
  };

  // Handler functions are declared above as stable useCallback hooks

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const messageData = {
      conversationId: selectedConversation.id,
      content: newMessage.trim(),
      receiverId: selectedConversation.otherUser.id
    };

    const optimisticId = `temp-${Date.now()}`;

    try {
      // Optimistically add message to UI
      const optimisticMessage = {
        id: optimisticId,
        content: newMessage.trim(),
        senderId: user.id,
        createdAt: new Date().toISOString(),
        sending: true
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      // Send to server
      const response = await messageAPI.sendMessage(messageData);
      socketService.emit('message', messageData);
      
      // Update message as sent with real ID
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticId 
            ? { ...response.data, sending: false }
            : msg
        )
      );

    } catch (error) {
      showAlert('Failed to send message', 'danger');
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      setNewMessage(messageData.content); // Restore message
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    socketService.emit('join_room', conversation.id);
  };

  const handleTypingStart = () => {
    if (selectedConversation) {
      socketService.emit('typing', {
        conversationId: selectedConversation.id,
        userId: user.id
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socketService.emit('stop_typing', {
          conversationId: selectedConversation.id,
          userId: user.id
        });
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (!user) {
    return (
      <div className="messages-page">
        <div className="container mt-4">
          <div className="alert alert-warning warning-box">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Please login to access messages.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="container-fluid mt-4 messages-container">
        <div className="row">
          <div className="col-12">
            <div className="page-header1">
              <h2 className="page-title">
                <i className="fas fa-comments me-3 messages-icon"></i>
                Messages
              </h2>
              <p className="page-subtitle">Chat with freelancers and clients</p>
            </div>
          </div>
        </div>
        
        <div className="row messages-row">
          {/* Conversations List */}
          <div className="col-10 col-md-10 col-lg-8 conversations-column">
            <div className="card h-100 conversations-card">
              <div className="card-header conversations-header">
                <h5 className="mb-0 header-title">
                  <i className="fas fa-inbox me-2"></i>
                  Conversations
                </h5>
              </div>
              <div className="card-body p-0 conversations-body">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted empty-state">
                    <div className="empty-icon-wrapper">
                      <i className="fas fa-comments fa-3x mb-3 empty-icon"></i>
                    </div>
                    <h6 className="empty-title">No conversations yet</h6>
                    <p className="small empty-text">
                      Start messaging freelancers or clients to see conversations here.
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`conversation-item ${
                        selectedConversation?.id === conversation.id ? 'active' : ''
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative avatar-wrapper">
                          <div className="conversation-avatar">
                            {conversation.otherUser.avatar ? (
                              <img src={conversation.otherUser.avatar} alt={conversation.otherUser.name} />
                            ) : (
                              <span className="avatar-initials">
                                {getInitials(conversation.otherUser.name)}
                              </span>
                            )}
                          </div>
                          {isUserOnline(conversation.otherUser.id) && (
                            <span className="online-indicator"></span>
                          )}
                        </div>
                        <div className="flex-grow-1 min-w-0 conversation-details">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1 text-truncate conversation-name">
                              {conversation.otherUser.name}
                            </h6>
                            {conversation.lastMessage && (
                              <small className="text-muted conversation-time">
                                {formatRelativeTime(conversation.lastMessage.createdAt)}
                              </small>
                            )}
                          </div>
                          <p className="mb-0 text-muted small text-truncate last-message">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-1">
                            <span className={`badge role-badge ${
                              conversation.otherUser.role === 'freelancer' ? 'badge-freelancer' : 'badge-client'
                            }`}>
                              {conversation.otherUser.role}
                            </span>
                            {isUserOnline(conversation.otherUser.id) && (
                              <small className="text-success online-status">
                                <i className="fas fa-circle me-1 online-dot"></i>
                                Online
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-md-10 col-lg-9 chat-column">
            <div className="card h-100 chat-card">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="card-header chat-header">
                    <div className="d-flex align-items-center">
                      <div className="chat-avatar">
                        {selectedConversation.otherUser.avatar ? (
                          <img src={selectedConversation.otherUser.avatar} alt={selectedConversation.otherUser.name} />
                        ) : (
                          <span className="avatar-initials">
                            {getInitials(selectedConversation.otherUser.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex-grow-1 chat-header-info">
                        <h5 className="mb-0 chat-name">{selectedConversation.otherUser.name}</h5>
                        <small className="chat-status">
                          <span className={`badge role-badge ${
                            selectedConversation.otherUser.role === 'freelancer' ? 'badge-freelancer' : 'badge-client'
                          }`}>
                            {selectedConversation.otherUser.role}
                          </span>
                          {isUserOnline(selectedConversation.otherUser.id) ? (
                            <span className="text-success ms-2 online-text">
                              <i className="fas fa-circle me-1 online-dot"></i>
                              Online
                            </span>
                          ) : (
                            <span className="text-muted ms-2 offline-text">Offline</span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="card-body chat-messages-container">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted mt-5 empty-chat">
                        <i className="fas fa-comments fa-3x mb-3 empty-chat-icon"></i>
                        <h5 className="empty-chat-title">Start the conversation!</h5>
                        <p className="empty-chat-text">
                          Send your first message to {selectedConversation.otherUser.name}
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`message-wrapper ${
                            message.senderId === user.id ? 'message-sent' : 'message-received'
                          }`}
                        >
                          <div className="message-content">
                            {message.senderId !== user.id && (
                              <div className="message-avatar">
                                {selectedConversation.otherUser.avatar ? (
                                  <img src={selectedConversation.otherUser.avatar} alt="" />
                                ) : (
                                  <span className="avatar-initials-small">
                                    {getInitials(selectedConversation.otherUser.name)}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className={`message-bubble ${message.sending ? 'sending' : ''}`}>
                              <div className="message-text">{message.content}</div>
                              {message.sending && (
                                <div className="message-spinner">
                                  <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Sending...</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {message.senderId === user.id && (
                              <div className="message-avatar">
                                {user.avatar ? (
                                  <img src={user.avatar} alt="" />
                                ) : (
                                  <span className="avatar-initials-small">
                                    {getInitials(user.name)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="message-time">
                            {formatRelativeTime(message.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Typing indicator */}
                    {isTyping && (
                      <div className="typing-indicator">
                        <div className="message-avatar">
                          {selectedConversation.otherUser.avatar ? (
                            <img src={selectedConversation.otherUser.avatar} alt="" />
                          ) : (
                            <span className="avatar-initials-small">
                              {getInitials(selectedConversation.otherUser.name)}
                            </span>
                          )}
                        </div>
                        <div className="typing-bubble">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef}></div>
                  </div>
                  
                  {/* Message Input */}
                  <div className="card-footer chat-input-footer">
                    <form className="chat-input-form" onSubmit={sendMessage}>
                      <input
                        type="text"
                        className="form-control chat-input"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={handleTypingStart}
                        autoComplete="off"
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary send-button" 
                        disabled={!newMessage.trim()}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-100 d-flex flex-column justify-content-center align-items-center no-conversation-selected">
                  <i className="fas fa-comments fa-4x mb-3 select-icon"></i>
                  <h5 className="select-title">Select a conversation to start chatting</h5>
                  <p className="select-text">Choose a contact from the left to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;