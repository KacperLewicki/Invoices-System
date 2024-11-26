import db from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface Invoice {

  nameInvoice: string;
  [key: string]: any;

}

interface InvoiceItem {

  nameItem: string;
  quantity: number;
  vatItem: number;
  nettoItem: number;
  bruttoItem: number;
  comment: string;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method === 'POST') {

    try {

      const { invoice, items }: { invoice: Invoice; items: InvoiceItem[] } = req.body;

      const sqlInvoice = 'INSERT INTO invoicemanual SET ?';

      const [resultInvoice]: any = await db.query(sqlInvoice, invoice);

      const invoiceName = invoice.nameInvoice;
      const values = items.map(item => [
        invoiceName,
        item.nameItem,
        item.quantity,
        item.vatItem,
        item.nettoItem,
        item.bruttoItem,
        item.comment,
      ]);

      const sqlItems = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';
      await db.query(sqlItems, [values]);

      res.status(200).send('Invoice and items saved successfully');

    } catch (err: any) {

      //console.error('Error:', err);

      res.status(500).send('Error saving invoice');
    }
  } else {

    res.status(405).send('Method not allowed');
  }
}
