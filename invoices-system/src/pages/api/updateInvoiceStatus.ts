import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Verify the request method

    if (req.method !== 'POST') {

        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Retrieve the invoiceName parameter from the request body

    const { invoiceName } = req.body;

    // Validate the presence of invoiceName

    if (!invoiceName) {

        return res.status(400).json({ error: 'Missing invoiceName' });
    }

    try {
        // SQL query to update the document status

        const query = `
            UPDATE invoicemanual 
            SET documentStatus = 'Invoice correction (CN) approved by administrator'
            WHERE nameInvoice = ?;`;

        const [result]: any = await pool.execute(query, [invoiceName]);

        // Check if a record was updated

        if (result.affectedRows === 0) {

            return res.status(404).json({ error: 'Invoice not found' });
        }

        // Successful update

        return res.status(200).json({ message: 'Document status updated successfully' });

    } catch (error) {

        // Log the error to the server console

        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
