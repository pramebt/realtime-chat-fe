'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomAPI } from '@/services/api';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const CreateRoomForm = ({ onRoomCreate, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      const response = await roomAPI.createRoom(roomName.trim());
      setCreatedRoom(response.data);
    } catch (error) {
      console.error('Failed to create room:', error);
      toast.error('เกิดข้อผิดพลาดในการสร้างห้อง');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRoomName('');
    setCreatedRoom(null);
    onClose();
  };

  const handleCloseAfterCreate = () => {
    setRoomName('');
    setCreatedRoom(null);
    onRoomCreate(); // Reload room list
    onClose();
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(createdRoom.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Show room code if room was created
  if (createdRoom) {
    return (
      <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-6 lg:p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
              <Check className="h-6 w-6 text-white stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">Room Created</h3>
          </div>
          
          {/* Room Code */}
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-500 font-normal">
              Share this code with others
            </p>
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-gray-50 px-6 py-3 rounded-xl font-mono text-2xl font-semibold tracking-[0.25em] text-gray-900">
                {createdRoom.code}
              </div>
              <Button
                onClick={copyRoomCode}
                size="sm"
                variant="ghost"
                className="h-10 w-10 p-0 hover:bg-gray-100 rounded-xl transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-blue-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-normal">
              {createdRoom.name}
            </p>
          </div>
          
          {/* Done Button */}
          <div className="pt-2">
            <Button
              onClick={handleCloseAfterCreate}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-11 font-medium shadow-sm transition-colors"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-6 lg:p-8 bg-white rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 block">
            Room Name
          </label>
          <Input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter conversation name"
            disabled={loading}
            className="border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-11 text-base transition-colors"
          />
        </div>
        
        <div className="flex space-x-3 pt-1">
          <Button
            type="submit"
            disabled={loading || !roomName.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-11 font-medium shadow-sm transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {loading ? 'Creating...' : 'Create Room'}
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

export default CreateRoomForm;
