import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { Fingerprint } from 'lucide-react';

const Landing: React.FC = () => {
  const [name, setName] = useState('');
  const { setUsername, username } = useChat();
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (username) {
      navigate('/dashboard');
    }
  }, [username, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setUsername(name.trim());
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e10] p-6 relative overflow-hidden">
      {/* Decorative background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f5ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#641fac] rounded-full mix-blend-screen filter blur-[150px] opacity-10" />

      <div className="glass-panel p-10 rounded-2xl w-full max-w-md relative z-10 border border-[#3a494a]/30">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-[#201f21] rounded-full border border-[#3a494a] flex items-center justify-center mb-6 photonic-glow">
            <Fingerprint className="text-[#00f5ff] w-8 h-8" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-[#e5e1e4] mb-2 uppercase">
            Neon <span className="primary-gradient-text">Cipher</span>
          </h1>
          <p className="text-[#b9caca] text-sm font-label tracking-wider uppercase">
            Secure Tactical Comms
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="sys-identity" className="block text-xs font-label uppercase text-[#00f5ff] tracking-widest">
              Identity Designation
            </label>
            <div className="relative">
              <input
                id="sys-identity"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                maxLength={20}
                required
                className="w-full bg-[#353437] text-[#e5e1e4] font-body text-lg py-4 px-4 rounded-xl placeholder-[#849495] ghost-border-focus transition-all duration-300"
                placeholder="Enter Operative Name"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#00f5ff] block animate-pulse"></span>
                <span className="w-1.5 h-1.5 bg-[#dbdbdb] block opacity-20"></span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full primary-gradient-btn py-4 rounded-xl font-display font-semibold text-lg tracking-wide uppercase shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#00f5ff]/40 transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Initiate Session
          </button>
        </form>

        <div className="mt-8 text-center text-xs font-label text-[#849495] uppercase tracking-widest flex items-center justify-center gap-2">
          <span>End-to-End Encrypted</span>
          <span className="w-1 h-1 bg-[#641fac] rounded-full"></span>
          <span>No DB logs</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
