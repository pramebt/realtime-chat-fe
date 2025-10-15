'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle, AlertCircle } from 'lucide-react';
import { roomAPI } from '@/services/api';
import socketService from '@/services/socket';

const JoinRoomForm = ({ onRoomJoined, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await roomAPI.joinByCode(roomCode.trim());
      const room = response.data;
      
      // Join the room via socket
      socketService.joinRoom(room.id);
      
      setJoinedRoom(room);
      onRoomJoined(room); // Notify parent component
      
    } catch (error) {
      console.error('Failed to join room:', error);
      if (error.response?.status === 404) {
        setError('Room code not found. Please check the code and try again.');
      } else if (error.response?.status === 400) {
        setError('Invalid room code format.');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าร่วมห้อง');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRoomCode('');
    setJoinedRoom(null);
    setError('');
    onClose();
  };

  const handleJoinAnother = () => {
    setRoomCode('');
    setJoinedRoom(null);
    setError('');
  };

  if (joinedRoom) {
    return (
      <div className="mx-3 lg:mx-4 mb-3 lg:mb-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Successfully Joined!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-green-700">
                You've joined: <strong>{joinedRoom.name}</strong>
              </p>
              <Badge variant="secondary" className="bg-white text-green-800 border-green-300 font-mono mt-1">
                {joinedRoom.roomCode}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleJoinAnother}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-8"
              >
                Join Another Room
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-green-300 rounded-xl hover:bg-green-100 h-8"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Room Code
          </label>
          <Input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code (e.g., A9F3D2)"
            disabled={loading}
            className="border-gray-200 rounded-xl focus:border-primary h-10 font-mono text-center text-lg tracking-wider"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            size="sm"
            disabled={loading || !roomCode.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100 h-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinRoomForm;
