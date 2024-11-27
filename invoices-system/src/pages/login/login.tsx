'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/context/autoContext';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const searchParams = useSearchParams();
    const message = searchParams ? searchParams.get('message') : null;

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(email, password);
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-100">
            {message && <p className="text-red-500 mb-4">{message}</p>}
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
                    className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600"
                >
                    Zaloguj się
                </button>

                <p className="mt-4 text-center">
                    Nie masz konta?{' '}
                    <a href="/register" className="text-purple-700 hover:underline">
                        Zarejestruj się
                    </a>
                </p>
            </form>
        </div>
    );
}
