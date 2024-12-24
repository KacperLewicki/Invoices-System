import db from './lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { ItemData } from '../../types/typesInvoice';

// 📚 **Zapis Pozycji Faktury do Bazy Danych**

// Ten endpoint API obsługuje zapis wielu pozycji faktury (`Items`) do bazy danych.


// 📌 **Interfejs Pozycji Faktury**

/**
 * @interface Items
 * Rozszerza ItemData o dodatkowe pole `nameInvoice`.
 */

interface Items extends ItemData {
  nameInvoice: string;
}


// 📌 **Funkcja Zapytania do Bazy**

/**
 * @function queryDb
 * Wykonuje zapytanie SQL z parametrami.
 *
 * @param {string} sql - Zapytanie SQL.
 * @param {any[]} values - Parametry zapytania SQL.
 * @returns {Promise<any>} - Wynik zapytania SQL.
 */

const queryDb = (sql: string, values: any[]): Promise<any> => {

  return new Promise((resolve, reject) => {

    db.query(sql, values)
      .then((result: any) => resolve(result))
      .catch((err: Error) => reject(err));
  });
};


// 📌 **Handler API**

/**
 * @function saveInvoiceItems
 * Zapisuje pozycje faktury do bazy danych.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default async function saveInvoiceItems(

  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {

  // 🔑 **Obsługa Metody POST**
 
  if (req.method === 'POST') {
    
    try {

      // 📌 1. Pobranie Danych z Żądania

      const Items: Items[] = req.body;

      if (!Array.isArray(Items) || Items.length === 0) {
        return res.status(400).send('Invalid or empty items array');
      }


      // 🛡️ **Mapowanie Danych do SQL**

      const values = Items.map(item => [
        item.nameInvoice,
        item.nameItem,
        item.quantity,
        item.vatItem,
        item.nettoItem,
        item.bruttoItem,
        item.comment,
      ]);

 
      // 🛠️ **Zapis Pozycji do Bazy Danych**

      const sql = `
        INSERT INTO invoiceitem 
        (nameInvoice, nameItem, quantity, vatItem, nettoItem, bruttoItem, comment) 
        VALUES ?
      `;

      await queryDb(sql, [values]);

      // ✅ **Zwrócenie Odpowiedzi Sukcesu**
    
      res.status(200).json({ message: 'Invoice items saved successfully' });

    } catch (error: any) {

  
      // ❌ **Obsługa Błędów**
    
      console.error('Error saving invoice items:', error);
      res.status(500).json({ error: 'Error saving invoice items' });
    }
  } else {

   
    // 🚫 **Obsługa Nieprawidłowej Metody**
 
    res.status(405).send('Method not allowed');
  }
}
