'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import RoomList from '../../components/room/RoomList';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import socketService from '../../services/socket';
import { roomAPI, messageAPI } from '../../services/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user, token, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Connect Socket.IO when token is available
  useEffect(() => {
    if (token) {
      socketService.connect(token);
       
      // Listen for new messages
      socketService.onReceiveMessage((message) => {
        setMessages(prev => [...prev, message]);
        // mark as read for messages from others
        if (message?.id && message?.user?.id !== user?.id) {
          socketService.readMessage(message.id);
        }
      });

      // Listen for user joined
      socketService.onUserJoined((data) => {
        console.log(`${data.username} joined the room`);
      });

      // Listen for user left
      socketService.onUserLeft((data) => {
        console.log(`${data.username} left the room`);
      });

      // Listen for errors
      socketService.onError((error) => {
        console.error('Socket error:', error);
      });

      // Listen for typing events
      socketService.onUserTyping((data) => {
        // Don't show typing indicator for current user
        if (data.userId !== user?.id) {
          setTypingUsers(prev => {
            const exists = prev.find(u => u.userId === data.userId);
            if (!exists) {
              return [...prev, { userId: data.userId, username: data.username }];
            }
            return prev;
          });
        }
      });

      socketService.onUserStopTyping((data) => {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      });

      // Presence
      // Mark self online immediately
      setOnlineUsers(prev => new Set(prev).add(user?.id));
      // Seed initial list from server
      socketService.onOnlineUsers(({ userIds = [] }) => {
        setOnlineUsers(new Set(userIds));
      });
      // Live updates
      socketService.onlineUser(({ userId }) => {
        setOnlineUsers(prev => new Set(prev).add(userId));
      });
      socketService.offlineUser(({ userId }) => {
        setOnlineUsers(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      // Listen for message edited
      socketService.onMessageEdited((updated) => {
        setMessages(prev => prev.map(m => m.id === updated.id ? { ...m, ...updated } : m));
      });

      // Listen for message deleted
      socketService.onMessageDeleted((deleted) => {
        setMessages(prev => prev.map(m => m.id === deleted.id ? { ...m, ...deleted } : m));
      });

      // Listen for read receipts
      socketService.onReadMessage(({ messageId, readers }) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, readers } : m));
      });
    }

    return () => {
      socketService.removeAllListeners();
    };
  }, [token, user?.id]);

  const loadRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = async (room) => {
    // If room is null, clear selection
    if (!room) {
      if (selectedRoom) {
        socketService.leaveRoom(selectedRoom.id);
      }
      setSelectedRoom(null);
      setMessages([]);
      setTypingUsers([]); // Clear typing users when leaving room
      return;
    }

    // Leave previous room
    if (selectedRoom) {
      socketService.leaveRoom(selectedRoom.id);
    }

    // Join new room
    setSelectedRoom(room);
    socketService.joinRoom(room.id);
    setTypingUsers([]); // Clear typing users when joining new room

    // Load messages for the room
    try {
      const response = await messageAPI.getMessages(room.id);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  const handleSendMessage = (message) => {
    if (selectedRoom && message.trim()) {
      socketService.sendMessage(selectedRoom.id, message.trim());
    }
  };

  // helper: mark all messages as read when opening room
  useEffect(() => {
    if (selectedRoom && messages?.length) {
      messages.forEach(msg => {
        if (msg?.id && msg?.user?.id !== user?.id) {
          socketService.readMessage(msg.id);
        }
      });
    }
  }, [selectedRoom, messages, user?.id]);

  const handleLogout = () => {
    socketService.disconnect();
    logout();
  };

  if (loading) {
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
              <div className="p-4 lg:p-5 border-b border-gray-100 bg-white flex items-center gap-3">
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
                <h2 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
                  {selectedRoom.name}
                </h2>
                
              </div>

              {/* Online users in this room */}
              {selectedRoom && (
                <div className="px-4 lg:px-6 py-2 border-b border-gray-50 bg-white flex items-center gap-2 overflow-x-auto">
                  {((selectedRoom.members || []).filter(m => onlineUsers.has(m.id))).map((m) => (
                    <div key={m.id} className="relative">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-gray-200 text-gray-600">
                          {m.username?.charAt(0).toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                    </div>
                  ))}
                  <span className="text-xs text-gray-500 ml-1">
                    {((selectedRoom.members || []).filter(m => onlineUsers.has(m.id)).length)} online
                  </span>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 bg-gray-50 min-h-0 overflow-hidden">
                <MessageList roomId={selectedRoom?.id} messages={messages} currentUser={user} typingUsers={typingUsers} onlineUsers={onlineUsers} />
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
