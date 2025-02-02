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

        setError(err.response.data.message || 'An incorrect email or password was entered.');

      } else if (err.response?.status === 500) {

        setError('A server error has occurred, please try again later.');

      } else {

        setError('An unexpected error occurred.');
      }
    }
  };

  const handleRegisterRedirect = () => {

    router.push('/register');
  };

  return (

    <div className="flex items-center justify-center h-screen w-full overflow-hidden">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-purple-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>

          <div>
            <label className="block text-purple-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600 transition duration-200">
            Log In
          </button>

          <div className="text-center">
            <p className="text-gray-600">Dont have an account?</p>
            <button
              type="button"
              onClick={handleRegisterRedirect}
              className="text-purple-700 hover:underline">
              Register
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
