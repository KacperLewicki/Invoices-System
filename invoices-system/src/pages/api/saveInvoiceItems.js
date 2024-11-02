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

export default async function saveInvoiceItems(req, res) {

  if (req.method === 'POST') {

    try {
      const itemsData = req.body;

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

    } catch (error) {
     
      res.status(500).send('Error saving invoice items');
    }
  } else {

    res.status(405).send('Method not allowed');
  }
}
