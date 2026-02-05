import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '@/services/api';

export type UserRole = 'admin' | 'user' | null;

export interface User {
  _id: string;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  status?: string;
  address?: string;
  village?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { username: string; phone: string; password: string; }) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

// Update user in both state and localStorage
const updateUserInStorage = (userData: User) => {
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch {
          // Token might be invalid, try parsing saved user
          try {
            const parsedUser = JSON.parse(savedUser);
            if (parsedUser && parsedUser._id) {
              setUser(parsedUser);
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      // Login via API (handles admin and regular users)
      const response = await apiLogin(username, password);
      
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        _id: response.user?._id || response._id,
        username: response.user?.username || response.username,
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
        phone: response.user?.phone || response.phone,
        role: response.user?.role || response.role || 'user',
        status: response.user?.status || response.status || 'pending'
      };
      
      setUser(updateUserInStorage(userData));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const register = useCallback(async (data: { username: string; phone: string; password: string; }): Promise<boolean> => {
    try {
      const response = await apiRegister(data);
      
      localStorage.setItem('token', response.token);
      
      const userData: User = {
        _id: response.user?._id || response._id,
        username: response.user?.username || response.username,
        phone: response.user?.phone || response.phone,
        role: response.user?.role || response.role || 'user',
        status: response.user?.status || 'pending'
      };
      
      setUser(updateUserInStorage(userData));
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...userData };
      updateUserInStorage(updated);
      return updated;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(updateUserInStorage(userData));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      logout, 
      register,
      updateUser,
      refreshUser,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
