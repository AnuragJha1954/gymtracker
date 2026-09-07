import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('gymtracker_user');
    const savedToken = localStorage.getItem('gymtracker_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (username, password) => {
    if (username === 'anurag' && password === 'gympass1') {
      const u = { id: 'user_anurag', name: 'Anurag', plan: 'plan1' };
      // Normally we'd fetch a JWT from backend. We mock it for the client here,
      // but to call the Vercel backend we actually need a valid JWT signed with JWT_SECRET.
      // Wait, since we copied api/data.js, it uses jwt.verify(token, process.env.JWT_SECRET).
      // We must generate a real token or change api/data.js to accept mock tokens!
      // Let's modify api/data.js to bypass auth for this isolated app, OR sign a token on a mock login endpoint.
      // Easiest is to modify api/data.js to accept a simple header for this app.
      
      setUser(u);
      setToken('mock_token_' + u.id);
      localStorage.setItem('gymtracker_user', JSON.stringify(u));
      localStorage.setItem('gymtracker_token', 'mock_token_' + u.id);
      return true;
    }
    if (username === 'aman' && password === 'gympass2') {
      const u = { id: 'user_aman', name: 'Aman', plan: 'plan2' };
      setUser(u);
      setToken('mock_token_' + u.id);
      localStorage.setItem('gymtracker_user', JSON.stringify(u));
      localStorage.setItem('gymtracker_token', 'mock_token_' + u.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gymtracker_user');
    localStorage.removeItem('gymtracker_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
