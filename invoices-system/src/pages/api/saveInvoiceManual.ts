import connection from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import { InvoiceData, ItemData } from '../../types/typesInvoice';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method !== 'POST') {

    return res.status(405).send('Metoda niedozwolona');
  }

  try {

    const { invoice, items }: { invoice: InvoiceData; items: ItemData[] } = req.body;

    if (!invoice || !items || !Array.isArray(items)) {

      return res.status(400).send('Nieprawidłowe dane wejściowe');
    }

    const db = connection;

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
    const generatedNameInvoice = `NB/24/${newInvoiceNumberStr}`;
    invoice.nameInvoice = generatedNameInvoice;

    const validInvoiceFields: InvoiceData = {

      ...invoice,
      nameInvoice: generatedNameInvoice,
    };

    for (const [key, value] of Object.entries(validInvoiceFields)) {

      if (value === undefined || value === null) {

        return res.status(400).send(`Pole ${key} jest wymagane.`);
      }
    }

    const fields = Object.keys(validInvoiceFields);
    const placeholders = fields.map(() => '?').join(', ');
    const values = Object.values(validInvoiceFields);

    const saveInvoiceQuery = `INSERT INTO invoicemanual (${fields.join(', ')}) VALUES (${placeholders})`;

    await db.execute(saveInvoiceQuery, values);

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

      const sqlItems = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';

      await db.query(sqlItems, [itemsValues]);
    }

    res.status(200).json({ nameInvoice: invoice.nameInvoice });

  } catch (error: any) {

    res.status(500).send(`Błąd podczas przetwarzania żądania: ${error.message}`);
  }
}
