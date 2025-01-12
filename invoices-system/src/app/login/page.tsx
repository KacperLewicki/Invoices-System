'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/context/authContext';
import { useInvoice } from '../../hooks/context/invoiceContext';

export default function LoginPage() {

  const router = useRouter();
  const { login } = useAuth();
  const { fetchInvoices, fetchCreditNotes } = useInvoice();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');

    try {

      await login(email, password);
      await fetchInvoices();
      await fetchCreditNotes();
      router.push('/home');

    } catch (err: any) {

      if (err.response?.status === 401) {

        setError(err.response.data.message || 'Podano błędny email lub hasło.');

      } else if (err.response?.status === 500) {

        setError('Wystąpił błąd serwera. Spróbuj ponownie później.');

      } else {

        setError('Wystąpił nieoczekiwany błąd.');
      }
    }
  };

  const handleRegisterRedirect = () => {

    router.push('/register');
  };

  return (

    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-6 text-center">Logowanie</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">Hasło</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600">
          Zaloguj się
        </button>

        <div className="mt-4 text-center">
          <p className="mb-2">Nie masz konta?</p>
          <button
            type="button"
            onClick={handleRegisterRedirect}
            className="text-purple-700 hover:underline">
            Zarejestruj się
          </button>
        </div>
      </form>
    </div>
  );
}
