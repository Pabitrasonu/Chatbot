import React, { useState, useRef, useEffect } from "react";

export default function Composer({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; // max height = 160px (~10 lines)
    }
  }, [value]);

  const submit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className="border-t border-neutral-800 bg-neutral-900 p-3 md:p-4"
    >
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none rounded-xl bg-neutral-800 border border-neutral-700 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-neutral-600 max-h-40 min-h-[44px] overflow-hidden"
          placeholder="Send a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition"
        >
          Send
        </button>
      </div>
    </form>
  );
}
