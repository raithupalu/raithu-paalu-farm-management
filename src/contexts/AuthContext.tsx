import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type UserRole = 'admin' | 'user' | null;

interface User {
  id: string;
  username: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Demo credentials
const DEMO_USERS = {
  admin: { id: '1', username: 'admin', password: 'admin123', role: 'admin' as UserRole },
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    // Check admin credentials
    if (username === DEMO_USERS.admin.username && password === DEMO_USERS.admin.password) {
      const adminUser: User = {
        id: DEMO_USERS.admin.id,
        username: DEMO_USERS.admin.username,
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // For demo purposes, allow any other username/password as regular user
    if (username && password.length >= 6) {
      const regularUser: User = {
        id: Date.now().toString(),
        username,
        role: 'user',
      };
      setUser(regularUser);
      localStorage.setItem('user', JSON.stringify(regularUser));
      return true;
    }
    
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const register = useCallback(async (username: string, password: string, phone: string): Promise<boolean> => {
    // For demo purposes, allow registration with valid data
    if (username && password.length >= 6 && phone.length >= 10) {
      const newUser: User = {
        id: Date.now().toString(),
        username,
        role: 'user',
        phone,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      login, 
      logout, 
      register 
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
