'use client';

import { Button } from '@/components/ui/button';
import { Plus, Key, MessageSquare, Users } from 'lucide-react';

const RoomActions = ({ 
  onShowCreateForm, 
  onShowPrivateForm, 
  onShowJoinForm, 
  onShowUserSelection 
}) => {
  return (
    <div className="p-3 lg:p-4 space-y-2">
      {/* ปุ่มหลัก - สร้างห้อง */}
      <Button
        onClick={onShowCreateForm}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl h-10"
        variant="default"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Create Room</span>
        <span className="sm:hidden">Create</span>
      </Button>
      
      {/* ปุ่มรอง - 3 ปุ่ม */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          onClick={onShowPrivateForm}
          className="bg-purple-600 hover:bg-purple-700 text-white border-0 rounded-xl h-8 text-xs"
          variant="default"
        >
          <Key className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Private</span>
          <span className="sm:hidden">Private</span>
        </Button>
        
        <Button
          onClick={onShowUserSelection}
          className="bg-green-600 hover:bg-green-700 text-white border-0 rounded-xl h-8 text-xs"
          variant="default"
        >
          <Users className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Chat</span>
          <span className="sm:hidden">Chat</span>
        </Button>
        
        <Button
          onClick={onShowJoinForm}
          className="bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl h-8 text-xs"
          variant="default"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">Join</span>
          <span className="sm:hidden">Join</span>
        </Button>
      </div>
    </div>
  );
};

export default RoomActions;
