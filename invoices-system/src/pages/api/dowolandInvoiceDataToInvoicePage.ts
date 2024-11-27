import connection from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

interface Invoice extends RowDataPacket {

  id: number;
  nameInvoice: string;
  [key: string]: any; 
}

interface InvoiceItem extends RowDataPacket {

  id: number;
  nameInvoice: string;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  try {

    const [invoices]: [Invoice[], any] = await connection.query<Invoice[]>(
      'SELECT * FROM invoicemanual'
    );

    const invoiceData = await Promise.all(
      invoices.map(async (invoice) => {
        const [items]: [InvoiceItem[], any] = await connection.query<InvoiceItem[]>(
          'SELECT * FROM invoiceitem WHERE nameInvoice = ?',
          [invoice.nameInvoice]
        );

        return { ...invoice, items };
      })
    );

    res.status(200).json(invoiceData);

  } catch (error: any) {

    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: error.message });
  }
}
