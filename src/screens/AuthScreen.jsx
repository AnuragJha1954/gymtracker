import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen px-6 bg-[#050506]">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="font-display text-[44px] text-[#F5F1EA] leading-[0.95] tracking-tight">
          GYM<br/><span className="text-[#3B82F6]">TRACKER</span>
        </div>
        <div className="mt-2.5 text-[12.5px] text-[#5A5A62]">
          Track sets. See progress. No fluff.
        </div>

        {error && (
          <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6">
          <div className="mt-[22px]">
            <label className="block text-[10.5px] text-[#5A5A62] uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-b border-[#2a2a2e] text-[#F5F1EA] font-sans text-[15px] py-2 focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#45454a]"
              placeholder="your_username"
              required
            />
          </div>
          
          <div className="mt-[22px]">
            <label className="block text-[10.5px] text-[#5A5A62] uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-[#2a2a2e] text-[#F5F1EA] font-sans text-[15px] py-2 focus:outline-none focus:border-[#3B82F6] transition-colors placeholder-[#45454a]"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-[34px] w-full bg-[#3B82F6] text-[#0A1628] border-none py-[17px] font-bold text-[14.5px] rounded-[4px] tracking-wide active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
          </button>
        </form>

        <div className="text-center mt-[18px] text-[12px] text-[#5A5A62]">
          New here? <b className="text-[#cfcfd2] font-semibold cursor-pointer hover:text-white transition-colors">Create an account</b>
        </div>
      </div>
      
      <div className="pb-[34px] text-center">
        <div className="text-[10.5px] text-[#3f3f43] tracking-widest uppercase">
          V1.0 · BUILT FOR THE GYM FLOOR
        </div>
      </div>
    </div>
  );
}
