import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import pool from '../../pages/api/lib/db';

const JWT_SECRET = '123456'; // Upewnij się, że w produkcji używasz zmiennej środowiskowej

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  console.log('Ciasteczka:', req.cookies);
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Nieautoryzowany' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [rows]: any = await pool.query('SELECT id, email, name FROM login WHERE id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const user = rows[0];
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Błąd weryfikacji tokena:', error);
    return res.status(401).json({ message: 'Nieautoryzowany' });
  }
}
