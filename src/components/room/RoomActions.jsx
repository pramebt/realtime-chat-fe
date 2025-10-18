'use client';

import { Button } from '@/components/ui/button';
import { Plus, MessageSquare, Key } from 'lucide-react';

const RoomActions = ({ onShowCreateForm, onShowJoinForm }) => {
  return (
    <div className="p-3 lg:p-4 space-y-2">
      <Button
        onClick={onShowCreateForm}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl h-10"
        variant="default"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">New Conversation</span>
        <span className="sm:hidden">New</span>
      </Button>
      
      <Button
        onClick={onShowJoinForm}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl h-10"
        variant="outline"
      >
        <Key className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Join by Code</span>
        <span className="sm:hidden">Join</span>
      </Button>
    </div>
  );
};

export default RoomActions;
