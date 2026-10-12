import React, { useState } from 'react';
import { 
  User, Moon, Sun, Monitor, Timer, Download, Upload, 
  LogOut, Shield, Vibrate, Volume2, Check, AlertTriangle 
} from 'lucide-react';
import { Card, Button } from '../components/common/UIElements';
import { haptics } from '../utils/haptics';

export default function ProfileScreen({
  user,
  settings,
  updateSettings,
  onLogout,
  workouts = []
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Export all user data as JSON file
  const handleExportData = () => {
    haptics.success();
    const exportObject = {
      user,
      settings,
      workouts,
      bodyMetrics: JSON.parse(localStorage.getItem('gymtracker_body_metrics') || '[]'),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymtrack_backup_${user?.username || 'user'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.workouts && Array.isArray(data.workouts)) {
          localStorage.setItem('gymtracker_cache_workouts', JSON.stringify(data.workouts));
          if (data.bodyMetrics) {
            localStorage.setItem('gymtracker_body_metrics', JSON.stringify(data.bodyMetrics));
          }
          haptics.celebratePR();
          alert('Data restored successfully! Refreshing app...');
          window.location.reload();
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-fade-in select-none">
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
          Preferences & Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">
          Athlete <span className="text-blue-500">Profile</span>
        </h1>
      </div>

      {/* User Card */}
      <Card className="p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-600/30 shrink-0">
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-white truncate">{user?.name || 'Athlete'}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
            <span>@{user?.username || 'user'}</span>
            <span>•</span>
            <span className="text-blue-400 uppercase font-bold">{user?.goal || 'Recomp'}</span>
          </div>
        </div>
      </Card>

      {/* Display & Theme Setting */}
      <Card className="p-5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'system', label: 'System', icon: Monitor }
          ].map(t => {
            const Icon = t.icon;
            const isSelected = settings.theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  updateSettings({ theme: t.id });
                  haptics.light();
                }}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 tap-target ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Units & Defaults */}
      <Card className="p-5 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
          Workout Defaults
        </h3>

        {/* Units Switcher */}
        <div className="flex justify-between items-center py-1">
          <div>
            <div className="text-sm font-bold text-white">Weight Units</div>
            <div className="text-xs text-slate-500">Kilograms (kg) or Pounds (lbs)</div>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {['kg', 'lbs'].map(u => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  updateSettings({ units: u });
                  haptics.light();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                  settings.units === u ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Rest Timer Default */}
        <div className="flex justify-between items-center py-1 border-t border-slate-800/80 pt-3">
          <div>
            <div className="text-sm font-bold text-white">Default Rest Timer</div>
            <div className="text-xs text-slate-500">Auto-countdown between sets</div>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[60, 90, 120].map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => {
                  updateSettings({ defaultRestSeconds: sec });
                  haptics.light();
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  settings.defaultRestSeconds === sec ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Data Management & Backup */}
      <Card className="p-5 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
          Data & Backup
        </h3>

        <div className="flex gap-2.5">
          <Button
            variant="secondary"
            size="md"
            className="flex-1 text-xs"
            onClick={handleExportData}
            icon={Download}
          >
            Export Backup
          </Button>

          <label className="flex-1">
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportData} 
              className="hidden" 
            />
            <div className="w-full h-full font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs flex items-center justify-center gap-2 tap-target cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Backup</span>
            </div>
          </label>
        </div>
      </Card>

      {/* Logout Action (Moved out of bottom tabs into Profile!) */}
      <Card className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-bold text-white">Account Session</div>
            <div className="text-xs text-slate-500">Log out of this device</div>
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={() => setShowLogoutConfirm(true)}
            icon={LogOut}
            className="text-xs font-bold"
          >
            Log Out
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-sm rounded-[24px] border p-6 text-center shadow-2xl animate-scale-in"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg font-black text-white">Log Out?</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Your workouts are backed up locally and in the cloud. You can log back in at any time.
            </p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="md"
                className="flex-1"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex-1"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
              >
                Confirm Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
