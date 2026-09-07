import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import GymTracker from './screens/GymTracker';
import { Home, BarChart2, Heart, User, Dumbbell } from 'lucide-react';
import InstallPrompt from './components/InstallPrompt';

export default function App() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('tracker');

  if (!user) {
    return (
      <>
        <InstallPrompt />
        <AuthScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#0B111A]">
      <InstallPrompt />
      {tab === 'tracker' && <GymTracker />}
      {tab === 'plan' && (
        <div className="w-full h-screen">
          <iframe 
            src={`/${user.plan}.html`} 
            className="w-full h-[calc(100vh-80px)] border-none bg-white"
            title="Workout Plan"
          />
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0B111A]/95 backdrop-blur-xl border-t border-[#141A25] pb-safe z-40">
        <div className="flex items-center justify-between px-6 py-4 max-w-md mx-auto">
          <button 
            onClick={() => setTab('tracker')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${tab === 'tracker' ? 'bg-[#14F1D9] text-[#0B111A] shadow-[0_0_20px_rgba(20,241,217,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Home className="w-5 h-5" />
            {tab === 'tracker' && <span className="text-sm font-bold tracking-wide">Home</span>}
          </button>
          
          <button 
            onClick={() => setTab('plan')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ${tab === 'plan' ? 'bg-[#14F1D9] text-[#0B111A] shadow-[0_0_20px_rgba(20,241,217,0.3)]' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <BarChart2 className="w-5 h-5" />
            {tab === 'plan' && <span className="text-sm font-bold tracking-wide">Plan</span>}
          </button>

          <button className="text-slate-500 hover:text-slate-300 p-2 transition-colors">
            <Heart className="w-5 h-5" />
          </button>

          <button 
            onClick={logout}
            className="text-slate-500 hover:text-rose-400 p-2 transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
