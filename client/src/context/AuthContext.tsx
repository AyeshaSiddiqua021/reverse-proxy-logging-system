import type { AuthContextType } from '@/types';
import { createContext, useState, type ReactNode } from 'react';
import { loginUser, registerUser } from '@/services/auth.api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
  try {
    const data = await loginUser(email, password);

    setUserId(data.user._id);
    setEmail(data.user.email);
    setAccessToken(data.accessToken);

    localStorage.setItem('userId', data.user._id);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const register = async (email: string, password: string) => {
  try {
    const data = await registerUser(email, password);

    setUserId(data.user.id);
    setEmail(data.user.email);
    setAccessToken(data.accessToken);

    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data.message;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

  const logout = () => {
    setUserId(null);
    setEmail(null);
    setAccessToken(null);

    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider
      value={{ userId, email, accessToken, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
