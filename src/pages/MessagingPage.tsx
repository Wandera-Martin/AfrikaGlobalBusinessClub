import { useState } from "react";
import UnifiedShell from "@/components/layout/UnifiedShell";
import { Button } from "@/components/ui/button";
import { mockConversations } from "@/lib/mockData";
import { Send, Paperclip, Search } from "lucide-react";

const MessagingPage = () => {
  const [conversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    console.log("Sending message:", messageText);
    setMessageText("");
  };

  return (
    <UnifiedShell>
      <div className="min-h-screen bg-gray-50">
      
      <div className="pt-16 h-screen flex">
        <div className="flex-1 flex">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-agbc-blue focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition text-left ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.participant.name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">{conv.participant.company}</p>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-agbc-blue rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConversation.participant.avatar}
                      alt={selectedConversation.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.participant.name}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.participant.company}</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                  {/* Sample Messages */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-md shadow-sm">
                      <p className="text-gray-800">{selectedConversation.lastMessage}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {new Date(selectedConversation.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-agbc-blue text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-md">
                      <p>Thank you for your interest! I'd be happy to discuss our products further.</p>
                      <span className="text-xs text-blue-100 mt-1 block">10:23 AM</span>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-md shadow-sm">
                      <p className="text-gray-800">Great! Can you send me your latest catalog and pricing?</p>
                      <span className="text-xs text-gray-500 mt-1 block">10:25 AM</span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                      <textarea
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-agbc-blue focus:border-transparent resize-none"
                        rows={2}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-agbc-blue hover:bg-agbc-blue-dark"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </UnifiedShell>
  );
};

export default MessagingPage;
