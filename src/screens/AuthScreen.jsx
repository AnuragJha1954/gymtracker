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
      <div className="glass-card w-full max-w-sm rounded-3xl p-8 space-y-8 animate-scale-in">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-inner">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black font-['Outfit'] text-white">GymTracker</h1>
          <p className="text-xs text-zinc-500 mt-2 font-mono">Isolated PWA Build</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18181b] border border-[#27272a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl uppercase tracking-wider text-sm transition-transform active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)] mt-4"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
