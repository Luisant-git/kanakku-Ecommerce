import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLogin = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Decode JWT token (simple base64 decode for payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token has expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        localStorage.removeItem('token');
        return false;
      }

      // Check if user type is 'user'
      if (payload.type !== 'user') {
        return false;
      }

      return payload;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  };

  useEffect(() => {
    const userData = isLogin();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const userData = isLogin();
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLogin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};