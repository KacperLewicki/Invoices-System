import pool from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

// 📚 **Typy dla Not Kredytowych**

interface CreditNoteData extends RowDataPacket {

    id: number;
}

/**
 * @function handler
 * Pobiera noty kredytowe powiązane z aktualnie zalogowanym użytkownikiem.
 *
 * @param {NextApiRequest} req - Obiekt żądania.
 * @param {NextApiResponse} res - Obiekt odpowiedzi.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    try {

        // 📌 1. Pobierz identyfikator z nagłówków

        const identyfikator = req.headers['identyfikator'] as string;

        // 📌 2. Pobierz noty kredytowe powiązane z identyfikatorem

        const [creditNotes] = await pool.query<CreditNoteData[]>(
            'SELECT * FROM creditnotesinvoices WHERE identyfikator = ?',
            [identyfikator]
        );

        if (creditNotes.length === 0) {

            return res.status(200).json({ message: 'Brak not kredytowych powiązanych z tym identyfikatorem' });
        }

        // 📌 3. Pobierz powiązane elementy not kredytowych

        const creditNoteData = await Promise.all(

            creditNotes.map(async (creditNote) => {

                const [items] = await pool.query<CreditNoteData[]>(
                    'SELECT * FROM creditnoteitems WHERE creditNoteId = ?',
                    [creditNote.id]
                );
                return { ...creditNote, items };
            })
        );

        // 📌 4. Zwróć dane not kredytowych

        res.status(200).json(creditNoteData);

    } catch (error: any) {

        console.error('❌ Error fetching credit notes:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania not kredytowych' });
    }
}
