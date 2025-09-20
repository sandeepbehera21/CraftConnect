import ChatbotWidget from "../components/ChatbotWidget.jsx";
export default function Dashboard() {
  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      {/* ... existing code ... */}
      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* ... existing code ... */}
      </main>
      <ChatbotWidget />
    </div>
  );
}