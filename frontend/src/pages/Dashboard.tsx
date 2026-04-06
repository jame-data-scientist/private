import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { generateRoomCode } from '../utils/crypto';
import { Shield, Plus, LogIn, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { username, setUsername } = useChat();
  const navigate = useNavigate();
  
  const [isJoinMode, setIsJoinMode] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGroup = () => {
    // Generate UUID, navigate to chat
    const code = generateRoomCode();
    navigate(`/chat/${code}`);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim().length === 32) {
      navigate(`/chat/${joinCode.trim()}`);
    } else {
      alert('Encryption key must be exactly 32 characters long.');
    }
  };

  const handleLogout = () => {
    setUsername(null);
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] p-4 font-body text-[#e5e1e4] flex flex-col relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f5ff] rounded-full mix-blend-screen filter blur-[200px] opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center py-6 px-4 md:px-8 relative z-10 border-b border-[#3a494a]/30">
        <div className="flex items-center gap-3">
          <Shield className="text-[#00f5ff] w-6 h-6" />
          <h2 className="text-xl font-display font-medium uppercase tracking-widest text-[#b9caca]">
            Operative: <span className="text-[#e5e1e4] font-bold">{username}</span>
          </h2>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-label uppercase tracking-widest text-[#ffb4ab] hover:text-[#ffdad6] transition-colors"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          
          {/* Create Group Panel */}
          <div className="bg-[#201f21] rounded-2xl p-8 border border-[#3a494a]/50 hover:border-[#00f5ff]/50 transition-colors duration-300 group">
            <div className="w-14 h-14 bg-[#1b1b1d] rounded-xl flex items-center justify-center border border-[#3a494a] mb-6 group-hover:photonic-glow transition-all">
              <Plus className="text-[#00f5ff] w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase mb-4 text-[#e5e1e4]">Initialize Secure Channel</h3>
            <p className="text-[#849495] mb-8 leading-relaxed">
              Create a new end-to-end encrypted chat room. A 32-character cryptographic key will be generated for distribution.
            </p>
            <button 
              onClick={handleCreateGroup}
              className="w-full primary-gradient-btn py-4 rounded-xl font-label uppercase tracking-widest text-sm font-semibold hover:photonic-glow-strong transition-all focus:outline-none"
            >
              Generate Protocol
            </button>
          </div>

          {/* Join Group Panel */}
          <div className="bg-[#201f21] rounded-2xl p-8 border border-[#3a494a]/50 hover:border-[#dab9ff]/50 transition-colors duration-300 group">
            <div className="w-14 h-14 bg-[#1b1b1d] rounded-xl flex items-center justify-center border border-[#3a494a] mb-6 shadow-[#dab9ff]/0 group-hover:shadow-[0_0_20px_rgba(218,185,255,0.15)] transition-all">
              <LogIn className="text-[#dab9ff] w-8 h-8" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase mb-4 text-[#e5e1e4]">Join Active Channel</h3>
            <p className="text-[#849495] mb-8 leading-relaxed">
              Enter an existing 32-character encryption key to establish connection and decrypt communications.
            </p>
            
            {!isJoinMode ? (
              <button 
                onClick={() => setIsJoinMode(true)}
                className="w-full bg-[#353437] text-[#e5e1e4] py-4 rounded-xl font-label uppercase tracking-widest text-sm font-semibold hover:bg-[#3a494a] transition-all ghost-border focus:outline-none"
              >
                Enter Access Key
              </button>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="32-Character Key..."
                  maxLength={32}
                  minLength={32}
                  required
                  autoFocus
                  className="w-full bg-[#131315] border border-[#dab9ff]/30 text-[#e5e1e4] py-4 px-4 rounded-xl font-mono text-center tracking-widest focus:border-[#dab9ff] focus:outline-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                />
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#641fac] to-[#dab9ff] text-[#131315] py-4 rounded-xl font-label uppercase tracking-widest text-sm font-semibold hover:shadow-[0_0_20px_rgba(218,185,255,0.3)] transition-all focus:outline-none"
                >
                  Decrypt & Join
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
