import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, Role } from '../types';
import { initialUsers } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoggedIn: boolean;
  registerStudent: (name: string, username: string, password: string) => boolean;
  updateUserProfile: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => false,
  logout: () => {},
  isLoggedIn: false,
  registerStudent: () => false,
  updateUserProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    // Initialize users in localStorage if not already there
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  const registerStudent = (name: string, username: string, password: string): boolean => {
    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: User) => u.username === username);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `student_${Date.now()}`,
      username,
      password,
      name,
      role: 'student',
      clubsLeading: [],
      clubsMember: [],
      clubsRequested: [],
    };
    
    // Add user to localStorage
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    
    return true;
  };

  const updateUserProfile = (updatedUser: User) => {
    // Update the user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => 
      user.id === updatedUser.id ? updatedUser : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isLoggedIn, 
      registerStudent,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
