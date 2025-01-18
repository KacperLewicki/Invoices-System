'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../../types/typesInvoice';

// 📚 **AuthContext - Authorization Context**

// This hook defines an authorization context for a Next.js application.
// It enables global management of the user's state and authorization token.
// Components can access user information and authorization-related functions
// without passing them through props.

// 📌 **Types and Interfaces**

/**
 * @interface User
 * Represents user data.
 *
 * @property {string} id - Unique identifier of the user from the database.
 * @property {string} name - User's full name.
 * @property {string} email - User's email address.
 * @property {string} identyfikator - Authorization token or unique identifier.
 */

/**
 * @interface AuthContextProps
 * Defines the structure of the authorization context values.
 *
 * @property {User | null} user - Data of the currently logged-in user.
 * @property {string | null} token - User's authorization token.
 * @property {(email: string, password: string) => Promise<void>} login - Login function.
 * @property {() => void} logout - Logout function.
 */

interface AuthContextProps {

  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 📌 **Creating the Authorization Context**

/**
 * @constant AuthContext
 * Creates the authorization context.
 *
 * @default undefined - Context is initially `undefined`,
 * ensuring it is used only within the `AuthProvider` wrapper.
 */

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 📌 **Context Provider (AuthProvider)**

/**
 * @function AuthProvider
 * Wraps the application in the authorization context.
 *
 * @param {React.ReactNode} children - Child components with access to the context.
 *
 * @returns {JSX.Element} - Returns a React component with the authorization context available.
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  // 📌 Authorization Token State

  const [token, setToken] = useState<string | null>(null);

  // 📌 User Data State
  const [user, setUser] = useState<User | null>(null);

  // 🔄 **Loading Data from localStorage**

  /**
   * @function useEffect
   * Loads token and user data from localStorage during application initialization.
   *
   * Also sets default Axios headers.
   */

  useEffect(() => {

    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {

      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);

      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      if (parsedUser?.identyfikator) {

        axios.defaults.headers.common['identyfikator'] = parsedUser.identyfikator;

      } else {

        console.warn('No identifier in user data');
      }
    }
  }, []);

  // 🔑 **Login Function**

  /**
   * @function login
   * Logs in the user and stores data in the state and localStorage.
   *
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   */

  const login = async (email: string, password: string) => {

    const response = await axios.post('/api/login', { email, password });
    const { id, name, email: userEmail, identyfikator } = response.data;

    const userData: User = {

      id,
      name,
      email: userEmail,
      identyfikator,
    };

    localStorage.setItem('token', identyfikator);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(identyfikator);
    setUser(userData);

    axios.defaults.headers.common['Authorization'] = `Bearer ${identyfikator}`;
    axios.defaults.headers.common['identyfikator'] = identyfikator;
  };

  // 🚪 **Logout Function**

  /**
   * @function logout
   * Removes authorization data from localStorage and resets user and token states.
   */

  const logout = async () => {

    try {

      await axios.post('/api/logout');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);

      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['identyfikator'];

    } catch (error) {

      //console.error('Error during logout:', error);

    }
  };

  // 📦 **Returning Context**

  /**
   * Provides authentication data and functions to child components.
   */

  return (

    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 📌 **Authentication Hook (useAuth)**

/**
 * @function useAuth
 * Returns access to the authorization context.
 *
 * @returns {AuthContextProps} - Returns an object containing authentication data and functions.
 *
 * @throws {Error} - Throws an error if the hook is used outside of `AuthProvider`.
 */

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
