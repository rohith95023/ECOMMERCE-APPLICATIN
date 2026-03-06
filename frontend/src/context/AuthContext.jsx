import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Refresh profile from DB to sync role/status changes
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Session expired or invalid", err);
          logout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login using OAuth2 form (FastAPI expects username + password form data)
  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await axios.post('/api/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    // Fetch real profile from backend
    const profileRes = await axios.get('/api/auth/me');
    const profile = profileRes.data;
    
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
    return response.data;
  };

  // Register a new user and automatically log them in
  const register = async (formData) => {
    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'customer',
    };
    await axios.post('/api/auth/register', payload);
    // Auto-login after successful registration
    await login(formData.email, formData.password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
