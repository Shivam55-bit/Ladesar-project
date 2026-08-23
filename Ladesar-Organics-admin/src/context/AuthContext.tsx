import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRoleType = 'Super Admin' | 'Inventory Manager' | 'Order Fulfillment' | 'Store Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRoleType;
  avatar?: string;
  token?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, role?: AdminRoleType) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (role: AdminRoleType) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<AdminRoleType, AdminUser> = {
  'Super Admin': {
    id: 'usr-admin-1',
    name: 'Vaidya R. K. Sharma',
    email: 'admin@ladesar.com',
    role: 'Super Admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    token: 'jwt-super-admin-mock-token'
  },
  'Inventory Manager': {
    id: 'usr-inv-1',
    name: 'Vikram Singh',
    email: 'inventory@ladesar.com',
    role: 'Inventory Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    token: 'jwt-inventory-mock-token'
  },
  'Order Fulfillment': {
    id: 'usr-ord-1',
    name: 'Ananya Deshmukh',
    email: 'orders@ladesar.com',
    role: 'Order Fulfillment',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    token: 'jwt-orders-mock-token'
  },
  'Store Manager': {
    id: 'usr-mgr-1',
    name: 'Pooja Agarwal',
    email: 'manager@ladesar.com',
    role: 'Store Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    token: 'jwt-manager-mock-token'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('ladesar_admin_auth');
      return saved ? JSON.parse(saved) : DEFAULT_USERS['Super Admin']; // default to logged in demo for smooth preview
    } catch {
      return DEFAULT_USERS['Super Admin'];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('ladesar_admin_auth', JSON.stringify(user));
      } else {
        localStorage.removeItem('ladesar_admin_auth');
      }
    } catch (err) {
      console.warn('[LocalStorage] Unable to save ladesar_admin_auth:', err);
    }
  }, [user]);


  const login = async (email: string, password?: string, role: AdminRoleType = 'Super Admin'): Promise<{ success: boolean; message?: string }> => {
    try {
      // Try hitting the backend API first
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'admin123' })
      });

      if (res.ok) {
        const data = await res.json();
        const loggedUser: AdminUser = {
          id: data._id || `usr-${Date.now()}`,
          name: data.name || email.split('@')[0],
          email: data.email || email,
          role: (data.role?.name as AdminRoleType) || role,
          token: data.token,
          avatar: DEFAULT_USERS[role]?.avatar
        };
        setUser(loggedUser);
        return { success: true };
      }
    } catch (e) {
      console.warn('Backend login fallback to local authentication', e);
    }

    // Fallback authentication
    const matchedRole = Object.values(DEFAULT_USERS).find(u => u.email.toLowerCase() === email.toLowerCase())?.role || role;
    const fallbackUser: AdminUser = {
      ...DEFAULT_USERS[matchedRole],
      email: email,
      name: email.split('@')[0].toUpperCase()
    };
    setUser(fallbackUser);
    return { success: true };
  };

  const loginAsDemo = (role: AdminRoleType) => {
    setUser(DEFAULT_USERS[role] || DEFAULT_USERS['Super Admin']);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ladesar_admin_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
