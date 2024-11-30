import db from './lib/db';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  
  if (req.method === 'GET') {

    const { nameInvoice } = req.query;

    const schema = Joi.object({
      nameInvoice: Joi.string().min(1).required(),
    });

    const { error } = schema.validate({ nameInvoice });
    if (error) {

      res.status(400).json({ error: 'Bad request' });
      return;
    }

    try {

      const query = 'SELECT COUNT(*) as count FROM invoicemanual WHERE nameInvoice = ?'; 

      const [result]: any[] = await db.query(query, [nameInvoice]);

      const exists = result[0].count > 0;

      res.status(200).json({ exists });
    } catch (error) {

      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {

    res.status(405).json({ error: 'Method not allowed' });
  }
}
