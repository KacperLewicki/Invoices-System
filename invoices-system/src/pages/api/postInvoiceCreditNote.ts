import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';
import { CreditNoteData } from '../../types/typesInvoice';

// 📚 **Handler for Creating Invoice Credit Note**

// This API endpoint handles the creation of an invoice credit note.
// Credit note data is validated, the document number is auto-generated,
// and it is linked to the user via the `identyfikator` from the HTTP header.

// 📌 **API Request Handling**

/**
 * @function handler
 * Creates a new invoice credit note and automatically assigns the user's `identyfikator`.
 *
 * @param {NextApiRequest} req - HTTP request object.
 * @param {NextApiResponse} res - HTTP response object.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // 📌 1. Check Request Method

    if (req.method === 'POST') {

        // 📌 2. Destructure Data from Request Body

        const {
            invoiceName,
            dataInvoice,
            dataInvoiceSell,
            dueDate,
            paymentTerm,
            comments,
            seller,
            summaryNetto,
            summaryBrutto,
            summaryVat,
            customerName,
            description,
            exchangeRate,
            paymentMethod,
            effectiveMonth,
            documentStatus,
            currency,
            items
        }: CreditNoteData = req.body;

        // 📌 3. Retrieve `identyfikator` from Headers

        const identyfikator = req.headers['identyfikator'];

        if (!identyfikator) {
            return res.status(400).json({ message: 'User identifier is missing' });
        }

        // 📌 4. Establish Database Connection

        const connection = await pool.getConnection();

        try {
            // 📌 5. Begin Transaction

            await connection.beginTransaction();

            // 🔑 **Generate Credit Note Number**

            /**
             * Fetch the last ID from the `creditnotesinvoices` table
             * and generate a new credit note number in the format: CN/24/0001
             */

            const [rows]: any = await connection.query('SELECT MAX(id) as maxId FROM creditnotesinvoices');
            const maxId = rows[0]?.maxId || 0;
            const year = new Date().getFullYear().toString().slice(-2);
            const newCreditNoteNumber = `CN/${year}/${String(maxId + 1).padStart(4, '0')}`;

            // 📝 **Save Credit Note to Database**

            /**
             * Save main credit note information to the `creditnotesinvoices` table.
             * Automatically add the user's `identyfikator`.
             */

            const [result]: any = await connection.query(

                `INSERT INTO creditnotesinvoices 
                (creditNote, invoiceName, dataInvoice, dataInvoiceSell, dueDate, paymentTerm, comments, seller, 
                 summaryNetto, summaryBrutto, summaryVat, customerName, description, exchangeRate, 
                 paymentMethod, effectiveMonth, documentStatus, identyfikator, currency) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newCreditNoteNumber,
                    invoiceName,
                    dataInvoice,
                    dataInvoiceSell,
                    dueDate,
                    paymentTerm,
                    comments,
                    seller,
                    summaryNetto,
                    summaryBrutto,
                    summaryVat,
                    customerName,
                    description,
                    exchangeRate,
                    paymentMethod,
                    effectiveMonth,
                    documentStatus,
                    identyfikator,
                    currency,
                ]
            );

            const creditNoteId = result.insertId;

            // 📦 **Save Credit Note Items**

            /**
             * Iterate over the `items` array and save each credit note item
             * to the `creditnoteitems` table.
             */

            for (const item of items) {

                await connection.query(

                    `INSERT INTO creditnoteitems 
                    (creditNoteId, itemName, quantity, nettoItem, vatItem, bruttoItem) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        creditNoteId,
                        item.itemName,
                        item.quantity,
                        item.nettoItem,
                        item.vatItem,
                        item.bruttoItem,
                    ]
                );
            }

            // ✅ **Commit Transaction**

            await connection.commit();

            res.status(201).json({

                id: creditNoteId,
                creditNote: newCreditNoteNumber,
                message: 'Invoice credit note created successfully',
            });

        } catch (error) {

            // ❌ **Error Handling**

            /**
             * Roll back the transaction and return an error message in case of failure.
             */

            await connection.rollback();
            console.error('Error creating invoice credit note:', error);
            res.status(500).json({ message: 'Internal server error' });

        } finally {

            // 🔄 **End Connection**

            /**
             * Release the database connection.
             */

            connection.release();
        }
    } else {

        // 🚫 **Invalid Method**

        /**
         * If the request method is not `POST`, return a 405 error.
         */

        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}
