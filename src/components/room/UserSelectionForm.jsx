'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageCircle, X } from 'lucide-react';
import { userAPI, roomAPI } from '@/services/api';
import socketService from '@/services/socket';

const UserSelectionForm = ({ onRoomCreated, onClose }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      alert('เกิดข้อผิดพลาดในการโหลดรายชื่อผู้ใช้');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrivateRoom = async (targetUser) => {
    setCreatingRoom(targetUser.id);
    try {
      const response = await roomAPI.createPrivateRoom(targetUser.id);
      const room = response.data;
      
      // Join room via socket
      socketService.joinRoom(room.id);
      
      // Notify parent component
      onRoomCreated(room);
      onClose();
      
    } catch (error) {
      console.error('Failed to create private room:', error);
      alert('เกิดข้อผิดพลาดในการสร้างห้องส่วนตัว');
    } finally {
      setCreatingRoom(null);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <div className="mx-3 lg:mx-4 mb-3 lg:mb-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Start Private Chat
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10 border-gray-200 rounded-xl focus:border-primary h-10"
            />
          </div>

          {/* Users List */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm mt-2">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCreatePrivateRoom(user)}
                    disabled={creatingRoom === user.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-7 px-3"
                  >
                    {creatingRoom === user.id ? 'Creating...' : 'Chat'}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSelectionForm;
