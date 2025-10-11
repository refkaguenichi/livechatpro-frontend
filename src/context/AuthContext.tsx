'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user profile on initial load
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:1000/user/profile', {
          method: 'GET',
          credentials: 'include', // Include cookies if needed
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.user); // Set the user state with the fetched profile
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUser(null); // Set user to null if fetching fails
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchProfile();
  }, []);

  const logout = async () => {
    try {
      await axios.post('http://localhost:1000/user/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}