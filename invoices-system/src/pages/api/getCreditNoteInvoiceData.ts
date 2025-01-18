import pool from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

// 📚 **Types for Credit Notes**

interface CreditNoteData extends RowDataPacket {

    id: number;
}

/**
 * @function handler
 * Fetches credit notes associated with the currently logged-in user.
 *
 * @param {NextApiRequest} req - Request object.
 * @param {NextApiResponse} res - Response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    try {

        // 📌 1. Fetch the identifier from headers

        const identyfikator = req.headers['identyfikator'] as string;

        // 📌 2. Fetch credit notes associated with the identifier

        const [creditNotes] = await pool.query<CreditNoteData[]>(
            'SELECT * FROM creditnotesinvoices WHERE identyfikator = ?',
            [identyfikator]
        );

        if (creditNotes.length === 0) {

            return res.status(200).json({ message: 'No credit notes associated with this identifier' });
        }

        // 📌 3. Fetch associated credit note items

        const creditNoteData = await Promise.all(

            creditNotes.map(async (creditNote) => {

                const [items] = await pool.query<CreditNoteData[]>(
                    'SELECT * FROM creditnoteitems WHERE creditNoteId = ?',
                    [creditNote.id]
                );
                return { ...creditNote, items };
            })
        );

        // 📌 4. Return credit note data

        res.status(200).json(creditNoteData);

    } catch (error: any) {

        console.error('❌ Error fetching credit notes:', error);
        res.status(500).json({ error: 'An error occurred while fetching credit notes' });
    }
}
