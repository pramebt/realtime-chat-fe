'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomAPI } from '@/services/api';
import { Key } from 'lucide-react';
import { toast } from 'sonner';

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
      
      toast.success(`เข้าร่วมห้อง "${room.name}" สำเร็จ!`);
      setRoomCode('');
      onRoomJoin(room); // Pass the joined room to parent
      onClose(); // Close form
    } catch (error) {
      console.error('Failed to join room:', error);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        toast.error('ไม่พบห้องที่ระบุ กรุณาตรวจสอบรหัสห้อง');
      } else if (error.response?.status === 400) {
        toast.error('รหัสห้องไม่ถูกต้อง');
      } else {
        toast.error('เกิดข้อผิดพลาดในการเข้าร่วมห้อง กรุณาลองใหม่อีกครั้ง');
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
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-6 lg:p-8 bg-white rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 block">
            Room Code
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={roomCode}
              onChange={handleCodeChange}
              placeholder="A1B2C3"
              disabled={loading}
              maxLength={6}
              className="pl-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-11 text-center tracking-[0.3em] font-mono text-lg font-semibold transition-colors"
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            Enter the 6-character room code
          </p>
        </div>
        
        <div className="flex space-x-3 pt-1">
          <Button
            type="submit"
            disabled={loading || roomCode.trim().length !== 6}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-11 font-medium shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="flex-1 rounded-xl hover:bg-gray-100 h-11 font-medium text-gray-700 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JoinRoomForm;
