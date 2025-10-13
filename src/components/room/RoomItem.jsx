'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, MoreVertical, Edit2, Check, X } from 'lucide-react';
import { roomAPI } from '@/services/api';

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
        alert('คุณไม่มีสิทธิ์ลบห้องนี้ (เฉพาะเจ้าของห้องส่วนตัวเท่านั้นที่สามารถลบได้)');
      } else if (error.response?.status === 404) {
        alert('ไม่พบห้องที่ระบุ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบห้อง กรุณาลองใหม่อีกครั้ง');
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
    return new Date(room.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // ตรวจสอบสิทธิ์การลบห้อง
  const canDeleteRoom = (room) => {
    // ห้องสาธารณะ: ทุกคนลบได้
    return true;
  };

  return (
    <div className="relative">
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
                {getRoomSubtitle(room)}
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
  );
};

export default RoomItem;
