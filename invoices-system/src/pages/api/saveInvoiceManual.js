import db from './lib/db.js';

const queryDb = (sql, values) => {

  return new Promise((resolve, reject) => {

    db.query(sql, values, (err, result) => {

      if (err) {

        return reject(err);
      }
      resolve(result);
    });
  });
};

export default async function handler(req, res) {

  if (req.method !== 'POST') {

    return res.status(405).send('Method not allowed');
  }

  try {
    const { invoice, items } = req.body;

    if (!invoice || !items || !Array.isArray(items)) {

      return res.status(400).send('Invalid input data');
    }

    const getLastInvoiceQuery = 'SELECT nameInvoice FROM invoicemanual ORDER BY id DESC LIMIT 1';
    const lastInvoiceResult = await queryDb(getLastInvoiceQuery);
    let lastInvoiceNumber = 0;

    if (lastInvoiceResult.length > 0) {

      const lastInvoice = lastInvoiceResult[0].nameInvoice;
      const lastNumber = parseInt(lastInvoice.split('/').pop(), 10);
      lastInvoiceNumber = isNaN(lastNumber) ? 0 : lastNumber;
    }

    const newInvoiceNumber = lastInvoiceNumber + 1;
    const newInvoiceNumberStr = newInvoiceNumber.toString().padStart(4, '0');
    invoice.nameInvoice = `NB/24/${newInvoiceNumberStr}`;

    const saveInvoiceQuery = 'INSERT INTO invoicemanual SET ?';
    
    await queryDb(saveInvoiceQuery, invoice);

    const itemsWithInvoiceName = items.map(item => ({
      ...item,
      nameInvoice: invoice.nameInvoice,
    }));

    if (itemsWithInvoiceName.length > 0) {

      const sqlItems = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';
      const values = itemsWithInvoiceName.map(item => [
        item.nameInvoice,
        item.nameItem,
        item.quantity,
        item.vatItem,
        item.nettoItem,
        item.bruttoItem,
        item.comment,
      ]);

      await queryDb(sqlItems, [values]);
    }

    res.status(200).json({ nameInvoice: invoice.nameInvoice });
    
  } catch (error) {

    res.status(500).send('Error processing request');
  }
}
