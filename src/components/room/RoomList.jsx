'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import CreateRoomForm from './CreateRoomForm';
import RoomActions from './RoomActions';
import RoomItem from './RoomItem';

const RoomList = ({ rooms, selectedRoom, onRoomSelect, onRoomCreate, onRoomDeleted }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on menu elements
      if (event.target.closest('.room-menu') || event.target.closest('.room-menu-button')) {
        return;
      }
      // This will be handled by individual RoomItem components
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };

  // แสดงห้องทั้งหมด
  const allRooms = rooms;

  return (
    <div className="flex flex-col h-full">
      {/* Action Buttons */}
      <RoomActions 
        onShowCreateForm={() => setShowCreateForm(!showCreateForm)}
      />

      {/* Create Room Form */}
      {showCreateForm && (
        <CreateRoomForm 
          onRoomCreate={onRoomCreate}
          onClose={handleCloseCreateForm}
        />
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
            {allRooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                selectedRoom={selectedRoom}
                onRoomSelect={onRoomSelect}
                onRoomCreate={onRoomCreate}
                onRoomDeleted={onRoomDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomList;
