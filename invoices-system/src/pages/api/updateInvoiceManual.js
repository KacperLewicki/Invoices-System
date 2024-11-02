import db from './lib/db.js';

export default function handler(req, res) {

  if (req.method === 'POST') {

    const { invoice, items } = req.body;

    const sqlInvoice = 'INSERT INTO invoicemanual SET ?';
    const sqlItems = 'INSERT INTO invoiceitem (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) VALUES ?';

    db.query(sqlInvoice, invoice, (err, result) => {

      if (err) {

        res.status(500).send('Error saving invoice');
        throw err;
      }

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

      db.query(sqlItems, [values], (err, result) => {
        
        if (err) {

          res.status(500).send('Error saving invoice items');
          throw err;
        }
        res.status(200).send('Invoice and items saved successfully');
      });
    });
  } else {

    res.status(405).send('Method not allowed');
  }
}
