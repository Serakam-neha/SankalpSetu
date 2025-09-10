import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          // Verify token with backend
          const userData = await apiService.getCurrentUser();
          setUser(userData);
          setToken(savedToken);
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      let data;
      
      if (userData.loginMethod === 'google') {
        // Google OAuth login
        data = await apiService.googleAuth({
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          googleId: userData.sub || userData.googleId
        });
      } else {
        // Email/password login
        data = await apiService.login(userData.email, userData.password);
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const data = await apiService.register(userData.name, userData.email, userData.password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
