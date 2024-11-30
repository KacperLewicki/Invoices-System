import db from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface InvoiceItem {

  nameInvoice: string;
  nameItem: string;
  quantity: number;
  vatItem: number;
  nettoItem: number;
  bruttoItem: number;
  comment: string;
}

const queryDb = (sql: string, values: any[]): Promise<any> => {

  return new Promise((resolve, reject) => {

    db.query(sql, values)
      .then((result: any) => resolve(result))
      .catch((err: Error) => reject(err));
  });
};

export default async function saveInvoiceItems(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method === 'POST') {

    try {

      const itemsData: InvoiceItem[] = req.body;
      const values = itemsData.map(item => [
        item.nameInvoice,
        item.nameItem,
        item.quantity,
        item.vatItem,
        item.nettoItem,
        item.bruttoItem,
        item.comment,
      ]);

      const sql = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';
      await queryDb(sql, [values]);

      res.status(200).send('Invoice items saved successfully');

    } catch (error: any) {

      res.status(500).send('Error saving invoice items');
    }
  } else {

    res.status(405).send('Method not allowed');
  }
}
