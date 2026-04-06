import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { encryptMessage, decryptMessage } from '../utils/crypto';
import { format } from 'date-fns';
import { Lock, Copy, Settings, Image as ImageIcon, Smile, Send, ChevronLeft, Check } from 'lucide-react';

const COMMON_EMOJIS = ['😀', '😂', '😅', '🤣', '😊', '😍', '🤔', '😎', '😭', '👍', '🙏', '🔥', '✨', '💀', '👀'];

const ChatWindow: React.FC = () => {
  const { groupId: routeGroupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { username, setGroupId, messages, members, sendMessage, leaveGroup } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (routeGroupId && routeGroupId.length === 32) {
      setGroupId(routeGroupId);
    } else {
      navigate('/dashboard');
    }
  }, [routeGroupId, setGroupId, navigate]);

  useEffect(() => {
    // Auto-scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !routeGroupId) return;
    
    // Encrypt right before passing to socket context
    const encrypted = encryptMessage(inputMessage.trim(), routeGroupId);
    sendMessage(encrypted, false);
    setInputMessage('');
    setShowEmoji(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && routeGroupId) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image exceeds 2MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const encrypted = encryptMessage(base64, routeGroupId);
        sendMessage(encrypted, true);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyCode = () => {
    if (routeGroupId) {
      navigator.clipboard.writeText(routeGroupId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeave = () => {
    leaveGroup();
    navigate('/dashboard');
  };

  return (
    <div className="flex h-screen bg-surface font-body text-on-surface overflow-hidden">
      
      {/* Sidebar - Group Settings */}
      <div className={`w-80 bg-surface-container-low border-r border-[#3a494a]/30 flex flex-col transition-all duration-300 ${showSettings ? 'translate-x-0' : '-translate-x-full absolute h-full z-20 md:relative md:translate-x-0'}`}>
        <div className="p-6 border-b border-[#3a494a]/30">
          <button onClick={handleLeave} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-label uppercase tracking-wider mb-6">
            <ChevronLeft size={16} /> Retreat
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-surface-container h-10 w-10 rounded-lg flex items-center justify-center border border-[#3a494a] photonic-glow">
              <Lock className="text-primary w-5 h-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-on-surface uppercase truncate">Active Channel</h2>
          </div>
          <div className="text-xs text-on-surface-variant font-label uppercase tracking-widest mt-4 mb-2">Access Key</div>
          <button 
            onClick={copyCode}
            className="w-full bg-surface-container flex items-center justify-between p-3 rounded-lg border border-[#3a494a]/50 hover:border-primary/50 transition-colors group"
          >
            <span className="font-mono text-xs truncate text-[#849495] group-hover:text-primary transition-colors">
              {routeGroupId?.substring(0, 16)}...
            </span>
            {copied ? <Check size={14} className="text-[#00f5ff]" /> : <Copy size={14} className="text-[#b9caca]" />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-xs text-on-surface-variant font-label uppercase tracking-widest mb-4">Operatives Node ({members.length})</div>
          <ul className="space-y-3">
            {members.map((member, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00f5ff] animate-pulse shadow-[0_0_8px_#00f5ff]"></div>
                <span className="font-medium text-sm">{member} {member === username && '(You)'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface relative z-10 w-full">
        {/* Header */}
        <header className="h-20 bg-surface-container/80 backdrop-blur-md border-b border-[#3a494a]/30 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-on-surface-variant" onClick={() => setShowSettings(!showSettings)}>
              <Settings size={20} />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg uppercase tracking-wide">Encrypted Relay</span>
                <div className="px-2 py-0.5 rounded text-[10px] font-label font-bold uppercase tracking-widest bg-primary-container/10 text-primary border border-primary/20 backdrop-blur">
                  AES-256
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => {
            const isSystem = msg.sender === 'SYSTEM';
            const isMe = msg.sender === username;
            
            // Decrypt the message payload
            const rawContent = decryptMessage(msg.encryptedText, routeGroupId || '');

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-4">
                  <div className="px-4 py-1 text-xs font-label uppercase tracking-widest text-[#dab9ff] bg-[#641fac]/10 border border-[#dab9ff]/20 rounded-full">
                    {rawContent}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-label uppercase tracking-wider ${isMe ? 'text-[#00f5ff]' : 'text-[#b9caca]'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-[#849495] font-mono">
                    {format(new Date(msg.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
                
                <div className={`relative max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-3 ${
                  isMe 
                  ? 'bg-surface-container-highest ghost-border rounded-tr-none' 
                  : 'bg-surface-container border border-[#3a494a]/50 rounded-tl-none'
                }`}>
                  {msg.isImage ? (
                    <img src={rawContent} alt="Encrypted attachment" className="rounded-lg max-h-64 object-contain" />
                  ) : (
                    <p className="font-body text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                      {rawContent}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-end gap-1 mt-2">
                    {msg.edited && <span className="text-[9px] uppercase tracking-widest text-on-surface-variant mr-1">Edited</span>}
                    <Lock size={10} className="text-[#00f5ff]/70" />
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-lowest border-t border-[#3a494a]/30 relative">
          
          {showEmoji && (
            <div className="absolute bottom-20 left-4 bg-surface-container border border-[#3a494a]/50 p-2 rounded-xl grid grid-cols-5 gap-2 z-20 shadow-xl">
              {COMMON_EMOJIS.map(e => (
                <button key={e} onClick={() => { setInputMessage(p => p + e); setShowEmoji(false); }} className="hover:bg-surface-container-highest p-1 rounded">
                  {e}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-end gap-2 max-w-5xl mx-auto w-full relative">
            
            <div className="flex-1 bg-surface-container-highest rounded-xl border border-[#3a494a]/50 focus-within:border-primary/50 transition-colors flex items-center p-2 relative">
              
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                <Smile size={20} />
              </button>
              
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                accept="image/png, image/jpeg, image/gif, image/webp" 
                className="hidden" 
              />

              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Transmit encrypted payload..."
                className="flex-1 bg-transparent border-none text-on-surface focus:outline-none px-2 font-body text-[15px]"
                autoComplete="off"
              />
            </div>

            <button 
              type="submit"
              disabled={!inputMessage.trim()}
              className="h-12 w-12 rounded-xl primary-gradient-btn flex items-center justify-center disabled:opacity-50 hover:photonic-glow transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
