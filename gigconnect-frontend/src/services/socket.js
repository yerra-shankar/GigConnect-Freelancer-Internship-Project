import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
        this.isConnected = true;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('🔴 Socket connection error:', error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      });

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('🔌 Socket disconnected');
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      console.log('📤 Socket emit:', event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, (data) => {
        console.log('📥 Socket receive:', event, data);
        callback(data);
      });
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Convenience methods for common events
  joinRoom(roomId) {
    this.emit('join_room', { roomId });
  }

  leaveRoom(roomId) {
    this.emit('leave_room', { roomId });
  }

  sendMessage(messageData) {
    this.emit('message', messageData);
  }

  startTyping(conversationId, userId) {
    this.emit('typing', { conversationId, userId });
  }

  stopTyping(conversationId, userId) {
    this.emit('stop_typing', { conversationId, userId });
  }

  // Get connection status
  isSocketConnected() {
    return this.socket && this.isConnected;
  }
}

// Create and export singleton instance
const socketService = new SocketService();
export default socketService;
