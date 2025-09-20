import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";
import { MessageCircle, X, Search, Heart, Calendar, HelpCircle, Star, ShoppingCart, Users, BookOpen } from "lucide-react";

// Add scrollbar styles
const scrollbarStyles = `
  .chat-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .chat-scroll::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  .chat-scroll::-webkit-scrollbar-thumb {
    background: #64748b;
    border-radius: 4px;
  }
  .chat-scroll::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = scrollbarStyles;
  document.head.appendChild(styleSheet);
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const lastUserMessageRef = useRef("");
  const [activeTab, setActiveTab] = useState("chat");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: "👋 Welcome to CraftConnect! I'm your AI assistant here to help you discover amazing handcrafted products and learn about traditional crafts. How can I assist you today?",
      timestamp: new Date()
    },
    { 
      role: "bot", 
      text: "I can help you find pottery, textiles, jewelry, and other handcrafted items from skilled artisans.",
      timestamp: new Date()
    },
    { 
      role: "bot", 
      text: "Ask me about traditional crafts, cultural heritage, or any questions about our platform!",
      timestamp: new Date()
    }
  ]);

  // Auto-focus input when chatbot opens and after sending
  useEffect(() => {
    if (isOpen && !sending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, sending]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Quick action handlers - using only Gemini API
  const handleQuickAction = async (action) => {
    // Add user message immediately
    setMessages(prev => [...prev, 
      { role: "user", text: action, timestamp: new Date() }
    ]);

    try {
      // Use the main chat endpoint with context
      const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `User clicked on: ${action}. Please provide a helpful response about this topic.`,
          context: action
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, 
          { role: "bot", text: data.response, timestamp: new Date() }
        ]);
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.error("Quick action error:", error);
      setMessages(prev => [...prev, 
        { role: "bot", text: "I'm having trouble connecting to the AI service. Please make sure the backend server is running.", timestamp: new Date() }
      ]);
    }
  };

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: trimmed, timestamp: new Date() }]);
    lastUserMessageRef.current = trimmed;
    setInput("");
    setSending(true);

    try {
      // Always use Gemini API - no hardcoded fallbacks
      const apiResponse = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed,
          context: "general"
        })
      });
      
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        setMessages((prev) => [...prev, { role: "bot", text: data.response, timestamp: new Date() }]);
      } else {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || "API request failed");
      }
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: `Connection issue. Tap Retry to resend your last question.`, 
        timestamp: new Date() 
      }]);
    } finally {
      setSending(false);
    }
  }

  function handleRetry() {
    if (!sending && lastUserMessageRef.current) {
      setInput(lastUserMessageRef.current);
      // send on next tick so input state is updated
      setTimeout(() => handleSend(), 0);
    }
  }



  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            AI
          </div>
        </button>
      )}

      {/* Chat Container */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Assistant chat"
          aria-modal="true"
          className="relative w-[90vw] max-w-md h-[70vh] sm:w-96 sm:h-[600px] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden"
          onKeyDown={(e) => { if (e.key === 'Escape') setIsOpen(false); }}
        >
          {/* Prominent Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chatbot"
            className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 rounded-full p-1 shadow"
          >
            <X size={18} aria-hidden="true" />
          </button>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-bold text-lg">AI Assistant</h3>
                <p className="text-sm opacity-90">CraftConnect Support</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-white bg-opacity-20 rounded-lg p-1">
              {[
                { id: "chat", label: "Chat", icon: MessageCircle },
                { id: "recommend", label: "Products", icon: Search },
                { id: "cultural", label: "Culture", icon: BookOpen },
                { id: "support", label: "Support", icon: HelpCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <tab.icon size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {activeTab === "chat" && (
              <>
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 chat-scroll">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg ${
                          m.role === "bot"
                            ? "bg-white border border-gray-200 text-gray-800"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                        <div className={`text-xs mt-1 ${
                          m.role === "bot" ? "text-gray-500" : "text-indigo-200"
                        }`}>
                          {m.timestamp?.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Auto-scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-3 bg-white border-t">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      { action: "recommend", label: "Find Products", icon: Search, color: "bg-blue-500" },
                      { action: "cultural", label: "Learn Culture", icon: BookOpen, color: "bg-green-500" },
                      { action: "order", label: "Order Help", icon: ShoppingCart, color: "bg-orange-500" },
                      { action: "consultation", label: "Consultation", icon: Calendar, color: "bg-purple-500" }
                    ].map((btn) => (
                      <button
                        key={btn.action}
                        onClick={() => handleQuickAction(btn.action)}
                        className={`${btn.color} text-white p-2 rounded-lg text-xs font-medium hover:opacity-80 transition-opacity flex items-center justify-center space-x-1`}
                      >
                        <btn.icon size={14} />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Input Box */}
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { 
                        if (e.key === 'Enter' && !sending && input.trim()) {
                          handleSend();
                        }
                      }}
                      placeholder={sending ? "AI is thinking..." : "Ask me anything about crafts..."}
                      disabled={sending}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                      aria-label="Chat input"
                    />
                    <button
                      onClick={() => {
                        if (!sending && input.trim()) {
                          handleSend();
                        }
                      }}
                      disabled={sending || !input.trim()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                    >
                      {sending ? "..." : "Send"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={sending || !lastUserMessageRef.current}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60"
                      aria-label="Retry last message"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "recommend" && (
              <div className="flex-1 p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-4">Product Recommendations</h4>
                <div className="space-y-3">
                  {[
                    { category: "Pottery & Ceramics", icon: "🏺", count: "12 items" },
                    { category: "Textiles & Fabrics", icon: "🧵", count: "8 items" },
                    { category: "Jewelry & Accessories", icon: "💎", count: "15 items" },
                    { category: "Wooden Crafts", icon: "🪵", count: "6 items" },
                    { category: "Metal Work", icon: "⚒️", count: "9 items" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-medium text-gray-800">{item.category}</div>
                            <div className="text-sm text-gray-500">{item.count}</div>
                          </div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800">
                          <Search size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cultural" && (
              <div className="flex-1 p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-4">Cultural Education</h4>
                <div className="space-y-3">
                  {[
                    { title: "Madhubani Painting", region: "Bihar", description: "Traditional folk art with mythological themes" },
                    { title: "Pashmina Weaving", region: "Kashmir", description: "Fine cashmere wool shawls" },
                    { title: "Block Printing", region: "Rajasthan", description: "Traditional textile art with wooden blocks" },
                    { title: "Terracotta Pottery", region: "West Bengal", description: "Ancient clay work techniques" }
                  ].map((craft, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="font-medium text-gray-800">{craft.title}</div>
                      <div className="text-sm text-indigo-600">{craft.region}</div>
                      <div className="text-sm text-gray-600 mt-1">{craft.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="flex-1 p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-4">Support Center</h4>
                <div className="space-y-3">
                  {[
                    { title: "Order Tracking", description: "Track your orders and delivery status" },
                    { title: "Payment Help", description: "Payment methods and billing support" },
                    { title: "Returns & Exchanges", description: "Process returns and exchanges" },
                    { title: "Artisan Support", description: "Help for artisans and sellers" },
                    { title: "Contact Us", description: "Get in touch with our team" }
                  ].map((support, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="font-medium text-gray-800">{support.title}</div>
                      <div className="text-sm text-gray-600">{support.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Close Button (appears when open) */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close chat"
          className="mt-3 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
        >
          <X size={22} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
