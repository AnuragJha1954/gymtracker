import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlanById } from '../data/seedPlans';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [settings, setSettings] = useState({
    units: 'kg',
    theme: 'dark',
    defaultRestSeconds: 90,
    hapticsEnabled: true,
    soundEnabled: true,
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('gymtracker_user');
      const savedToken = localStorage.getItem('gymtracker_token');
      const savedSettings = localStorage.getItem('gymtracker_settings');
      
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
        applyTheme(parsed.theme || 'dark');
      } else {
        applyTheme('dark');
      }
    } catch (e) {
      console.error('Error loading session:', e);
    }
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', systemDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme || 'dark');
    }
  };

  const updateSettings = (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    localStorage.setItem('gymtracker_settings', JSON.stringify(merged));
    if (newSettings.theme) {
      applyTheme(newSettings.theme);
    }
  };

  const login = (username, password, remember = true) => {
    const cleanUser = username?.toLowerCase().trim();
    
    // Seed credentials
    if (cleanUser === 'anurag' && password === 'gympass1') {
      const u = { id: 'user_anurag', name: 'Anurag', plan: 'plan1', role: 'athlete', goal: 'recomp' };
      const tok = 'mock_token_' + u.id;
      setUser(u);
      setToken(tok);
      if (remember) {
        localStorage.setItem('gymtracker_user', JSON.stringify(u));
        localStorage.setItem('gymtracker_token', tok);
      }
      return true;
    }

    if (cleanUser === 'aman' && password === 'gympass2') {
      const u = { id: 'user_aman', name: 'Aman', plan: 'plan2', role: 'athlete', goal: 'bulk' };
      const tok = 'mock_token_' + u.id;
      setUser(u);
      setToken(tok);
      if (remember) {
        localStorage.setItem('gymtracker_user', JSON.stringify(u));
        localStorage.setItem('gymtracker_token', tok);
      }
      return true;
    }

    // Check custom registered users from local storage
    try {
      const usersDb = JSON.parse(localStorage.getItem('gymtracker_registered_users') || '[]');
      const found = usersDb.find(u => u.username.toLowerCase() === cleanUser && u.password === password);
      if (found) {
        const u = { id: found.id, name: found.name, plan: found.plan || 'plan1', goal: found.goal || 'strength' };
        const tok = 'mock_token_' + u.id;
        setUser(u);
        setToken(tok);
        if (remember) {
          localStorage.setItem('gymtracker_user', JSON.stringify(u));
          localStorage.setItem('gymtracker_token', tok);
        }
        return true;
      }
    } catch (_) {}

    throw new Error('Invalid username or password.');
  };

  const signup = ({ username, password, name, goal = 'recomp', plan = 'plan1' }) => {
    const cleanUser = username?.toLowerCase().trim();
    if (!cleanUser || cleanUser.length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    try {
      const usersDb = JSON.parse(localStorage.getItem('gymtracker_registered_users') || '[]');
      if (usersDb.some(u => u.username.toLowerCase() === cleanUser) || cleanUser === 'anurag' || cleanUser === 'aman') {
        throw new Error('Username is already taken. Please choose another.');
      }

      const newUser = {
        id: 'usr_' + Date.now().toString(36),
        username: cleanUser,
        password,
        name: name || cleanUser,
        plan,
        goal
      };

      usersDb.push(newUser);
      localStorage.setItem('gymtracker_registered_users', JSON.stringify(usersDb));

      return login(cleanUser, password, true);
    } catch (err) {
      throw err;
    }
  };

  const updateUserPlan = (planId) => {
    if (!user) return;
    const updated = { ...user, plan: planId };
    setUser(updated);
    localStorage.setItem('gymtracker_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gymtracker_user');
    localStorage.removeItem('gymtracker_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      settings,
      login,
      signup,
      logout,
      updateSettings,
      updateUserPlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};
