import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Sprawdzenie metody żądania

    if (req.method !== 'POST') {

        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Pobranie parametru invoiceName z ciała żądania

    const { invoiceName } = req.body;

    // Walidacja obecności invoiceName

    if (!invoiceName) {

        return res.status(400).json({ error: 'Missing invoiceName' });
    }

    try {
        // Zapytanie SQL do aktualizacji statusu dokumentu

        const query = `
            UPDATE invoicemanual 
            SET documentStatus = 'Faktura - poprawka (CN) zatwierdzona przez administratora'
            WHERE nameInvoice = ?;`;

        const [result]: any = await pool.execute(query, [invoiceName]);

        // Sprawdzenie, czy rekord został zaktualizowany

        if (result.affectedRows === 0) {

            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Sukces aktualizacji

        return res.status(200).json({ message: 'Document status updated successfully' });

    } catch (error) {

        // Logowanie błędu do konsoli serwera

        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}