import React, { useState } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 hover:scale-105 transition-transform"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chatbot"
      >
        <span className="material-icons">smart_toy</span>
        <span className="hidden sm:inline">AI Chat</span>
      </button>
      {/* Chatbot Container */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-indigo-700">Artisan AI Chatbot</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto mb-2 bg-gray-50 rounded p-2 text-sm text-gray-700" style={{ minHeight: 120 }}>
            <p>Hi! I am your AI assistant. How can I help you today?</p>
          </div>
          <form className="flex gap-2">
            <input type="text" className="flex-1 border rounded px-2 py-1" placeholder="Type your message..." disabled />
            <button type="submit" className="bg-indigo-600 text-white px-3 py-1 rounded" disabled>Send</button>
          </form>
        </div>
      )}
    </>
  );
}