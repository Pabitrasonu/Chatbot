import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function ChatWindow({ messages }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 scrollbar">
        {messages.length === 0 && (
          <div className="h-full grid place-items-center text-neutral-400">
            Say hello 👋
          </div>
        )}
        {messages.map((m, idx) => (
          <Message key={idx} role={m.role} content={m.content} />
        ))}
        <div ref={endRef} />
      </div>
    </main>
  );
}
