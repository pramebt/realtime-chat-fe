'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { roomAPI } from '@/services/api';
import { Copy, Check } from 'lucide-react';

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
      alert('เกิดข้อผิดพลาดในการสร้างห้อง');
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
      <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-green-50 rounded-xl border border-green-200">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-6 w-6 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800">Room Created!</h3>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Share this code with others:</p>
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-xl font-bold tracking-wider text-gray-800">
                {createdRoom.code}
              </div>
              <Button
                onClick={copyRoomCode}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Room: {createdRoom.name}
            </p>
          </div>
          
          <Button
            onClick={handleCloseAfterCreate}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

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
