import db from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { ItemData, Invoice } from '../../types/typesInvoice';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method === 'POST') {

    try {

      const { invoice, items }: { invoice: Invoice; items: ItemData[] } = req.body;

      const sqlInvoice = 'INSERT INTO invoicemanual SET ?';

      await db.query(sqlInvoice, invoice);

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

      res.status(500).send('Error saving invoice');
    }
  } else {

    res.status(405).send('Method not allowed');
  }
}
