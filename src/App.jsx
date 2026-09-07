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
    <div className="flex flex-col h-screen bg-[#050506]">
      <InstallPrompt />
      
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {tab === 'tracker' && <GymTracker />}
        {tab === 'plan' && (
          <div className="w-full h-full">
            <iframe 
              src={`/${user.plan}.html`} 
              className="w-full h-full border-none bg-white"
              title="Workout Plan"
            />
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex border-t border-[#1c1c1f] pt-3 pb-5 px-[22px] bg-[#050506]">
        <div 
          onClick={() => setTab('tracker')}
          className={`flex-1 flex flex-col items-center gap-[5px] cursor-pointer ${tab === 'tracker' ? 'text-[#3B82F6]' : 'text-[#5A5A62]'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </div>
        
        <div 
          onClick={() => setTab('plan')}
          className={`flex-1 flex flex-col items-center gap-[5px] cursor-pointer ${tab === 'plan' ? 'text-[#3B82F6]' : 'text-[#5A5A62]'}`}
        >
          <LineChart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Progress</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-[5px] text-[#5A5A62] cursor-pointer hover:text-[#3B82F6] transition-colors">
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium">History</span>
        </div>

        <div 
          onClick={logout}
          className="flex-1 flex flex-col items-center gap-[5px] text-[#5A5A62] cursor-pointer hover:text-red-400 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </div>
      </div>
    </div>
  );
}
