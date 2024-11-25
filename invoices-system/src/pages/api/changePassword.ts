// src/pages/api/changePassword.ts

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../api/lib/db';

const JWT_SECRET = '123456';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Nieautoryzowany' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const { currentPassword, newPassword } = req.body;

    // Pobierz użytkownika z bazy danych
    const [rows]: any = await pool.query('SELECT * FROM login WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const user = rows[0];

    // Sprawdź, czy obecne hasło jest poprawne
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Obecne hasło jest niepoprawne' });
    }

    // Zaszyfruj nowe hasło
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Zaktualizuj hasło w bazie danych
    await pool.query('UPDATE login SET password = ? WHERE id = ?', [hashedPassword, userId]);

    return res.status(200).json({ message: 'Hasło zostało zmienione' });
  } catch (error) {
    console.error('Błąd podczas zmiany hasła:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
