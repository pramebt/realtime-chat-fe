"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import MessageItem from "./MessageItem";
import DateSeparator from "./DateSeparator";
import TypingIndicator from "./TypingIndicator";
import socketService from "../../services/socket";

const MessageList = ({
  messages,
  currentUser,
  typingUsers = [],
  onlineUsers = new Set(),
  roomId,
}) => {
  const scrollContainerRef = useRef(null);
  const [showTimestamp, setShowTimestamp] = useState({});
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [draftContent, setDraftContent] = useState("");
  const initialScrollDoneRef = useRef(false);
  const prevMessageCountRef = useRef(0);
  const rafIdRef = useRef(null);
  const [actionsVisibleFor, setActionsVisibleFor] = useState(null);
  const lastMessageRef = useRef(null);
  const typingAnchorRef = useRef(null);
  const prevTypingActiveRef = useRef(false); 

  // Scroll helpers
  const AUTO_SCROLL_THRESHOLD_PX = 16;

  const isNearBottom = useCallback(() => {
    if (!scrollContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < AUTO_SCROLL_THRESHOLD_PX;
  }, []);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current;
      if (behavior === "smooth" && "scrollTo" in el) {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
  // After that, auto-scroll on new messages only when authored by self or user is near bottom.
  useEffect(() => {
    const count = messages?.length || 0;
    if (count === 0) {
      prevMessageCountRef.current = 0;
      return;
    }

    if (!initialScrollDoneRef.current) {
      if (lastMessageRef.current?.scrollIntoView) {
        lastMessageRef.current.scrollIntoView({ behavior: "auto", block: "end" });
      } else {
        scrollToBottom("auto");
      }
      initialScrollDoneRef.current = true;
      prevMessageCountRef.current = count;
      return;
    }

    if (count > prevMessageCountRef.current) {
      const last = messages[count - 1];
      const authoredBySelf = currentUser?.id && last?.user?.id === currentUser.id;
      if (authoredBySelf || isNearBottom()) {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = requestAnimationFrame(() => {
          if (lastMessageRef.current?.scrollIntoView) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          } else {
            scrollToBottom("smooth");
          }
        });
      }
    }

    prevMessageCountRef.current = count;
  }, [messages, currentUser?.id, isNearBottom, scrollToBottom]);

  // When typing indicator becomes visible (transition from none -> some), scroll it into view
  useEffect(() => {
    const active = Boolean(typingUsers?.length);
    if (active && !prevTypingActiveRef.current) {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        if (typingAnchorRef.current?.scrollIntoView) {
          typingAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        } else if (lastMessageRef.current?.scrollIntoView) {
          lastMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
          scrollToBottom("smooth");
        }
      });
    }
    prevTypingActiveRef.current = active;
  }, [typingUsers, scrollToBottom]);

  // Cleanup any pending rAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // No scroll listener needed since we compute position on-demand

  // Toggle timestamp visibility
  const toggleTimestamp = (messageId) => {
    setShowTimestamp((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const startEdit = (message) => {
    setEditingMessageId(message.id);
    setDraftContent(message.content || "");
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setDraftContent("");
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
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US");
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(
      message.timestamp || message.createdAt
    ).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  const lastMessageId = messages?.length ? messages[messages.length - 1]?.id : null;

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-3 lg:p-4 space-y-3 lg:space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
      >
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 px-4">
              <p className="text-gray-500 text-sm lg:text-base">
                No messages yet
              </p>
              <p className="text-xs lg:text-sm text-gray-400">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <DateSeparator
                label={formatDate(dayMessages[0].timestamp || dayMessages[0].createdAt)}
              />

              {/* Messages for this date */}
              <div className="space-y-1.5">
                {dayMessages.map((message, index) => {
                  const isCurrentUser = currentUser?.id === message.user?.id;
                  const prev = index > 0 ? dayMessages[index - 1] : null;
                  const next =
                    index < dayMessages.length - 1
                      ? dayMessages[index + 1]
                      : null;
                  const isFirstInGroup =
                    !prev || prev.user?.id !== message.user?.id;
                  const isLastInGroup =
                    !next || next.user?.id !== message.user?.id;
                  const showAvatar = !isCurrentUser && isLastInGroup;
                  const isOnline = onlineUsers?.has?.(message.user?.id);

                  const bubbleColor = isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900";
                  const bubbleShape = (() => {
                    if (isFirstInGroup && isLastInGroup) return "rounded-2xl";
                    if (isFirstInGroup)
                      return isCurrentUser
                        ? "rounded-2xl rounded-br-md"
                        : "rounded-2xl rounded-bl-md";
                    if (isLastInGroup)
                      return isCurrentUser
                        ? "rounded-2xl rounded-tr-md"
                        : "rounded-2xl rounded-tl-md";
                    return "rounded-xl";
                  })();

                  return (
                    <MessageItem
                      key={message.id}
                      ref={message.id === lastMessageId ? lastMessageRef : undefined}
                      message={message}
                      currentUser={currentUser}
                      isFirstInGroup={isFirstInGroup}
                      isLastInGroup={isLastInGroup}
                      showAvatar={showAvatar}
                      isOnline={isOnline}
                      isActionsVisible={actionsVisibleFor === message.id}
                      showTimestamp={Boolean(showTimestamp[message.id])}
                      onToggleTimestamp={(id) => toggleTimestamp(id)}
                      onToggleActions={(id) =>
                        setActionsVisibleFor((prev) => (prev === id ? null : id))
                      }
                      editingMessageId={editingMessageId}
                      draftContent={draftContent}
                      onChangeDraft={setDraftContent}
                      onStartEdit={startEdit}
                      onCancelEdit={cancelEdit}
                      onSaveEdit={saveEdit}
                      onDelete={deleteMsg}
                      formatDateTime={formatDateTime}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator ref={typingAnchorRef} typingUsers={typingUsers} />
        )}

      </div>
    </div>
  );
};

export default MessageList;
