'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2 lg:space-x-3 p-3 lg:p-4">
      <div className="flex-1">
        <Input
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Message"
          className="min-h-[36px] lg:min-h-[40px] max-h-24 lg:max-h-32 resize-none rounded-2xl border-gray-200 focus:border-primary focus:ring-0 bg-gray-50 text-sm lg:text-base"
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={!message.trim()}
        className="h-9 w-9 lg:h-10 lg:w-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full border-0 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
      >
        <Send className="h-3 w-3 lg:h-4 lg:w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
