import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { chatAPI, messageAPI } from '../services/api';
import { MessageCircle, Send, ArrowLeft, Check, CheckCheck, Search } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import Loader from '../components/ui/Loader';

export default function ChatPage() {
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(!urlChatId);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ─── Connect Socket ───────────────────────────────────────
  useEffect(() => {
    const newSocket = io(
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
      { withCredentials: true }
    );

    newSocket.on('connect', () => {
      newSocket.emit('join', user._id);
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // Update lastMessage in chat list
      setChats((prev) =>
        prev.map((c) =>
          c._id === message.chat
            ? { ...c, lastMessage: { text: message.text, sender: message.sender._id || message.sender, createdAt: message.createdAt }, updatedAt: message.createdAt }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    });

    newSocket.on('user_typing', ({ userName }) => {
      setTyping(userName);
    });

    newSocket.on('user_stop_typing', () => {
      setTyping(null);
    });

    newSocket.on('message_seen', () => {
      setMessages((prev) => prev.map((m) => ({ ...m, seen: true })));
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user._id]);

  // ─── Fetch Chats ──────────────────────────────────────────
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await chatAPI.getChats();
        setChats(data.data);

        // If URL has chatId, set it as active
        if (urlChatId) {
          const found = data.data.find((c) => c._id === urlChatId);
          if (found) setActiveChat(found);
        }
      } catch (err) {
        console.error('Failed to fetch chats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [urlChatId]);

  // ─── Fetch Messages when active chat changes ─────────────
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      setMsgLoading(true);
      try {
        const { data } = await messageAPI.getMessages(activeChat._id);
        setMessages(data.data);
        
        // API call to mark messages as seen
        await messageAPI.markChatMessagesSeen(activeChat._id);
        if (socket) {
          socket.emit('message_seen', { chatId: activeChat._id, userId: user._id });
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      } finally {
        setMsgLoading(false);
      }
    };

    fetchMessages();

    // Join this chat's socket room
    if (socket) {
      socket.emit('join_chat', activeChat._id);
    }

    return () => {
      if (socket) socket.emit('leave_chat', activeChat._id);
    };
  }, [activeChat, socket, user._id]);

  // ─── Auto-scroll to bottom on new messages ────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Send Message ─────────────────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat || !socket) return;

    const messageText = newMsg.trim();
    const tempId = Date.now().toString(); // Temporary ID for optimistic update

    // 1. Optimistic Update
    const optimisticMessage = {
      _id: tempId,
      chat: activeChat._id,
      sender: { _id: user._id, name: user.name },
      text: messageText,
      seen: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMsg('');
    socket.emit('stop_typing', { chatId: activeChat._id });
    inputRef.current?.focus();

    // 2. Persist to API
    try {
      const { data } = await messageAPI.sendMessage({
        chatId: activeChat._id,
        text: messageText,
      });

      const savedMessage = data.data;

      // Update the temporary message with the real one from DB
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? savedMessage : msg))
      );

      // Update lastMessage in chat list
      setChats((prev) =>
        prev.map((c) =>
          c._id === activeChat._id
            ? { ...c, lastMessage: { text: savedMessage.text, sender: user._id, createdAt: savedMessage.createdAt }, updatedAt: savedMessage.createdAt }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );

      // 3. Emit via socket (send the fully populated message)
      socket.emit('send_message', savedMessage);
    } catch (err) {
      console.error('Failed to send message', err);
      // Revert optimistic update on failure
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    }
  };

  // ─── Typing Indicator ────────────────────────────────────
  const handleTyping = (e) => {
    setNewMsg(e.target.value);

    if (!socket || !activeChat) return;
    socket.emit('typing', { chatId: activeChat._id, userName: user.name });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { chatId: activeChat._id });
    }, 1500);
  };

  // ─── Select Chat ──────────────────────────────────────────
  const selectChat = (chat) => {
    setActiveChat(chat);
    setMobileSidebarOpen(false);
    navigate(`/chat/${chat._id}`, { replace: true });
  };

  // ─── Get other participant ────────────────────────────────
  const getOtherUser = (chat) => {
    return chat.participants?.find((p) => p._id !== user._id) || {};
  };

  // ─── Format timestamp ────────────────────────────────────
  const formatMsgTime = (date) => {
    const d = new Date(date);
    if (isToday(d)) return format(d, 'h:mm a');
    if (isYesterday(d)) return 'Yesterday ' + format(d, 'h:mm a');
    return format(d, 'MMM d, h:mm a');
  };

  const formatChatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isToday(d)) return format(d, 'h:mm a');
    if (isYesterday(d)) return 'Yesterday';
    return format(d, 'MMM d');
  };

  // ─── Filter chats ────────────────────────────────────────
  const filteredChats = chats.filter((c) => {
    const other = getOtherUser(c);
    return other.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return <Loader text="Loading conversations..." />;

  return (
    <div className="max-w-6xl mx-auto px-0 sm:px-4 lg:px-8 py-0 sm:py-6">
      <div className="bg-white border border-gray-border rounded-none sm:rounded-2xl overflow-hidden shadow-sm flex" style={{ height: 'calc(100vh - 140px)' }}>

        {/* ── Sidebar: Chat List ───────────────────────────── */}
        <div className={`${mobileSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-border bg-white shrink-0`}>
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-border">
            <h2 className="text-lg font-bold text-dark flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Messages
            </h2>
            {/* Search */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-warm" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-border rounded-xl bg-gray-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const other = getOtherUser(chat);
                const isActive = activeChat?._id === chat._id;
                return (
                  <div
                    key={chat._id}
                    onClick={() => selectChat(chat)}
                    className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50
                      ${isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 bg-dark rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-sm font-semibold">
                        {other.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-dark truncate">{other.name || 'User'}</h3>
                        <span className="text-[10px] text-gray-warm shrink-0 ml-2">
                          {formatChatDate(chat.lastMessage?.createdAt || chat.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {chat.room && (
                          <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                            {chat.room.title?.substring(0, 15)}{chat.room.title?.length > 15 ? '…' : ''}
                          </span>
                        )}
                        <p className="text-xs text-gray-warm truncate">
                          {chat.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-12 text-center text-gray-warm">
                <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="text-xs mt-1">Start a chat from a room page!</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Main: Chat Window ───────────────────────────── */}
        <div className={`${!mobileSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-[#f8f9fa]`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-border">
                <button
                  onClick={() => { setMobileSidebarOpen(true); setActiveChat(null); }}
                  className="md:hidden p-1 text-gray-warm hover:text-dark"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-semibold">
                    {getOtherUser(activeChat).name?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark">
                    {getOtherUser(activeChat).name || 'User'}
                  </h3>
                  {typing ? (
                    <p className="text-xs text-green-600 animate-pulse">typing...</p>
                  ) : (
                    <p className="text-[11px] text-gray-warm">
                      {getOtherUser(activeChat).role === 'owner' ? 'Room Owner' : 'User'}
                      {activeChat.room && ` · ${activeChat.room.title}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {msgLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-warm text-sm">Loading messages...</div>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg, i) => {
                    const isMine = (msg.sender?._id || msg.sender) === user._id;
                    const showAvatar = i === 0 || (messages[i - 1]?.sender?._id || messages[i - 1]?.sender) !== (msg.sender?._id || msg.sender);

                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-3' : 'mt-0.5'}`}>
                        <div className={`max-w-[75%] ${isMine ? 'order-1' : 'order-2'}`}>
                          {/* Sender name (only for other user, on first message in a group) */}
                          {!isMine && showAvatar && (
                            <p className="text-[10px] text-gray-warm ml-1 mb-0.5">
                              {msg.sender?.name || 'User'}
                            </p>
                          )}

                          <div className={`px-3.5 py-2 rounded-2xl ${
                            isMine
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-gray-200 text-black rounded-bl-md shadow-sm'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-white/70' : 'text-gray-warm'}`}>
                              <span className="text-[10px]">{formatMsgTime(msg.createdAt)}</span>
                              {isMine && (
                                msg.seen
                                  ? <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                                  : <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-warm">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">No messages yet</p>
                      <p className="text-xs mt-1">Say hello! 👋</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 bg-white border-t border-gray-border">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMsg}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-border rounded-full bg-gray-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!newMsg.trim()}
                  className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-warm">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-dark mb-1">Your Messages</h3>
                <p className="text-sm max-w-xs mx-auto">
                  Select a conversation from the sidebar or start a new chat from a room page.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
