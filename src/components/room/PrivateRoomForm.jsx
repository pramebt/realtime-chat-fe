'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Lock } from 'lucide-react';
import { roomAPI } from '@/services/api';

const PrivateRoomForm = ({ onRoomCreate, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const response = await roomAPI.createRoomWithCode(roomName.trim());
      setCreatedRoom(response.data);
      onRoomCreate(); // Reload room list
    } catch (error) {
      console.error('Failed to create private room:', error);
      alert('เกิดข้อผิดพลาดในการสร้างห้องส่วนตัว');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (createdRoom?.roomCode) {
      try {
        await navigator.clipboard.writeText(createdRoom.roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = createdRoom.roomCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleClose = () => {
    setRoomName('');
    setCreatedRoom(null);
    setCopied(false);
    onClose();
  };

  const handleJoinRoom = () => {
    if (createdRoom) {
      // Emit join room event via socket
      window.location.reload(); // Simple way to refresh and join the room
    }
  };

  if (createdRoom) {
    return (
      <div className="mx-3 lg:mx-4 mb-3 lg:mb-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 text-sm flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Private Room Created!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-green-700 mb-2">Room: <strong>{createdRoom.name}</strong></p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600">Room Code:</span>
                <Badge variant="secondary" className="bg-white text-green-800 border-green-300 font-mono">
                  {createdRoom.roomCode}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="h-6 px-2 text-xs border-green-300 hover:bg-green-100"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={handleJoinRoom}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl h-8"
              >
                Join Room
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
            Private Room Name
          </label>
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            disabled={loading}
            className="border-gray-200 rounded-xl focus:border-primary h-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            size="sm"
            disabled={loading || !roomName.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8"
          >
            {loading ? 'Creating...' : 'Create Private Room'}
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

export default PrivateRoomForm;
