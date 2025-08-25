import React from 'react';


export default function Sidebar({ sessions, activeId, onNew, onSelect, onDelete }) {
return (
<aside className="w-64 shrink-0 border-r border-neutral-800 bg-surface p-3 hidden md:flex md:flex-col">
<button
onClick={onNew}
className="mb-3 rounded-xl border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-900"
>
+ New chat
</button>
<div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar">
{sessions.map(s => (
<button
key={s.id}
onClick={() => onSelect(s.id)}
className={`w-full text-left truncate rounded-lg px-3 py-2 text-sm hover:bg-neutral-900 border border-transparent ${activeId === s.id ? 'border-neutral-700 bg-neutral-900' : ''}`}
title={s.title || 'Untitled chat'}
>
{s.title || 'Untitled chat'}
</button>
))}
</div>
{activeId && (
<button
onClick={() => onDelete(activeId)}
className="mt-3 rounded-xl border border-red-600 px-3 py-2 text-sm text-red-200 hover:bg-red-950"
>
Delete current
</button>
)}
</aside>
);
}