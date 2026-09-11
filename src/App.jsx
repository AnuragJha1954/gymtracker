import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import GymTracker from './screens/GymTracker';
import { Home, LineChart, History, User } from 'lucide-react';
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
    <div className="flex flex-col min-h-[100dvh] bg-[#050506]">
      <InstallPrompt />
      
      <div className="flex-1 w-full pb-[80px]">
        <div className={`w-full h-full ${tab === 'tracker' ? 'block' : 'hidden'}`}>
          <GymTracker />
        </div>
        <div className={`w-full h-[calc(100dvh-80px)] ${tab === 'plan' ? 'block' : 'hidden'}`}>
          <iframe 
            src={`/${user.plan}.html`} 
            className="w-full h-full border-none bg-white"
            title="Workout Plan"
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#1c1c1f] pt-3 pb-5 px-[22px] bg-[#050506]">
        <div 
          onClick={() => setTab('tracker')}
          className={`flex-1 flex flex-col items-center gap-[5px] cursor-pointer ${tab === 'tracker' ? 'text-[#3B82F6]' : 'text-[#5A5A62]'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Track</span>
        </div>
        
        <div 
          onClick={() => setTab('plan')}
          className={`flex-1 flex flex-col items-center gap-[5px] cursor-pointer ${tab === 'plan' ? 'text-[#3B82F6]' : 'text-[#5A5A62]'}`}
        >
          <LineChart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Plan</span>
        </div>

        <div 
          onClick={logout}
          className="flex-1 flex flex-col items-center gap-[5px] text-[#5A5A62] cursor-pointer hover:text-red-400 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
}
