'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import socketService from '../../services/socket';

const MessageList = ({ messages, currentUser, typingUsers = [], onlineUsers = new Set(), roomId }) => {
  const scrollContainerRef = useRef(null);
  const [showTimestamp, setShowTimestamp] = useState({});
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [draftContent, setDraftContent] = useState('');
  const initialScrollDoneRef = useRef(false);

  // Scroll helpers
  const AUTO_SCROLL_THRESHOLD_PX = 16;

  const isNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    return (scrollHeight - scrollTop - clientHeight) < AUTO_SCROLL_THRESHOLD_PX;
  }, []);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      if (behavior === 'smooth' && 'scrollTo' in el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, []);

  // Check if user is near bottom of scroll (helper)
  const checkScrollPosition = useCallback(() => {
    return isNearBottom();
  }, [isNearBottom]);

  // Reset initial scroll flag when room changes
  useEffect(() => {
    initialScrollDoneRef.current = false;
  }, [roomId]);

  // On first messages load after room change, force scroll to bottom once.
  // After that, only auto-scroll when user is near bottom.
  useEffect(() => {
    if (!initialScrollDoneRef.current && messages && messages.length > 0) {
      scrollToBottom('auto');
      initialScrollDoneRef.current = true;
      return;
    }
    if (isNearBottom()) {
      scrollToBottom('smooth');
    }
  }, [messages, typingUsers, isNearBottom, scrollToBottom]);

  // No scroll listener needed since we compute position on-demand

  // Toggle timestamp visibility
  const toggleTimestamp = (messageId) => {
    setShowTimestamp(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const startEdit = (message) => {
    setEditingMessageId(message.id);
    setDraftContent(message.content || '');
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setDraftContent('');
  };

  const saveEdit = (id) => {
    const content = draftContent.trim();
    if (!content) return;
    socketService.editMessage(id, content);
    cancelEdit();
  };

  const deleteMsg = (id) => {
    socketService.deleteMessage(id);
  };

  // Removed unused formatTime

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US');
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp || message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 lg:p-4 space-y-3 lg:space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
      >
      {Object.keys(groupedMessages).length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-400 px-4">
            <p className="text-gray-500 text-sm lg:text-base">No messages yet</p>
            <p className="text-xs lg:text-sm text-gray-400">Start the conversation!</p>
          </div>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, dayMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4 lg:my-6">
              <div className="bg-gray-200 text-gray-500 px-2 lg:px-3 py-1 rounded-full text-xs font-medium">
                {formatDate(dayMessages[0].timestamp || dayMessages[0].createdAt)}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-3">
              {dayMessages.map((message, index) => {
                const isCurrentUser = currentUser?.id === message.user?.id;
                const showAvatar = true; // แสดง avatar ทุกข้อความ
                const isOnline = onlineUsers?.has?.(message.user?.id);

                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mt-3 lg:mt-4`}
                  >
                    <div className={`flex max-w-[85%] lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      {showAvatar && (
                        <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2 lg:ml-2' : 'mr-2 lg:mr-2'} relative`}>
                          <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                            <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                              {message.user?.username?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {/* Username */}
                        <div className={`text-xs text-gray-500 mb-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {message.user?.username}
                        </div>

                        {/* Message Bubble */}
                        <div 
                          className={`max-w-full rounded-2xl px-3 lg:px-4 py-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                              : 'bg-white text-gray-900 shadow-sm border border-gray-100 hover:shadow-lg'
                          }`}
                          onClick={() => toggleTimestamp(message.id)}
                        >
                          {editingMessageId === message.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                value={draftContent}
                                onChange={(e) => setDraftContent(e.target.value)}
                                className={`w-full bg-transparent outline-none ${isCurrentUser ? 'placeholder:text-primary-foreground/80' : 'placeholder:text-gray-500'}`}
                                placeholder="Edit message"
                              />
                              <Button size="sm" variant={isCurrentUser ? 'secondary' : 'default'} onClick={() => saveEdit(message.id)}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                            </div>
                          ) : (
                            <p className="text-sm lg:text-base break-words leading-relaxed">
                              {message.content}
                              {message.editedAt && (
                                <span className="ml-2 text-[10px] opacity-80 italic">(edited)</span>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Actions for own messages */}
                        {isCurrentUser && editingMessageId !== message.id && !message.isDeleted && (
                          <div className="flex gap-2 mt-1">
                            <Button size="xs" variant="ghost" onClick={() => startEdit(message)}>Edit</Button>
                            <Button size="xs" variant="ghost" onClick={() => deleteMsg(message.id)}>Delete</Button>
                          </div>
                        )}

                        {/* Timestamp - แสดงเมื่อคลิก */}
                        {showTimestamp[message.id] && (
                          <div className={`text-xs text-gray-400 mt-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            <div className="bg-gray-100 rounded px-2 py-1 inline-block">
                              {formatDateTime(message.timestamp || message.createdAt)}
                            </div>
                          </div>
                        )}

                        {/* Read receipts for own messages */}
                        {isCurrentUser && Array.isArray(message.readers) && message.readers.length > 0 && (
                          <div className="text-[10px] text-gray-400 mt-1 px-1">
                            Read by {message.readers.length}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="flex justify-start mt-2">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-3 py-2 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
            </div>
            <span className="text-xs text-gray-500">
              {typingUsers.length === 1 
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`
              }
            </span>
          </div>
        </div>
      )}
      
      {/* End anchor removed - using container scroll APIs */}
      </div>

      
    </div>
  );
};

export default MessageList;