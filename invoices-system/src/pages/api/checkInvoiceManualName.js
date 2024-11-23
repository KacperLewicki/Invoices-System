import db from './lib/db';
import Joi from 'joi';

export default async function handler(req, res) {

  if (req.method === 'GET') { //sprawdzam czy meytoda jest GET

    const { nameInvoice } = req.query;  //pobieram paratemtr nameInvoice z zapytania

    const shema = Joi.object({
      nameInvoice: Joi.string().min(1).required(),
    });

    const {error} = shema.validate({nameInvoice}); //waliduje parametr nameInvoice

    if(error) {

      return res.status(400).json({ error: 'Bad request' });
    }

    try {
      
      const query = 'SELECT COUNT(*) as count FROM invoicemanual WHERE nameInvoice = ?'; //Sprawdzam czy istnieje faktura o podanej nazwie

      const [result] = await db.query(query, [nameInvoice]);

      const exists = result[0].count > 0;

      res.status(200).json({ exists });

    } catch (error) {

      //console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    
    res.status(405).json({ error: 'Method not allowed' });
  }
}
