
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { apiClient } from '@/services/apiClient';
import { userApi } from '@/services/api';

type User = {
  _id: string;
  userName: string;
  email: string;
  channelName?: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (formdata: FormData) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await userApi.getCurrentUser();
          // console.log(response);
          setUser(response.data);
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('token');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await userApi.login(email, password);
      const { accessToken, user } = response.data;
      localStorage.setItem('token', accessToken);
      setUser(user);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formdata) => {
    try {
      setIsLoading(true);
      const response = await userApi.register(formdata,{
        headers: {
          "Content-Type": "multipart/form-data", // This tells the server to handle file uploads
        },
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
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
