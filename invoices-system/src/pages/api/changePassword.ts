import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import pool from '../api/lib/db';

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR =  new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  const token = req.cookies.token;

  if (!token) {

    return res.status(401).json({ message: 'Nieautoryzowany' });
  }

  try {

    const decoded: any = await jwtVerify(token, NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
    const userId = decoded.payload.id;
    const { currentPassword, newPassword } = req.body;
    const [rows]: any = await pool.query('SELECT * FROM login WHERE id = ?', [userId]);

    if (rows.length === 0) {
        
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {

      return res.status(401).json({ message: 'Obecne hasło jest niepoprawne' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE login SET password = ? WHERE id = ?', [hashedPassword, userId]);

    return res.status(200).json({ message: 'Hasło zostało zmienione' });

  } catch (error) {

    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
