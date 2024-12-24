import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// 📚 **Rejestracja Nowego Użytkownika**

// Ten endpoint API obsługuje proces rejestracji użytkownika.
// Dane wejściowe są walidowane, hasło jest szyfrowane przed zapisaniem w bazie danych,
// a użytkownik otrzymuje unikalny `identyfikator`.

// 📌 **Handler API**

/**
 * @function handler
 * Rejestruje nowego użytkownika w systemie.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Obsługa Metody POST**

  if (req.method === 'POST') {

    // 📌 1. Pobieranie danych z żądania

    const { name, email, password } = req.body;

    try {

      // 🛡️ **Sprawdzenie Istnienia Użytkownika**

      /**
       * Sprawdź, czy użytkownik z podanym e-mailem już istnieje.
       */

      const [existingUsers]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Użytkownik z tym emailem już istnieje' });
      }


      // 🔑 **Szyfrowanie Hasła**

      /**
       * Zaszyfruj hasło użytkownika przed zapisaniem w bazie danych.
       */

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🆔 **Generowanie Unikalnego Identyfikatora**

      const identyfikator = uuidv4();


      // 🛠️ **Zapis Użytkownika do Bazy Danych**

      await pool.query(
        'INSERT INTO login (name, email, password, identyfikator) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, identyfikator]
      );


      // ✅ **Zwrócenie Odpowiedzi Sukcesu**

      return res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });
    } catch (error) {

      // ❌ **Obsługa Błędów Serwera**

      console.error('Błąd serwera podczas rejestracji:', error);
      return res.status(500).json({ message: 'Błąd serwera' });
    }
  } else {

    // 🚫 **Obsługa Nieprawidłowej Metody**

    /**
     * Jeśli metoda żądania nie jest `POST`, zwracamy błąd 405.
     */

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Metoda ${req.method} nie jest obsługiwana`);
  }
}
