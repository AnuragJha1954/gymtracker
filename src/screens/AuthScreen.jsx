import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dumbbell } from 'lucide-react';

export default function AuthScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(username.toLowerCase(), password)) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm rounded-[24px] p-8 space-y-8 animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#14F1D9]/10 border border-[#14F1D9]/20 rounded-[20px] flex items-center justify-center text-white mb-4 shadow-inner">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black font-['Outfit'] text-white">GymTracker</h1>
          <p className="text-xs text-slate-500 mt-2 font-mono">Isolated PWA Build</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#141A25] border border-[#263143] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#14F1D9] transition-colors"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141A25] border border-[#263143] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#14F1D9] transition-colors"
            />
          </div>

          {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3.5 bg-[#14F1D9] hover:bg-[#0ED4BF] text-[#0B111A] font-black rounded-xl uppercase tracking-wider text-sm transition-transform active:scale-95 shadow-[0_0_20px_rgba(20,241,217,0.1)] mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
