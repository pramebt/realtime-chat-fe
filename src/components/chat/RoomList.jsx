'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MessageSquare } from 'lucide-react';
import { roomAPI } from '@/services/api';

const RoomList = ({ rooms, selectedRoom, onRoomSelect, onRoomCreate }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    setLoading(true);
    try {
      await roomAPI.createRoom(roomName.trim());
      setRoomName('');
      setShowCreateForm(false);
      onRoomCreate(); // Reload room list
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Create Room Button */}
      <div className="p-4">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl"
          variant="default"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl">
          <form onSubmit={handleCreateRoom} className="space-y-3">
            <Input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Conversation name"
              disabled={loading}
              className="border-gray-200 rounded-xl focus:border-primary"
            />
            <div className="flex space-x-2">
              <Button
                type="submit"
                size="sm"
                disabled={loading || !roomName.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setRoomName('');
                }}
                className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`cursor-pointer transition-all duration-200 rounded-xl p-4 ${
                  selectedRoom?.id === room.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onRoomSelect(room)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${
                      selectedRoom?.id === room.id ? 'text-primary' : 'text-gray-900'
                    }`}>
                      {room.name}
                    </h3>
                    <p className={`text-sm truncate ${
                      selectedRoom?.id === room.id ? 'text-primary/70' : 'text-gray-500'
                    }`}>
                      {new Date(room.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    selectedRoom?.id === room.id ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
