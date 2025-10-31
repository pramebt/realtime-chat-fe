import { forwardRef } from "react";

const TypingIndicator = forwardRef(function TypingIndicator({ typingUsers = [] }, ref) {
  return (
    <div className="flex justify-start mt-2" ref={ref} tabIndex={-1}>
      <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-3 py-2 max-w-xs">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
        </div>
        <span className="text-xs text-gray-500">
          {typingUsers.length === 1
            ? `${typingUsers[0].username} is typing...`
            : `${typingUsers.length} people are typing...`}
        </span>
      </div>
    </div>
  );
});

export default TypingIndicator;


