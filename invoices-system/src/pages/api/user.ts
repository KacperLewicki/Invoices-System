import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import pool from '../../pages/api/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.cookies.token;
    const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);

    if (!token) {

        return res.status(401).json({ message: 'Nieautoryzowany' });
    }
    try {

        const decoded: any = await jwtVerify(token, NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
        const userId = decoded.payload.id;

        const [rows]: any = await pool.query('SELECT id, email, name FROM login WHERE id = ?', [userId]);

        if (rows.length === 0) {

            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        const user = rows[0];

        return res.status(200).json({ user });

    } catch (error) {

        return res.status(401).json({ message: 'Nieautoryzowany' });
    }
}
