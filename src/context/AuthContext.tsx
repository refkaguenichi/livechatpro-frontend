'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/utils/api';

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  loginUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
  loginUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile'); // ✅ use Axios instance
        setUser(response.data.user); // Axios responses are in response.data
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await api.post('/user/logout'); // ✅ also use api for consistency
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const loginUser = (userData: User) => {
    setUser(userData);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, logout, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
