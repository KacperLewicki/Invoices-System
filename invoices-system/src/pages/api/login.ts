import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import pool from '../api/lib/db';

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const { email, password } = req.body;

  const [rows]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

  if (rows.length === 0) {

    return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }
  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {

    return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }
  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

  return res.status(200).json({ message: 'Zalogowano pomyślnie' });
}
