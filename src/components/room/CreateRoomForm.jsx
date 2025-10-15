'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomAPI } from '@/services/api';

const CreateRoomForm = ({ onRoomCreate, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const response = await roomAPI.createRoomWithCode(roomName.trim());
      const roomCode = response.data.roomCode;
      alert(`ห้อง "${roomName.trim()}" สร้างสำเร็จ!\nรหัสห้อง: ${roomCode}`);
      setRoomName('');
      onRoomCreate(); // Reload room list
      onClose(); // Close form
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('เกิดข้อผิดพลาดในการสร้างห้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRoomName('');
    onClose();
  };

  return (
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Conversation name"
          disabled={loading}
          className="border-gray-200 rounded-xl focus:border-primary h-10"
        />
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            size="sm"
            disabled={loading || !roomName.trim()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8"
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCancel}
            className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100 h-8"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoomForm;
