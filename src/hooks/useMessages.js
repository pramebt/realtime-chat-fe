import { useState, useEffect, useCallback } from 'react';
import { messageAPI } from '@/services/api';
import socketService from '@/services/socket';

/**
 * Custom hook สำหรับจัดการ messages ในห้อง
 */
export const useMessages = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load messages from API
  const loadMessages = useCallback(async () => {
    if (!roomId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await messageAPI.getMessages(roomId);
      setMessages(response.data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // Send message
  const sendMessage = useCallback(async (content, userId) => {
    if (!roomId || !content.trim()) return;
    
    try {
      // Send via API first
      const response = await messageAPI.sendMessage(content, roomId, userId);
      const newMessage = response.data;
      
      // Add to local state immediately for better UX
      setMessages(prev => [...prev, newMessage]);
      
      return newMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw new Error(err.response?.data?.message || 'Failed to send message');
    }
  }, [roomId]);

  // Load messages on mount and room change
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Listen for real-time messages
  useEffect(() => {
    if (!roomId) return;

    const handleReceiveMessage = (message) => {
      // Only add message if it's for current room
      if (message.roomId === roomId) {
        setMessages(prev => {
          // Check if message already exists (prevent duplicates)
          const exists = prev.some(msg => msg.id === message.id);
          if (exists) return prev;
          
          return [...prev, message];
        });
      }
    };

    const handleUserJoined = (data) => {
      console.log(`👤 User joined room ${roomId}:`, data.username);
    };

    const handleUserLeft = (data) => {
      console.log(`👤 User left room ${roomId}:`, data.username);
    };

    // Join room
    socketService.joinRoom(roomId);

    // Listen to socket events
    socketService.onReceiveMessage(handleReceiveMessage);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);

    // Cleanup
    return () => {
      socketService.leaveRoom(roomId);
    };
  }, [roomId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: loadMessages
  };
};
