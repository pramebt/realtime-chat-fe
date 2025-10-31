import { forwardRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

const MessageItem = forwardRef(function MessageItem(
  {
    message,
    currentUser,
    isFirstInGroup,
    isLastInGroup,
    showAvatar,
    isOnline,
    isActionsVisible,
    showTimestamp,
    onToggleTimestamp,
    onToggleActions,
    editingMessageId,
    draftContent,
    onChangeDraft,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    formatDateTime,
  },
  ref
) {
  const isCurrentUser = currentUser?.id === message.user?.id;

  const bubbleColor = isCurrentUser
    ? "bg-blue-500 text-white"
    : "bg-gray-100 text-gray-900";

  const bubbleShape = (() => {
    if (isFirstInGroup && isLastInGroup) return "rounded-2xl";
    if (isFirstInGroup)
      return isCurrentUser ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md";
    if (isLastInGroup)
      return isCurrentUser ? "rounded-2xl rounded-tr-md" : "rounded-2xl rounded-tl-md";
    return "rounded-xl";
  })();

  return (
    <div
      ref={ref}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${
        isFirstInGroup ? "mt-3 lg:mt-4" : "mt-1"
      }`}
    >
      <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        {showAvatar && (
          <div
            className={`flex-shrink-0 ${isCurrentUser ? "ml-2 lg:ml-2" : "mr-2 lg:mr-2"} relative`}
          >
            <Avatar className="h-8 w-8 lg:h-10 lg:w-10 relative overflow-visible">
              <AvatarFallback className="text-xs bg-gray-200 text-gray-600">
                {message.user?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
              {isOnline && (
                <span className="absolute bottom-0 right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white z-20 translate-x-1/4 translate-y-1/4" />
              )}
            </Avatar>
          </div>
        )}
        {!isCurrentUser && !showAvatar && (
          <div className="flex-shrink-0 mr-2 lg:mr-2" style={{ width: "2rem" }} />
        )}

        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
          {!isCurrentUser && isFirstInGroup && (
            <div className={`text-xs text-gray-500 mb-1 px-1 ${isCurrentUser ? "text-right" : "text-left"}`}>
              {message.user?.username}
            </div>
          )}

          <div
            className={`max-w-full ${bubbleShape} px-3 lg:px-4 py-2 cursor-pointer transition-colors duration-150 ${bubbleColor}`}
            onClick={() => {
              onToggleTimestamp(message.id);
              if (isCurrentUser) onToggleActions(message.id);
            }}
          >
            {editingMessageId === message.id ? (
              <div className="flex items-center gap-2">
                <input
                  value={draftContent}
                  onChange={(e) => onChangeDraft(e.target.value)}
                  className={`w-full bg-transparent outline-none ${
                    isCurrentUser ? "placeholder:text-white/80" : "placeholder:text-gray-500"
                  }`}
                  placeholder="Edit message"
                />
                <Button size="sm" variant={isCurrentUser ? "secondary" : "default"} onClick={() => onSaveEdit(message.id)}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                  Cancel
                </Button>
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

          {isCurrentUser && editingMessageId !== message.id && !message.isDeleted && isActionsVisible && (
            <div className="flex gap-1.5 mt-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onStartEdit(message)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(message.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showTimestamp && (
            <div className={`text-[10px] mt-1 px-1 ${isCurrentUser ? "text-right text-white/80" : "text-left text-gray-400"}`}>
              {formatDateTime(message.timestamp || message.createdAt)}
            </div>
          )}

          {isCurrentUser && Array.isArray(message.readers) && message.readers.length > 0 && isLastInGroup && (
            <div className="text-[10px] mt-0.5 px-1 text-blue-500">Read</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MessageItem;


