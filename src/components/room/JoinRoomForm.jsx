'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomAPI } from '@/services/api';
import { Key } from 'lucide-react';

const JoinRoomForm = ({ onRoomJoin, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    setLoading(true);
    try {
      const response = await roomAPI.joinByCode(roomCode.trim().toUpperCase());
      const room = response.data;
      
      alert(`เข้าร่วมห้อง "${room.name}" สำเร็จ!`);
      setRoomCode('');
      onRoomJoin(room); // Pass the joined room to parent
      onClose(); // Close form
    } catch (error) {
      console.error('Failed to join room:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        alert('ไม่พบห้องที่ระบุ กรุณาตรวจสอบรหัสห้อง');
      } else if (error.response?.status === 400) {
        alert('รหัสห้องไม่ถูกต้อง');
      } else {
        alert('เกิดข้อผิดพลาดในการเข้าร่วมห้อง กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRoomCode('');
    onClose();
  };

  const handleCodeChange = (e) => {
    // Convert to uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().slice(0, 6);
    setRoomCode(value);
  };

  return (
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={roomCode}
            onChange={handleCodeChange}
            placeholder="Enter Room Code (e.g., A1B2C3)"
            disabled={loading}
            maxLength={6}
            className="pl-10 border-gray-200 rounded-xl focus:border-primary h-10 text-center tracking-widest font-mono text-base"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            type="submit"
            size="sm"
            disabled={loading || roomCode.trim().length !== 6}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-8"
          >
            {loading ? 'Joining...' : 'Join Room'}
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

export default JoinRoomForm;
