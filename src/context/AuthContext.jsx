import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getApiUrl, safeParseResponse } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('arpran_auth_token') || localStorage.getItem('arpran_admin_jwt') || null;
  });
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Authenticated fetch helper
  const authFetch = useCallback(async (url, options = {}) => {
    const currentToken = localStorage.getItem('arpran_auth_token') || localStorage.getItem('arpran_admin_jwt');
    const headers = {
      ...(options.headers || {})
    };

    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    let body = options.body;
    if (body && !(body instanceof FormData) && typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }

    try {
      const res = await fetch(getApiUrl(url), { ...options, headers, body });
      if (res.status === 401) {
        // Token expired or invalid: clear session
        localStorage.removeItem('arpran_auth_token');
        localStorage.removeItem('arpran_admin_jwt');
        setToken(null);
        setUser(null);
        setAdmin(null);
      }
      return res;
    } catch (err) {
      console.error('API request network error:', err);
      throw err;
    }
  }, []);

  // Validate existing token on mount
  useEffect(() => {
    async function checkAuth() {
      const activeToken = localStorage.getItem('arpran_auth_token') || localStorage.getItem('arpran_admin_jwt');
      if (!activeToken) {
        setIsLoading(false);
        return;
      }

      try {
        // 1. Try user authentication endpoint
        const resUser = await authFetch('/api/auth/me');
        const parsedUser = await safeParseResponse(resUser);
        if (parsedUser.ok && parsedUser.data?.success && parsedUser.data?.user) {
          setUser(parsedUser.data.user);
          if (parsedUser.data.user.role === 'admin' || parsedUser.data.user.role === 'superadmin') {
            setAdmin(parsedUser.data.user);
          }
          setIsLoading(false);
          return;
        }

        // 2. Fallback to admin authentication endpoint for legacy admin sessions
        const resAdmin = await authFetch('/api/admin/me');
        const parsedAdmin = await safeParseResponse(resAdmin);
        if (parsedAdmin.ok && parsedAdmin.data?.success && parsedAdmin.data?.admin) {
          setAdmin(parsedAdmin.data.admin);
          setUser({ ...parsedAdmin.data.admin, role: parsedAdmin.data.admin.role || 'admin' });
          setIsLoading(false);
          return;
        }

        // If both failed, invalidate token
        localStorage.removeItem('arpran_auth_token');
        localStorage.removeItem('arpran_admin_jwt');
        setToken(null);
        setUser(null);
        setAdmin(null);
      } catch (err) {
        console.warn('Auth check connection error:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [token, authFetch]);

  // User & Admin Signup handler
  const signup = async (signupData, p2, p3, p4, p5, p6, p7, p8) => {
    try {
      let payload;
      if (typeof signupData === 'object' && signupData !== null) {
        payload = signupData;
      } else {
        payload = {
          email: signupData,
          password: p2,
          confirmPassword: p3,
          name: p4 || '',
          phone: p5 || '',
          company: p6 || '',
          role: p7 || 'user',
          adminSecret: p8 || ''
        };
      }

      const res = await fetch(getApiUrl('/api/auth/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const parsed = await safeParseResponse(res);
      if (!parsed.ok || !parsed.data?.success) {
        throw new Error(parsed.error || 'Failed to create account');
      }

      const data = parsed.data;
      localStorage.setItem('arpran_auth_token', data.token);
      localStorage.setItem('arpran_admin_jwt', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.user.role === 'admin' || data.user.role === 'superadmin') {
        setAdmin(data.user);
      }
      return { success: true, message: data.message, user: data.user, token: data.token };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // User & Admin Login handler
  const login = async (email, password) => {
    try {
      // 1. Try dedicated Admin login endpoint first
      const adminRes = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const parsedAdmin = await safeParseResponse(adminRes);

      if (parsedAdmin.ok && parsedAdmin.data?.success && parsedAdmin.data?.admin) {
        const adminData = parsedAdmin.data;
        localStorage.setItem('arpran_auth_token', adminData.token);
        localStorage.setItem('arpran_admin_jwt', adminData.token);
        setToken(adminData.token);
        setAdmin(adminData.admin);
        setUser({ ...adminData.admin, role: adminData.admin.role || 'admin' });
        return { success: true, user: adminData.admin, message: adminData.message };
      }

      // 2. Try standard User login endpoint
      const userRes = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const parsedUser = await safeParseResponse(userRes);

      if (parsedUser.ok && parsedUser.data?.success && parsedUser.data?.user) {
        const userData = parsedUser.data;
        localStorage.setItem('arpran_auth_token', userData.token);
        localStorage.setItem('arpran_admin_jwt', userData.token);
        setToken(userData.token);
        setUser(userData.user);
        if (userData.user.role === 'admin' || userData.user.role === 'superadmin') {
          setAdmin(userData.user);
        }
        return { success: true, message: userData.message, user: userData.user };
      }

      // If both endpoints failed, extract the most descriptive error message
      const errorMessage =
        parsedAdmin.error ||
        parsedUser.error ||
        'Authentication failed. Please verify your email and password.';

      return { success: false, error: errorMessage };
    } catch (err) {
      console.error('Login request network error:', err);
      return {
        success: false,
        error: `Network error: ${err.message}. Please check if the backend service is running.`
      };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await fetch(getApiUrl('/api/auth/logout'), { method: 'POST' }).catch(() => {});
        await authFetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
      }
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('arpran_auth_token');
      localStorage.removeItem('arpran_admin_jwt');
      setToken(null);
      setUser(null);
      setAdmin(null);
    }
  };

  // Change password handler
  const changePassword = async (newPassword, oldPassword = '') => {
    try {
      const res = await authFetch('/api/admin/change-password', {
        method: 'POST',
        body: { newPassword, oldPassword }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password');
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update admin email handler
  const updateEmail = async (newEmail, name = '') => {
    try {
      const res = await authFetch('/api/admin/update-email', {
        method: 'POST',
        body: { newEmail, name }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update email');
      }
      if (data.admin) {
        setAdmin(data.admin);
        setUser(data.admin);
      }
      return { success: true, message: data.message, admin: data.admin };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const isAuthenticated = Boolean(user || admin || token);
  const isAdmin = Boolean(admin || (user && (user.role === 'admin' || user.role === 'superadmin')));

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        admin,
        isAuthenticated,
        isAdmin,
        isLoading,
        signup,
        login,
        logout,
        changePassword,
        updateEmail,
        authFetch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
