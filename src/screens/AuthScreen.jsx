import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { Button } from '../components/common/UIElements';
import { haptics } from '../utils/haptics';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('recomp');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    haptics.light();
    
    try {
      if (isSignUp) {
        await signup({ username, password, name, goal });
      } else {
        await login(username, password);
      }
      haptics.success();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  const fillQuickUser = (u, p) => {
    setUsername(u);
    setPassword(p);
    setError('');
    haptics.light();
  };

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 justify-between max-w-md mx-auto w-full select-none">
      {/* Brand Header */}
      <div className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs uppercase tracking-widest font-black text-blue-500 font-mono">V2.0 Pro</span>
        </div>
        
        <h1 className="font-display text-[42px] leading-[0.92] tracking-tight uppercase">
          GYM<span className="text-blue-500">TRACK</span>
        </h1>
        <p className="mt-2 text-xs text-slate-400 font-medium">
          {isSignUp ? 'Build your workout profile & track progress.' : 'Precision logging for progressive overload.'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="my-auto py-6">
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)'
                  }}
                  placeholder="e.g. Anurag Jha"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
                placeholder="username"
                required
              />
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-600 border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}
                placeholder="••••••••"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Primary Goal
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'recomp', label: 'Recomp' },
                  { id: 'hypertrophy', label: 'Muscle' },
                  { id: 'strength', label: 'Strength' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      goal === g.id 
                        ? 'bg-blue-600 text-white border-blue-500' 
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            variant="primary"
            size="lg"
            className="w-full mt-2"
          >
            {isLoading ? 'PLEASE WAIT...' : isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}
          </Button>
        </form>

        {/* Toggle sign in / sign up */}
        <div className="text-center mt-5 text-xs text-slate-400">
          {isSignUp ? 'Already have an account?' : 'Need an account?'}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              haptics.light();
            }}
            className="text-blue-400 hover:text-blue-300 font-bold underline ml-1 cursor-pointer"
          >
            {isSignUp ? 'Log in' : 'Create one'}
          </button>
        </div>

        {/* 1-Tap Quick Fill for Anurag & Aman */}
        {!isSignUp && (
          <div className="mt-8 pt-5 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2 text-center">
              Quick Test Switcher
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillQuickUser('anurag', 'gympass1')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Anurag (Plan 1)
              </button>
              <button
                type="button"
                onClick={() => fillQuickUser('aman', 'gympass2')}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Aman (Plan 2)
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center pb-2">
        <div className="text-[10px] text-slate-500 tracking-widest uppercase font-mono">
          BUILT FOR THE GYM FLOOR · OFFLINE READY
        </div>
      </div>
    </div>
  );
}
