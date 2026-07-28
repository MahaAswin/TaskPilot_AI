import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios base settings
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync token to axios headers
  const setAuthHeader = (jwtToken) => {
    if (jwtToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Initialize: Load user profile if token is present
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        setAuthHeader(token);
        const response = await axios.get('/auth/profile');
        if (response.data?.success) {
          setUser(response.data.user);
        } else {
          // Token expired/invalid
          logout();
        }
      } catch (err) {
        console.error('[AuthContext] Load user error:', err.response?.data?.message || err.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data?.success) {
        const { token: jwtToken, user: userData } = response.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        setAuthHeader(jwtToken);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await axios.post('/auth/register', { name, email, password });
      if (response.data?.success) {
        const { token: jwtToken, user: userData } = response.data;
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
        setUser(userData);
        setAuthHeader(jwtToken);
        return { success: true };
      }
      return { success: false, message: 'Registration failed.' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try a different email.';
      setErrorMsg(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAuthHeader(null);
    setIsLoading(false);
  };

  // Update profile handler
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/auth/profile', profileData);
      if (response.data?.success) {
        setUser(response.data.user);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          setToken(response.data.token);
          setAuthHeader(response.data.token);
        }
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile settings.';
      throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      errorMsg,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
