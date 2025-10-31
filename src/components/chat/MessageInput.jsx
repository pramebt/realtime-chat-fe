'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Paperclip } from 'lucide-react';
import socketService from '@/services/socket';

const MessageInput = ({ onSendMessage, roomId }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!roomId) return;
    
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.startTyping(roomId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketService.stopTyping(roomId);
      }
    }, 1000); // Stop typing after 1 second of inactivity
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Stop typing when sending message
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketService.stopTyping(roomId);
      }
      
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter (like Messenger), newline on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && roomId) {
        socketService.stopTyping(roomId);
      }
    };
  }, [roomId]);

  return (
    <form onSubmit={handleSubmit} className="p-3 lg:p-4">
      <div className="flex items-center gap-1.5 lg:gap-2.5 bg-white border border-gray-200 rounded-full px-2.5 lg:px-3.5 py-1.5 lg:py-2 shadow-sm">
        <button
          type="button"
          className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={!roomId}
          aria-label="Emoji"
          title="Emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="h-9 w-9 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 disabled:text-gray-400 disabled:hover:bg-transparent"
          disabled={!roomId}
          aria-label="Attach"
          title="Attach"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none text-[15px] lg:text-base leading-6 placeholder:text-gray-400 max-h-32 overflow-y-auto py-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!roomId || !message.trim()}
          className="h-9 w-9 lg:h-10 lg:w-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full border-0 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
