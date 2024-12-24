import db from './lib/db';
import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from 'next';

// 📚 **Sprawdzanie Istnienia Faktury (nameInvoice)**

// Ten endpoint API obsługuje żądania typu `GET`, które sprawdzają,
// czy dana faktura (`nameInvoice`) istnieje w bazie danych.
// Używa walidacji danych wejściowych przy pomocy biblioteki Joi
// oraz zabezpiecza bazę danych przed SQL Injection poprzez parametryzowane zapytania.

// 📌 **Handler API**

/**
 * @function handler
 * Sprawdza, czy faktura o określonej nazwie (`nameInvoice`) istnieje w bazie danych.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  // 🔑 **Obsługa Metody GET**

  if (req.method === 'GET') {

    // 📌 1. Pobranie i Walidacja Parametru `nameInvoice`

    const { nameInvoice } = req.query;

    // 📌 2. Definicja Schemy Walidacji za pomocą Joi

    const schema = Joi.object({

      nameInvoice: Joi.string().min(1).required(),

    });

    // 📌 3. Walidacja Parametru

    const { error } = schema.validate({ nameInvoice });
    if (error) {
      res.status(400).json({ error: 'Bad request: Invalid or missing nameInvoice parameter' });
      return;
    }

 
    // 🛠️ **Zapytanie do Bazy Danych**
  
    try {

      /**
       * Zapytanie SQL: Sprawdza, czy faktura o podanej nazwie istnieje w tabeli `invoicemanual`.
       */

      const query = 'SELECT COUNT(*) as count FROM invoicemanual WHERE nameInvoice = ?';

      /**
       * Wykonanie zapytania z parametrem.
       * @returns {number} count - Liczba faktur o danej nazwie.
       */

      const [result]: any[] = await db.query(query, [nameInvoice]);

      // 📌 4. Sprawdzenie Wyniku Zapytania

      const exists = result[0].count > 0;

 
      // ✅ **Zwrócenie Odpowiedzi**
  
      /**
       * Jeśli faktura istnieje, zwracamy `exists: true`.
       * Jeśli nie istnieje, zwracamy `exists: false`.
       */

      res.status(200).json({ exists });

    } catch (error) {

      // ❌ **Obsługa Błędów Bazy Danych**
  
      console.error('Database query error:', error);
      res.status(500).json({ error: 'Internal server error' });

    }
  } else {


    // 🚫 **Obsługa Nieprawidłowej Metody**

    /**
     * Jeśli metoda żądania nie jest `GET`, zwracamy błąd 405.
     */
    
    res.status(405).json({ error: 'Method not allowed' });
  }
}
