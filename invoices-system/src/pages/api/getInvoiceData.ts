import pool from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

// 📚 **Interface Types**

/**
 * @interface Invoice
 * Represents a single invoice.
 */

interface Invoice extends RowDataPacket {

  id: number;
  nameInvoice: string;
  identyfikator: string;
  [key: string]: any;
}

/**
 * @interface InvoiceItem
 * Represents a single invoice item.
 */

interface InvoiceItem extends RowDataPacket {
  id: number;
  nameInvoice: string;
  [key: string]: any;
}

// 📌 **Main API Function**

/**
 * @function handler
 * Fetches invoices associated with the currently logged-in user.
 *
 * @param {NextApiRequest} req - Request object.
 * @param {NextApiResponse} res - Response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  try {

    // 📌 1. Fetch the identifier from headers

    const identyfikator = req.headers['identyfikator'];

    if (!identyfikator) {

      return res.status(200).json({ error: 'No identifier provided in the header' });
    }

    // 📌 2. Fetch invoices associated with the identifier

    const [invoices]: [Invoice[], any] = await pool.query<Invoice[]>(
      'SELECT * FROM invoicemanual WHERE identyfikator = ?',
      [identyfikator]
    );

    // 📌 3. Check if there are invoices for the user

    if (invoices.length === 0) {

      return res.status(200).json({ message: 'No invoices associated with this identifier' });
    }

    // 📌 4. Fetch associated invoice items

    const invoiceData = await Promise.all(

      invoices.map(async (invoice) => {

        const [items]: [InvoiceItem[], any] = await pool.query<InvoiceItem[]>(
          'SELECT * FROM invoiceitem WHERE nameInvoice = ?',
          [invoice.nameInvoice]
        );

        return { ...invoice, items };
      })
    );

    // 📌 5. Return filtered invoices with associated items

    res.status(200).json(invoiceData);

  } catch (error: any) {

    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
}
