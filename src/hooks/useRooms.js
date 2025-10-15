import { useState, useEffect, useCallback } from 'react';
import { roomAPI } from '@/services/api';

/**
 * Custom hook สำหรับจัดการ rooms data
 */
export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load rooms from API
  const loadRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data || []);
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create room with code
  const createRoom = useCallback(async (name) => {
    try {
      const response = await roomAPI.createRoomWithCode(name);
      return response.data;
    } catch (err) {
      console.error('Failed to create room:', err);
      throw new Error(err.response?.data?.message || 'Failed to create room');
    }
  }, []);

  // Join room by code
  const joinRoom = useCallback(async (roomCode) => {
    try {
      const response = await roomAPI.joinByCode(roomCode);
      return response.data;
    } catch (err) {
      console.error('Failed to join room:', err);
      throw new Error(err.response?.data?.message || 'Failed to join room');
    }
  }, []);

  // Create private room
  const createPrivateRoom = useCallback(async (targetUserId) => {
    try {
      const response = await roomAPI.createPrivateRoom(targetUserId);
      return response.data;
    } catch (err) {
      console.error('Failed to create private room:', err);
      throw new Error(err.response?.data?.message || 'Failed to create private room');
    }
  }, []);

  // Delete room
  const deleteRoom = useCallback(async (roomId) => {
    try {
      await roomAPI.deleteRoom(roomId);
      // Remove from local state
      setRooms(prev => prev.filter(room => room.id !== roomId));
    } catch (err) {
      console.error('Failed to delete room:', err);
      throw new Error(err.response?.data?.message || 'Failed to delete room');
    }
  }, []);

  // Update room
  const updateRoom = useCallback(async (roomId, name) => {
    try {
      const response = await roomAPI.updateRoom(roomId, name);
      // Update local state
      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, name } : room
      ));
      return response.data;
    } catch (err) {
      console.error('Failed to update room:', err);
      throw new Error(err.response?.data?.message || 'Failed to update room');
    }
  }, []);

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    loading,
    error,
    refetch: loadRooms,
    createRoom,
    joinRoom,
    createPrivateRoom,
    deleteRoom,
    updateRoom
  };
};
