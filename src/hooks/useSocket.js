import { useEffect, useState, useCallback } from 'react';
import socketService from '@/services/socket';

/**
 * Custom hook สำหรับจัดการ Socket.IO connection
 */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const handleConnect = () => {
      console.log('🔌 Socket connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    };

    const handleError = (error) => {
      console.error('🔌 Socket error:', error);
      setIsConnected(false);
    };

    // Get socket instance from service
    const socketInstance = socketService.socket;
    setSocket(socketInstance);

    // Check initial connection status
    setIsConnected(socketService.getConnectionStatus());

    // Listen to connection events
    if (socketInstance) {
      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('connect_error', handleError);
    }

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.off('connect', handleConnect);
        socketInstance.off('disconnect', handleDisconnect);
        socketInstance.off('connect_error', handleError);
      }
    };
  }, []);

  // Join room function
  const joinRoom = useCallback((roomId) => {
    if (isConnected) {
      console.log(`🔌 Joining room: ${roomId}`);
      socketService.joinRoom(roomId);
    }
  }, [isConnected]);

  // Leave room function
  const leaveRoom = useCallback((roomId) => {
    if (isConnected) {
      console.log(`🔌 Leaving room: ${roomId}`);
      socketService.leaveRoom(roomId);
    }
  }, [isConnected]);

  // Send message function
  const sendMessage = useCallback((content, roomId, userId) => {
    if (isConnected) {
      console.log(`🔌 Sending message to room ${roomId}:`, content);
      socketService.sendMessage(roomId, content);
    }
  }, [isConnected]);

  return {
    socket,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage
  };
};
