import React from "react";

export default function Message({ role, content }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-6 shadow-sm border ${
          isUser
            ? "bg-blue-600/20 border-blue-600/30"
            : "bg-neutral-200 border-neutral-700"
        }`}
      >
        {!isUser && (
          <div className="mb-1 text-xs text-neutral-400">Assistant</div>
        )}
        {content}
      </div>
    </div>
  );
}
