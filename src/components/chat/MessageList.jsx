'use client';

import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const MessageList = ({ messages, currentUser, typingUsers = [] }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive or typing users change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
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
            <div className="space-y-1">
              {dayMessages.map((message, index) => {
                const isCurrentUser = currentUser?.id === message.user?.id;
                const prevMessage = index > 0 ? dayMessages[index - 1] : null;
                const showAvatar = !prevMessage || prevMessage.user?.id !== message.user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} ${
                      showAvatar ? 'mt-3 lg:mt-4' : 'mt-1'
                    }`}
                  >
                    <div className={`flex max-w-[85%] lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      {showAvatar && (
                        <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2 lg:ml-2' : 'mr-2 lg:mr-2'}`}>
                          <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
                            <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                              {message.user?.username?.charAt(0).toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {/* Username */}
                        {showAvatar && (
                          <div className={`text-xs text-gray-500 mb-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {message.user?.username}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-full rounded-2xl px-3 lg:px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white text-gray-900 shadow-sm border border-gray-100'
                        }`}>
                          <p className="text-sm break-words leading-relaxed">{message.content}</p>
                        </div>

                        {/* Timestamp */}
                        <div className={`text-xs text-gray-400 mt-1 px-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                          {formatTime(message.timestamp || message.createdAt)}
                        </div>
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
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
