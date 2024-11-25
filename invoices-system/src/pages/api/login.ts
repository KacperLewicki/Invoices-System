// pages/api/login.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import pool from '../api/lib/db';

const JWT_SECRET = new TextEncoder().encode('123456');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const { email, password } = req.body;

  // Sprawdź dane użytkownika w bazie danych
  const [rows]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

  if (rows.length === 0) {
    return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }

  const user = rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }

  // Generuj token JWT
  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(JWT_SECRET);

  // Ustaw ciasteczko
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

  return res.status(200).json({ message: 'Zalogowano pomyślnie' });
}
