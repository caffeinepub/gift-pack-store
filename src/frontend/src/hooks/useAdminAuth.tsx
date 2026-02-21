import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_SESSION_KEY = 'admin_session';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate async authentication
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
