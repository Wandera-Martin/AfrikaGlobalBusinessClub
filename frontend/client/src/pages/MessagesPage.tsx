import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '../services/businessApi';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage, 
  markMessagesRead, 
  Conversation, 
  Message 
} from '../services/messagesApi';
import { useToast } from '../context/ToastContext';



const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load conversations
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setInitialLoading(true);
      const [uProfile, convs] = await Promise.all([
        fetchBusinessProfile(),
        fetchConversations()
      ]);
      setProfile(uProfile);
      setConversations(convs);
    } catch (err) {
      console.error("Failed to load messaging data", err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Polling Conversations every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const convs = await fetchConversations();
        setConversations(convs);
      } catch (err) { }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Polling Messages when a conversation is active (every 3 seconds)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeConv) {
      const loadMessages = async () => {
        try {
          const msgs = await fetchMessages(activeConv.id);
          setMessages(msgs);
          if (activeConv.unread_count > 0) {
             await markMessagesRead(activeConv.id);
             // silently update unread count in state
             setConversations(prev => prev.map(c => c.id === activeConv.id ? { ...c, unread_count: 0 } : c));
          }
        } catch (err) { }
      };
      
      loadMessages(); // immediate load
      interval = setInterval(loadMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [activeConv]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    setIsSending(true);
    try {
      const msg = await sendMessage(activeConv.id, newMessage);
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (err: any) {
      showToast(err.message || 'Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const getConvName = (conv: Conversation) => {
    if (conv.type === 'public_aio') return '🌐 Global AIO Chat';
    if (!profile) return 'Direct Message';
    const otherParticipant = conv.participants_details.find(p => p.id !== profile.id);
    return otherParticipant ? otherParticipant.company_name : 'Direct Message';
  };

  const showBanner = profile !== null && !profile.onboarding_completed && profile.onboarding_skipped;

  return (
    <>
      {/* ── NAV ── */}
      

      <div className="flex-grow pb-6 w-full mx-auto flex gap-6 h-[calc(100vh-100px)] text-sm mt-0">
        
        {/* ── INBOX SIDEBAR ── */}
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-shrink-0 h-[calc(100vh-100px)] overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-extrabold text-gray-900">Inbox</h2>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {initialLoading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.<br/>Message businesses to start!</div>
            ) : (
              conversations.map(conv => {
                const isActive = activeConv?.id === conv.id;
                const name = getConvName(conv);
                const isPublic = conv.type === 'public_aio';
                
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full text-left p-4 border-b border-gray-50 transition-colors flex items-center gap-3 hover:bg-gray-50 ${isActive ? 'bg-blue-50/50 hover:bg-blue-50/80 border-l-4 border-l-navy' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg shadow-sm ${isPublic ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-orange-100 text-orange-600'}`}>
                      {isPublic ? '🌍' : name.charAt(0)}
                    </div>
                    
                    <div className="flex-grow min-w-0 pr-2">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`font-bold truncate ${isActive ? 'text-navy' : 'text-gray-900'}`}>{name}</span>
                        {conv.last_message && (
                          <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                            {new Date(conv.last_message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className={`text-xs truncate ${conv.unread_count > 0 && !isActive ? 'font-bold text-gray-800' : 'text-gray-500'}`}>
                          {conv.last_message ? (
                            conv.last_message.sender_details?.id === profile?.id ? `You: ${conv.last_message.content}` : conv.last_message.content
                          ) : 'No messages yet'}
                        </span>
                        {conv.unread_count > 0 && !isActive && (
                          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div className="flex-grow bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-100px)] overflow-hidden">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-gray-100 flex items-center px-6 bg-gray-50/30 flex-shrink-0 justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${activeConv.type === 'public_aio' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-orange-400'}`}>
                    {activeConv.type === 'public_aio' ? '🌍' : getConvName(activeConv).charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-gray-900 leading-none mb-1">{getConvName(activeConv)}</h2>
                    <span className="text-xs text-green-600 font-medium">● Online</span>
                  </div>
                </div>
              </div>

              {/* Chat History */}
              <div className="flex-grow overflow-y-auto p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTIuMzQzIDIyLjM0M0wxMSAxMy42ODZMMTkuNjU3IDIyLjM0M0wxMSAzMXMtOC42NTctOC42NTctOC42NTctOC42NTd6IiBmaWxsPSIjRTI4MjNCIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')]">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="font-bold text-gray-500">Say Hello!</p>
                    <p className="text-xs text-gray-400">Be the first to start the conversation.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map(msg => {
                      const isMe = msg.sender_details.id === profile?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {!isMe && activeConv.type === 'public_aio' && (
                              <span className="text-[11px] font-bold text-gray-500 mb-1 ml-1">{msg.sender_details.company_name}</span>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl relative shadow-sm ${
                              isMe 
                                ? 'bg-navy text-white rounded-tr-sm' 
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                              <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="w-12 h-12 flex-shrink-0 bg-navy hover:bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-sm transition-all active:scale-[0.96] disabled:opacity-50 disabled:bg-gray-300"
                  >
                    ➤
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">AGBC Secure Messaging</h3>
              <p className="text-sm text-gray-500 max-w-sm">Select a conversation from the left strictly encrypted direct messages or join the Global AIO Room.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MessagesPage;
