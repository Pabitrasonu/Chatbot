import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import Composer from './components/Composer.jsx';
import { sendChat } from './lib/openai.js';

function createSession(title = 'New chat') {
  return { id: crypto.randomUUID(), title, messages: [] };
}

const STORAGE_KEY = 'chatgpt-clone:sessions:v1';

export default function App() {
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [createSession('New chat')];
    } catch {
      return [createSession('New chat')];
    }
  });
  const [activeId, setActiveId] = useState(() => sessions[0]?.id);
  const active = useMemo(() => sessions.find(s => s.id === activeId) || sessions[0], [sessions, activeId]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const newChat = () => {
    const s = createSession('New chat');
    setSessions(prev => [s, ...prev]);
    setActiveId(s.id);
  };

  const deleteChat = (id) => {
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      return next.length ? next : [createSession('New chat')];
    });
    if (id === activeId) setActiveId(prev => (sessions.find(s => s.id !== id)?.id));
  };

  const renameActiveFromFirstUserMsg = (text) => {
    const title = text.length > 35 ? text.slice(0, 35) + '…' : text;
    setSessions(prev => prev.map(s => s.id === active.id ? { ...s, title } : s));
  };

  const send = async (text) => {
    const userMsg = { role: 'user', content: text };

    // Optimistically add user message
    setSessions(prev => prev.map(s => s.id === active.id ? { ...s, messages: [...s.messages, userMsg] } : s));

    if (active.messages.length === 0) renameActiveFromFirstUserMsg(text);

    setLoading(true);
    try {
      const messages = [{ role: 'system', content: 'You are a helpful assistant.' }, ...active.messages, userMsg];
      const reply = await sendChat(messages);
      const assistantMsg = { role: 'assistant', content: reply };

      setSessions(prev => prev.map(s => s.id === active.id ? { ...s, messages: [...s.messages, assistantMsg] } : s));
    } catch (err) {
      const errorMsg = { role: 'assistant', content: `⚠️ Error: ${err.message}` };
      setSessions(prev => prev.map(s => s.id === active.id ? { ...s, messages: [...s.messages, errorMsg] } : s));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex">
      <Sidebar
        sessions={sessions}
        activeId={active?.id}
        onNew={newChat}
        onSelect={setActiveId}
        onDelete={deleteChat}
      />

      <div className="flex-1 flex flex-col bg-surface-3">
        <ChatWindow messages={active?.messages || []} />
        <Composer onSend={send} disabled={loading} />
      </div>
    </div>
  );
}
