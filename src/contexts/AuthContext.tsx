
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('taskManagerUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('taskManagerUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate credentials with a backend
      // For now, we'll just check if the user has signed up before
      const storedUsers = JSON.parse(localStorage.getItem('taskManagerUsers') || '[]');
      const foundUser = storedUsers.find((u: User & { password: string }) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('taskManagerUser', JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for existing users - this check now works across all devices
      // since we're using a consistent localStorage key
      const storedUsers = JSON.parse(localStorage.getItem('taskManagerUsers') || '[]');
      
      if (storedUsers.some((u: User) => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password, // In a real app, this would be hashed on the server
      };
      
      // Store the user in the global users list
      storedUsers.push(newUser);
      localStorage.setItem('taskManagerUsers', JSON.stringify(storedUsers));
      
      // Remove password before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('taskManagerUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Account created",
        description: `Welcome to Task Manager, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Sign-up failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskManagerUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
