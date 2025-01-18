import pool from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';

// 📚 **Typy Interfejsów**

/**
 * @interface Invoice
 * Reprezentuje pojedynczą fakturę.
 */

interface Invoice extends RowDataPacket {

  id: number;
  nameInvoice: string;
  identyfikator: string;
  [key: string]: any;
}

/**
 * @interface InvoiceItem
 * Reprezentuje pojedynczy element faktury.
 */

interface InvoiceItem extends RowDataPacket {
  id: number;
  nameInvoice: string;
  [key: string]: any;
}

// 📌 **Główna Funkcja API**

/**
 * @function handler
 * Pobiera faktury powiązane z aktualnie zalogowanym użytkownikiem.
 *
 * @param {NextApiRequest} req - Obiekt żądania.
 * @param {NextApiResponse} res - Obiekt odpowiedzi.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  try {

    // 📌 1. Pobierz identyfikator z nagłówków
    
    const identyfikator = req.headers['identyfikator'];

if (!identyfikator) {

  return res.status(200).json({ error: 'Brak identyfikatora w nagłówku' });
}

    // 📌 2. Pobierz faktury powiązane z identyfikatorem

    const [invoices]: [Invoice[], any] = await pool.query<Invoice[]>(
      'SELECT * FROM invoicemanual WHERE identyfikator = ?',
      [identyfikator]
    );

    // 📌 3. Sprawdź, czy istnieją faktury dla użytkownika

    if (invoices.length === 0) {

      return res.status(200).json({ message: 'Brak faktur powiązanych z tym identyfikatorem' });
    }

    // 📌 4. Pobierz powiązane elementy faktur

    const invoiceData = await Promise.all(

      invoices.map(async (invoice) => {

        const [items]: [InvoiceItem[], any] = await pool.query<InvoiceItem[]>(
          'SELECT * FROM invoiceitem WHERE nameInvoice = ?',
          [invoice.nameInvoice]
        );

        return { ...invoice, items };
      })
    );

    // 📌 5. Zwróć przefiltrowane faktury z powiązanymi elementami

    res.status(200).json(invoiceData);

  } catch (error: any) {
    
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania faktur' });
  }
}
