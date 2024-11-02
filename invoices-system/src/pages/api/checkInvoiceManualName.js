import db from './lib/db.js';

export default async function handler(req, res) {

  if (req.method === 'GET') {

    const { nameInvoice } = req.query;

    try {

      const query = 'SELECT COUNT(*) as count FROM invoicemanual WHERE nameInvoice = ?';
      const [result] = await db.promise().query(query, [nameInvoice]);

      const exists = result[0].count > 0;
      res.status(200).json({ exists });

    } catch (error) {
   
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    
    res.status(405).json({ error: 'Method not allowed' });
  }
}
