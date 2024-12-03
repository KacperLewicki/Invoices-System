'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextProps } from '../../types/typesInvoice';

const AuthContext = createContext<AuthContextProps>({

  user: null,
  loading: true,
  login: async () => { },
  logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {

    try {

      const res = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {

        const data = await res.json();
        setUser(data.user);

      } else {

        setUser(null);
      }
    } catch (error) {

      console.error('Błąd podczas pobierania danych użytkownika:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {

      await fetchUser();
    } else {

      const data = await res.json();
      throw new Error(data.message);
    }
  };

  const logout = async () => {

    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  return (

    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
