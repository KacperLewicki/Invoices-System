'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../../types/typesInvoice';

// 📚 **AuthContext - Kontekst Autoryzacji**

// Ten hook definiuje kontekst autoryzacji dla aplikacji Next.js.
// Umożliwia globalne zarządzanie stanem użytkownika i tokenem autoryzacyjnym.
// Dzięki temu komponenty mogą uzyskiwać dostęp do informacji o użytkowniku
// i funkcji związanych z autoryzacją bez przekazywania ich przez propsy.

// 📌 **Typy i Interfejsy**

/**
 * @interface User
 * Reprezentuje dane użytkownika.
 *
 * @property {string} id - Unikalny identyfikator użytkownika z bazy danych.
 * @property {string} name - Imię i nazwisko użytkownika.
 * @property {string} email - Adres e-mail użytkownika.
 * @property {string} identyfikator - Token autoryzacyjny lub unikalny identyfikator.
 */

/**
 * @interface AuthContextProps
 * Określa strukturę wartości kontekstu autoryzacji.
 *
 * @property {User | null} user - Dane aktualnie zalogowanego użytkownika.
 * @property {string | null} token - Token autoryzacyjny użytkownika.
 * @property {(email: string, password: string) => Promise<void>} login - Funkcja logowania.
 * @property {() => void} logout - Funkcja wylogowania.
 */

interface AuthContextProps {

  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// 📌 **Tworzenie Kontekstu Autoryzacji**

/**
 * @constant AuthContext
 * Tworzy kontekst autoryzacji.
 *
 * @default undefined - Kontekst domyślnie ma wartość `undefined`,
 * co pomaga w zapewnieniu, że zostanie użyty tylko w opakowaniu `AuthProvider`.
 */

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// 📌 **Dostawca Kontekstu (AuthProvider)**

/**
 * @function AuthProvider
 * Opakowuje aplikację w kontekst autoryzacji.
 *
 * @param {React.ReactNode} children - Komponenty children, które będą miały dostęp do kontekstu.
 *
 * @returns {JSX.Element} - Zwraca komponent React z dostępnym kontekstem autoryzacji.
 */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  // 📌 Stan tokena autoryzacyjnego

  const [token, setToken] = useState<string | null>(null);

  // 📌 Stan danych użytkownika
  const [user, setUser] = useState<User | null>(null);

  // 🔄 **Ładowanie Danych z localStorage**

  /**
   * @function useEffect
   * Ładuje token i dane użytkownika z localStorage podczas inicjalizacji aplikacji.
   *
   * Ustawia również domyślne nagłówki Axios.
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

        console.warn('Brak identyfikatora w danych użytkownika');
      }
    }
  }, []);

  // 🔑 **Funkcja Logowania**

  /**
   * @function login
   * Loguje użytkownika i zapisuje dane w stanie oraz localStorage.
   *
   * @param {string} email - Adres e-mail użytkownika.
   * @param {string} password - Hasło użytkownika.
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

  // 🚪 **Funkcja Wylogowania**

  /**
   * @function logout
   * Usuwa dane autoryzacyjne z localStorage oraz resetuje stan użytkownika i tokena.
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

      //console.error('Błąd podczas wylogowywania:', error);

    }
  };

  // 📦 **Zwracanie Kontekstu**

  /**
   * Udostępnia dane i funkcje autoryzacyjne dla dzieci komponentu.
   */

  return (

    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 📌 **Hook Uwierzytelnienia (useAuth)**

/**
 * @function useAuth
 * Zwraca dostęp do kontekstu autoryzacji.
 *
 * @returns {AuthContextProps} - Zwraca obiekt zawierający dane i funkcje autoryzacyjne.
 *
 * @throws {Error} - Rzuca błąd, jeśli hook jest używany poza `AuthProvider`.
 */

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
