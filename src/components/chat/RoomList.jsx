'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MessageSquare, Trash2, MoreVertical, Edit2, Check, X } from 'lucide-react';
import { roomAPI } from '@/services/api';

const RoomList = ({ rooms, selectedRoom, onRoomSelect, onRoomCreate, onRoomDeleted }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [showRoomMenu, setShowRoomMenu] = useState(null);

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

  const handleDeleteRoom = async (roomId) => {
    setDeletingRoomId(roomId);
    try {
      await roomAPI.deleteRoom(roomId);
      // If the deleted room was selected, notify parent
      if (selectedRoom?.id === roomId) {
        onRoomDeleted?.(roomId);
      }
      onRoomCreate(); // Reload room list
    } catch (error) {
      console.error('Failed to delete room:', error);
    } finally {
      setDeletingRoomId(null);
      setShowDeleteConfirm(null);
    }
  };

  const confirmDelete = (roomId, e) => {
    e.stopPropagation(); // Prevent room selection
    setShowDeleteConfirm(roomId);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  const handleEditRoom = async (roomId) => {
    if (!editRoomName.trim()) return;

    setLoading(true);
    try {
      await roomAPI.updateRoom(roomId, editRoomName.trim());
      setEditingRoomId(null);
      setEditRoomName('');
      setShowRoomMenu(null);
      onRoomCreate(); // Reload room list
    } catch (error) {
      console.error('Failed to update room:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (room, e) => {
    e.stopPropagation();
    setEditingRoomId(room.id);
    setEditRoomName(room.name);
    setShowRoomMenu(null);
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingRoomId(null);
    setEditRoomName('');
  };

  const toggleRoomMenu = (roomId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowRoomMenu(showRoomMenu === roomId ? null : roomId);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on menu elements
      if (event.target.closest('.room-menu') || event.target.closest('.room-menu-button')) {
        return;
      }
      setShowRoomMenu(null);
      setShowDeleteConfirm(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Create Room Button */}
      <div className="p-3 lg:p-4">
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl h-10 lg:h-auto"
          variant="default"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Conversation</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="mx-3 lg:mx-4 mb-3 lg:mb-4 p-3 lg:p-4 bg-gray-50 rounded-xl">
          <form onSubmit={handleCreateRoom} className="space-y-3">
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
                onClick={() => {
                  setShowCreateForm(false);
                  setRoomName('');
                }}
                className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100 h-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Room List */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-4 pb-3 lg:pb-4">
        {rooms.length === 0 ? (
          <div className="text-center text-gray-400 py-6 lg:py-8">
            <MessageSquare className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 opacity-30" />
            <p className="text-gray-500 text-sm lg:text-base">No conversations yet</p>
            <p className="text-xs lg:text-sm text-gray-400">Start a new conversation!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {rooms.map((room) => (
              <div key={room.id} className="relative">
                {/* Edit Mode */}
                {editingRoomId === room.id ? (
                  <div className="rounded-xl p-3 lg:p-4 bg-gray-50 border border-gray-200">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={editRoomName}
                        onChange={(e) => setEditRoomName(e.target.value)}
                        placeholder="Room name"
                        className="border-gray-200 rounded-xl focus:border-primary h-8 text-sm"
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditRoom(room.id)}
                          size="sm"
                          disabled={loading || !editRoomName.trim()}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-7"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEdit}
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-200 rounded-xl hover:bg-gray-100 h-7"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Normal Room Item */
                  <div
                    className={`cursor-pointer transition-all duration-200 rounded-xl p-3 lg:p-4 ${
                      selectedRoom?.id === room.id
                        ? 'bg-primary/10 border border-primary/20'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onRoomSelect(room)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate text-sm lg:text-base ${
                          selectedRoom?.id === room.id ? 'text-primary' : 'text-gray-900'
                        }`}>
                          {room.name}
                        </h3>
                        <p className={`text-xs lg:text-sm truncate ${
                          selectedRoom?.id === room.id ? 'text-primary/70' : 'text-gray-500'
                        }`}>
                          {new Date(room.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedRoom?.id === room.id ? 'bg-primary' : 'bg-gray-300'
                        }`} />
                        <button
                          onClick={(e) => toggleRoomMenu(room.id, e)}
                          className="room-menu-button h-6 w-6 p-0 hover:bg-gray-200 rounded flex items-center justify-center"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Room Menu Dropdown */}
                {showRoomMenu === room.id && (
                  <div className="room-menu absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                    <div className="py-1">
                      <button
                        onClick={(e) => startEdit(room, e)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => confirmDelete(room.id, e)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteConfirm === room.id && (
                  <div className="room-menu absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] p-3">
                    <p className="text-sm text-gray-700 mb-3">
                      Are you sure you want to delete "{room.name}"?
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDeleteRoom(room.id)}
                        size="sm"
                        disabled={deletingRoomId === room.id}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg h-7"
                      >
                        {deletingRoomId === room.id ? 'Deleting...' : 'Delete'}
                      </Button>
                      <Button
                        onClick={cancelDelete}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-200 rounded-lg hover:bg-gray-100 h-7"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
