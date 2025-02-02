'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const res = await fetch('/api/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

    if (res.ok) {

      router.push('/login');

    } else {

      const data = await res.json();
      setError(data.message);
    }
  };

  const handleRegisterRedirect = () => {

    router.push('/login');
  };

  return (

    <div className="flex items-center justify-center min-h-screen w-full overflow-hidden">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Register</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required />
          </div>

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
            Sign Up
          </button>
        </form>

        <div className="text-center pt-4">
            <p className="text-gray-600 ">Already have an account? log in</p>
            <button
              type="button"
              onClick={handleRegisterRedirect}
              className="text-purple-700 hover:underline">
              Login
            </button>
          </div>

      </div>
    </div>
  );
}