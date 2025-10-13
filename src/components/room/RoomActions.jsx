'use client';

import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';

const RoomActions = ({ onShowCreateForm }) => {
  return (
    <div className="p-3 lg:p-4">
      <Button
        onClick={onShowCreateForm}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0 rounded-xl h-10"
        variant="default"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">New Conversation</span>
        <span className="sm:hidden">New</span>
      </Button>
    </div>
  );
};

export default RoomActions;
