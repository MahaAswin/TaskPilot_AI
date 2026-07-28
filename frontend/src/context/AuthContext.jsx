import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure default base API url
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync JWT Token with Axios Headers
  const setAuthHeader = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // On Mount: Load user profile from stored token
  useEffect(() => {
    const initSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setAuthHeader(token);
        const res = await axios.get('/auth/me');
        if (res.data?.success) {
          setUser(res.data.data);
        } else {
          logout();
        }
      } catch (err) {
        console.error('[AuthSession Error]', err.response?.data?.message || err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [token]);

  // Login operation
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { token: jwtToken, user: userData } = res.data.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        setAuthHeader(jwtToken);
        return res.data;
      }
      throw new Error('Unexpected response format from server');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Invalid credentials.';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Register operation
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      if (res.data?.success) {
        const { token: jwtToken, user: userData } = res.data.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        setAuthHeader(jwtToken);
        return res.data;
      }
      throw new Error('Unexpected response format from server');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password token fetcher
  const forgotPassword = async (email) => {
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Password recovery request failed.';
      throw new Error(msg);
    }
  };

  // Reset password execution
  const resetPassword = async (resetToken, password) => {
    try {
      const res = await axios.post('/auth/reset-password', { token: resetToken, password });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Password reset request failed.';
      throw new Error(msg);
    }
  };

  // Update profile attributes
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/auth/update-profile', profileData);
      if (res.data?.success) {
        setUser(res.data.data);
        return res.data.data;
      }
      throw new Error('Failed to update profile settings.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile settings update failed.';
      throw new Error(msg);
    }
  };

  // Change password credentials
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await axios.post('/auth/change-password', { oldPassword, newPassword });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Password changes failed.';
      throw new Error(msg);
    }
  };

  // Terminate credentials sessions
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      forgotPassword,
      resetPassword,
      updateProfile,
      changePassword,
      logout
    }}>
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

export default AuthContext;
