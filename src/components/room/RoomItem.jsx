'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, MoreVertical, Edit2, Check, X, Users, Crown } from 'lucide-react';
import { roomAPI } from '@/services/api';
import { toast } from 'sonner';

const RoomItem = ({ 
  room, 
  selectedRoom, 
  onRoomSelect, 
  onRoomCreate, 
  onRoomDeleted 
}) => {
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [showRoomMenu, setShowRoomMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [loading, setLoading] = useState(false);

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
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error('คุณไม่มีสิทธิ์ลบห้องนี้ (เฉพาะเจ้าของห้องส่วนตัวเท่านั้นที่สามารถลบได้)');
      } else if (error.response?.status === 404) {
        toast.error('ไม่พบห้องที่ระบุ');
      } else {
        toast.error('เกิดข้อผิดพลาดในการลบห้อง กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setDeletingRoomId(null);
      setShowDeleteConfirm(null);
    }
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

  const confirmDelete = (roomId, e) => {
    e.stopPropagation(); // Prevent room selection
    setShowDeleteConfirm(roomId);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(null);
  };

  const toggleRoomMenu = (roomId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowRoomMenu(showRoomMenu === roomId ? null : roomId);
  };

  // แสดงข้อมูลห้อง
  const getRoomSubtitle = (room) => {
    const dateStr = new Date(room.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    
    // แสดงจำนวนสมาชิก
    const memberCount = room.members?.length || 0;
    const ownerName = room.owner?.username || 'Unknown';
    
    return `${dateStr} • ${memberCount} members • Owner: ${ownerName}`;
  };

  // ตรวจสอบสิทธิ์การลบห้อง (เฉพาะเจ้าของห้อง)
  const canDeleteRoom = (room) => {
    // ต้องเป็นเจ้าของห้องเท่านั้น
    return room.ownerId === room.owner?.id;
  };

  return (
    <div className="relative group">
      {/* Edit Mode */}
      {editingRoomId === room.id ? (
        <div className="rounded-xl p-3.5 lg:p-4 bg-gray-50 border border-gray-200">
          <div className="space-y-2.5">
            <Input
              type="text"
              value={editRoomName}
              onChange={(e) => setEditRoomName(e.target.value)}
              placeholder="Room name"
              className="border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 h-9 text-sm transition-colors"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => handleEditRoom(room.id)}
                disabled={loading || !editRoomName.trim()}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-8 text-sm font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button
                onClick={cancelEdit}
                variant="ghost"
                className="flex-1 rounded-lg hover:bg-gray-200 h-8 text-sm font-medium text-gray-700 transition-colors"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Room Item */
        <div
          className={`cursor-pointer transition-all duration-150 rounded-xl p-3.5 lg:p-4 ${
            selectedRoom?.id === room.id
              ? 'bg-gray-100'
              : 'hover:bg-gray-50/50'
          }`}
          onClick={() => onRoomSelect(room)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`font-medium truncate text-sm lg:text-base ${
                  selectedRoom?.id === room.id ? 'text-gray-900' : 'text-gray-800'
                }`}>
                  {room.name}
                </h3>
                {room.isPrivate && (
                  <Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs lg:text-sm truncate mt-1 text-gray-500">
                {getRoomSubtitle(room)}
              </p>
              <div className="flex items-center space-x-1.5 mt-1">
                <Users className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400 font-mono">
                  {room.code}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                selectedRoom?.id === room.id ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
              <button
                onClick={(e) => toggleRoomMenu(room.id, e)}
                className="room-menu-button h-6 w-6 p-0 hover:bg-gray-200 rounded-md flex items-center justify-center transition-all lg:opacity-0 lg:group-hover:opacity-100"
              >
                <MoreVertical className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Menu Dropdown */}
      {showRoomMenu === room.id && (
        <div className="room-menu absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 min-w-[130px] overflow-hidden">
          <div className="py-1">
            <button
              onClick={(e) => startEdit(room, e)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5 mr-2" />
              Edit
            </button>
            <button
              onClick={(e) => confirmDelete(room.id, e)}
              disabled={!canDeleteRoom(room)}
              className={`w-full px-3 py-2 text-left text-sm flex items-center transition-colors ${
                canDeleteRoom(room) 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm === room.id && (
        <div className="room-menu absolute top-12 right-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 min-w-[220px] p-3">
          <p className="text-sm text-gray-900 mb-3">
            Delete "{room.name}"?
          </p>
          <p className="text-xs text-gray-500 mb-3">
            This action cannot be undone.
          </p>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleDeleteRoom(room.id)}
              disabled={deletingRoomId === room.id}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg h-8 text-sm font-medium transition-colors disabled:bg-gray-300 disabled:text-gray-500"
            >
              {deletingRoomId === room.id ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              onClick={cancelDelete}
              variant="ghost"
              className="flex-1 rounded-lg hover:bg-gray-100 h-8 text-sm font-medium text-gray-700 transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomItem;
