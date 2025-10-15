'use client';

import { useState, useEffect } from 'react';
import { useAuth, useSocket, useRooms, useMessages } from '@/hooks';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoomList from '../../components/room/RoomList';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user, token, logout } = useAuth();
  const { isConnected, joinRoom, leaveRoom } = useSocket();
  const { rooms, loading: roomsLoading, refetch: loadRooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Use messages hook for selected room
  const { messages, loading: messagesLoading, sendMessage } = useMessages(selectedRoom?.id);

  // Handle room selection
  const handleRoomSelect = async (room) => {
    // Leave previous room
    if (selectedRoom) {
      leaveRoom(selectedRoom.id);
    }

    // Join new room
    setSelectedRoom(room);
    if (room) {
      joinRoom(room.id);
    }
    setTypingUsers([]); // Clear typing users when changing room
  };

  // Handle room creation/join
  const handleRoomCreate = () => {
    loadRooms(); // Reload rooms list
  };

  const handleRoomDeleted = (deletedRoom) => {
    if (selectedRoom && selectedRoom.id === deletedRoom.id) {
      setSelectedRoom(null);
    }
    loadRooms(); // Reload rooms list
  };

  // Handle sending message
  const handleSendMessage = async (content) => {
    if (!selectedRoom || !user) return;
    
    try {
      await sendMessage(content, user.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (roomsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-50">
        {/* Sidebar - Hidden on mobile when chat is selected */}
        <div className={`${selectedRoom ? 'hidden lg:flex' : 'flex'} w-full lg:w-1/4 bg-white border-r border-gray-200 flex-col shadow-sm`}>
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <span className="hidden sm:inline">Messages</span>
                <span className="sm:hidden">Chats</span>
              </h1>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-primary hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {user?.username}
            </p>
          </div>

          {/* Room List */}
          <RoomList
            rooms={rooms}
            selectedRoom={selectedRoom}
            onRoomSelect={handleRoomSelect}
            onRoomCreate={loadRooms}
            onRoomDeleted={(roomId) => {
              if (selectedRoom?.id === roomId) {
                handleRoomSelect(null);
              }
            }}
          />
        </div>

        {/* Chat Area */}
        <div className={`${selectedRoom ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-white`}>
          {selectedRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 lg:p-6 border-b border-gray-100 bg-white flex items-center gap-3">
                {/* Back button for mobile */}
                <Button
                  onClick={() => setSelectedRoom(null)}
                  variant="ghost"
                  size="sm"
                  className="lg:hidden text-gray-500 hover:text-primary hover:bg-primary/10"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <h2 className="text-base lg:text-lg font-medium text-gray-900 truncate">
                  {selectedRoom.name}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden bg-gray-50">
                <MessageList messages={messages} currentUser={user} typingUsers={typingUsers} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-100">
                <MessageInput onSendMessage={handleSendMessage} roomId={selectedRoom?.id} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-400 px-4">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium text-gray-500">No conversation selected</h3>
                <p className="text-sm mt-1 text-gray-400">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
