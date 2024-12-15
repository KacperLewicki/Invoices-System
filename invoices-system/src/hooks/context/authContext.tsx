'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, AuthContextProps } from '../../types/typesInvoice';

/**
 * Kontekst autoryzacji użytkownika.
 * Umożliwia dostęp do informacji o zalogowanym użytkowniku, stanu ładowania, 
 * a także funkcji logowania i wylogowania w całej aplikacji bez konieczności 
 * przekazywania ich przez propsy.
 */
const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

/**
 * Komponent `AuthProvider`:
 *
 * Dostarcza obiekt kontekstu `AuthContext` do potomnych komponentów.
 * Zapewnia dane dotyczące aktualnie zalogowanego użytkownika, 
 * informacji o stanie ładowania, oraz dwie asynchroniczne funkcje:
 * - `login(email, password)` do logowania użytkownika,
 * - `logout()` do wylogowania użytkownika.
 *
 * Podczas pierwszego renderu pobierane są dane użytkownika z API (`/api/user`),
 * co pozwala określić, czy użytkownik jest zalogowany, oraz ustawić `loading` na `false`
 * po zakończeniu tego procesu.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Przechowuje dane zalogowanego użytkownika lub `null` jeśli nikt nie jest zalogowany
  const [user, setUser] = useState<User | null>(null);
  
  // Wskazuje, czy w danej chwili trwa ładowanie danych o użytkowniku 
  // (np. przy pierwszym renderze, przed otrzymaniem odpowiedzi z API)
  const [loading, setLoading] = useState(true);

  /**
   * Asynchroniczna funkcja pobierająca dane użytkownika z `/api/user`.
   * Jeśli pobranie zakończy się sukcesem, dane użytkownika zostaną zapisane w stanie `user`.
   * W przeciwnym razie `user` zostanie ustawiony na `null`.
   * Po zakończeniu pobierania stan `loading` jest ustawiany na `false`.
   */
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Umożliwia pobranie ciasteczek lub tokenów sesji
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Jeśli serwer nie zwróci 200, zakładamy brak zalogowanego użytkownika.
        setUser(null);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
      setUser(null);
    } finally {
      // Koniec ładowania - niezależnie od wyniku
      setLoading(false);
    }
  };

  // Użycie `useEffect` do automatycznego pobrania danych użytkownika 
  // po pierwszym renderze komponentu.
  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Funkcja logowania użytkownika.
   * Wysyła dane logowania (email i hasło) do `/api/login`.
   * Jeśli logowanie się powiedzie, ponownie pobiera dane użytkownika, 
   * aby odświeżyć stan i ustalić, że jest zalogowany.
   * W razie błędu - rzuca wyjątek z wiadomością.
   * 
   * @param email Adres e-mail użytkownika
   * @param password Hasło użytkownika
   * @throws {Error} W przypadku niepowodzenia logowania
   */
  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // Jeśli udało się zalogować, ponownie pobieramy dane użytkownika
      await fetchUser();
    } else {
      const data = await res.json();
      throw new Error(data.message);
    }
  };

  /**
   * Funkcja wylogowania użytkownika.
   * Wysyła żądanie do `/api/logout` i ustawia `user` na `null`.
   */
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

/**
 * Custom hook `useAuth`:
 * 
 * Pozwala na dostęp do wartości `AuthContext` z dowolnego komponentu potomnego `AuthProvider`.
 * 
 * Użycie:
 * ```typescript
 * const { user, loading, login, logout } = useAuth();
 * ```
 * 
 * @returns Obiekt zawierający: 
 *  - `user`: dane zalogowanego użytkownika lub `null`, 
 *  - `loading`: boolean wskazujący, czy dane są jeszcze ładowane,
 *  - `login(email, password)`: funkcję do logowania użytkownika,
 *  - `logout()`: funkcję do wylogowania użytkownika.
 */
export const useAuth = () => useContext(AuthContext);
