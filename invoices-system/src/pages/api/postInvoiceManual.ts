import connection from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { InvoiceData, ItemData } from '../../types/typesInvoice';

// 📚 **Handler for Adding Invoice with Identifier**

/**
 * @function handler
 * Handles saving an invoice to the database, associating it with the user's identifier.
 *
 * @param {NextApiRequest} req - HTTP Request.
 * @param {NextApiResponse} res - HTTP Response.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

    // 📌 1. Verify the Request Method

    if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
    }

    try {

        // 🛡️ **Verify and Retrieve Identifier**

        const identyfikatorHeader = req.headers['identyfikator'];

        const identyfikator = Array.isArray(identyfikatorHeader) ? identyfikatorHeader[0] : identyfikatorHeader;

        if (!identyfikator) {

            return res.status(400).json({ error: 'Identifier is missing in the header' });
        }

        // 📄 **Verify Invoice and Item Data**

        const { invoice, items }: { invoice: InvoiceData; items: ItemData[] } = req.body;

        if (!invoice || !items || !Array.isArray(items)) {

            return res.status(400).send('Invalid input data');
        }

        const db = connection;

        // 🔢 **Generate Invoice Number**

        const getLastInvoiceQuery = 'SELECT nameInvoice FROM invoicemanual ORDER BY id DESC LIMIT 1';
        const [lastInvoiceResult]: [RowDataPacket[], any] = await db.execute(getLastInvoiceQuery);

        let lastInvoiceName = 0;

        if (lastInvoiceResult.length > 0 && lastInvoiceResult[0].nameInvoice) {

            const lastInvoice = lastInvoiceResult[0].nameInvoice;
            const lastName = parseInt(lastInvoice.split('/').pop() || '0', 10);
            lastInvoiceName = isNaN(lastName) ? 0 : lastName;
        }

        const newInvoiceNumber = lastInvoiceName + 1;
        const newInvoiceNumberStr = newInvoiceNumber.toString().padStart(4, '0');
        const currentYear = new Date().getFullYear().toString();
        const shortYear = currentYear.split('').slice(-2).join('');
        const generatedNameInvoice = `NB/${shortYear}/${newInvoiceNumberStr}`;
        invoice.nameInvoice = generatedNameInvoice;

        // 📝 **Prepare Invoice Data**

        const validInvoiceFields: InvoiceData = {
            ...invoice,
            nameInvoice: generatedNameInvoice,
            identyfikator,
        };

        for (const [key, value] of Object.entries(validInvoiceFields)) {

            if (value === undefined || value === null) {

                return res.status(400).send(`Field ${key} is required.`);
            }
        }

        // 💾 **Save Invoice to Database**

        const fields = Object.keys(validInvoiceFields);
        const placeholders = fields.map(() => '?').join(', ');
        const values = Object.values(validInvoiceFields);

        const saveInvoiceQuery = `INSERT INTO invoicemanual (${fields.join(', ')}) VALUES (${placeholders})`;

        await db.execute(saveInvoiceQuery, values);

        // 📦 **Save Invoice Items to Database**

        if (items.length > 0) {

            const itemsValues = items.map(item => [
                invoice.nameInvoice,
                item.nameItem,
                item.quantity,
                item.vatItem,
                item.nettoItem,
                item.bruttoItem,
                item.comment,
            ]);

            const sqlItems = `
                INSERT INTO invoiceitem 
                (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) 
                VALUES ?
            `;

            await db.query(sqlItems, [itemsValues]);
        }

        // ✅ **Return Response**

        res.status(200).json({ nameInvoice: invoice.nameInvoice });

    } catch (error: any) {

        console.error('Error while saving invoice:', error.message);
        res.status(500).json({ error: `Error processing the request: ${error.message}` });
    }
}
