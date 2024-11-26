import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../pages/api/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'POST') {

        const { name, email, password } = req.body;

        try {

            const [existingUsers]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

            if (existingUsers.length > 0) {

                return res.status(400).json({ message: 'Użytkownik z tym emailem już istnieje' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await pool.query('INSERT INTO login (name, email, password) VALUES (?, ?, ?)', [
                name,
                email,
                hashedPassword,
            ]);

            return res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });

        } catch (error) {

            //console.error('Błąd rejestracji:', error);
            return res.status(500).json({ message: 'Błąd serwera' });
        }
    } else {

        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Metoda ${req.method} nie jest obsługiwana`);
    }
}
