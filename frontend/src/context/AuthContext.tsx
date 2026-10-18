import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nutriai_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfileData = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
    } catch (err) {
      console.warn('Failed to fetch profile', err);
    }
  };

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('nutriai_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const u = await api.getMe();
      setUser(u);
      setToken(storedToken);
      await fetchProfileData();
    } catch {
      localStorage.removeItem('nutriai_token');
      setUser(null);
      setProfile(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (newToken: string, newUser: User) => {
    localStorage.setItem('nutriai_token', newToken);
    setToken(newToken);
    setUser(newUser);
    await fetchProfileData();
  };

  const logout = () => {
    localStorage.removeItem('nutriai_token');
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    await fetchProfileData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshProfile,
      }}
    >
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
