import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get('/auth/me');
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      sessionStorage.removeItem('hotelpro_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.data?.success) {
      setUser(res.data.user);
      if (res.data.token) {
        sessionStorage.setItem('hotelpro_token', res.data.token);
      }
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    if (res.data?.success) {
      setUser(res.data.user);
      if (res.data.token) {
        sessionStorage.setItem('hotelpro_token', res.data.token);
      }
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      // Continue cleanup on frontend
    }
    setUser(null);
    sessionStorage.removeItem('hotelpro_token');
  };

  const updateProfile = async (data) => {
    const res = await axiosClient.put('/auth/profile', data);
    if (res.data?.success) {
      setUser(res.data.user);
    }
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        role: user?.role,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

