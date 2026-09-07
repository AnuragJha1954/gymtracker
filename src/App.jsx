import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import GymTracker from './screens/GymTracker';
import { Dumbbell, FileText, LogOut } from 'lucide-react';
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
    <div className="min-h-screen pb-20">
      <InstallPrompt />
      {tab === 'tracker' && <GymTracker />}
      {tab === 'plan' && (
        <div className="w-full h-screen">
          <iframe 
            src={`/${user.plan}.html`} 
            className="w-full h-[calc(100vh-80px)] border-none"
            title="Workout Plan"
          />
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0c0c0e]/90 backdrop-blur-xl border-t border-[#27272a] pb-safe z-40">
        <div className="flex items-center justify-around px-6 py-3 max-w-md mx-auto">
          <button 
            onClick={() => setTab('tracker')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${tab === 'tracker' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-[10px] font-bold font-mono uppercase">Tracker</span>
          </button>
          
          <button 
            onClick={() => setTab('plan')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${tab === 'plan' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-[10px] font-bold font-mono uppercase">My Plan</span>
          </button>

          <button 
            onClick={logout}
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-bold font-mono uppercase">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
