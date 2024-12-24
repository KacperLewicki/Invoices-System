import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import pool from './lib/db';

// 📚 **Zmiana Hasła Użytkownika**

// Ten endpoint API obsługuje zmianę hasła użytkownika.
// Uwierzytelnienie odbywa się za pomocą tokena JWT przechowywanego w ciasteczkach.
// Hasło jest walidowane i szyfrowane przed zapisaniem w bazie danych.

// 📌 **Konfiguracja JWT**

/**
 * @constant NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
 * Sekret klucza JWT do weryfikacji tokena użytkownika.
 */

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
);

// 📌 **Handler API**

/**
 * @function handler
 * Zmienia hasło zalogowanego użytkownika.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Obsługa Metody POST**
 
  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  // 🔑 **Weryfikacja Tokena JWT**

  /**
   * Token jest pobierany z ciasteczek.
   * Jeśli token nie istnieje, użytkownik jest nieautoryzowany.
   */

  const token = req.cookies.token;

  if (!token) {

    return res.status(401).json({ message: 'Nieautoryzowany' });
  }

  try {

    // 📌 1. Weryfikacja Tokena JWT

    const decoded: any = await jwtVerify(token, NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
    const userId = decoded.payload.id;

    // 📌 2. Pobranie Danych z Żądania

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {

      return res.status(400).json({ message: 'Obecne i nowe hasło są wymagane' });
    }

    // 🛠️ **Pobranie Użytkownika z Bazy Danych**

    /**
     * Pobierz użytkownika na podstawie ID uzyskanego z tokena.
     */

    const [rows]: any = await pool.query('SELECT * FROM login WHERE id = ?', [userId]);

    if (rows.length === 0) {

      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const user = rows[0];

    // 🔑 **Weryfikacja Aktualnego Hasła**

    /**
     * Porównanie obecnego hasła podanego przez użytkownika z zaszyfrowanym hasłem w bazie.
     */

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {

      return res.status(401).json({ message: 'Obecne hasło jest niepoprawne' });
    }

    // 🔑 **Szyfrowanie Nowego Hasła**

    /**
     * Nowe hasło jest szyfrowane przed zapisaniem w bazie danych.
     */

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🛠️ **Aktualizacja Hasła w Bazie Danych**

    await pool.query('UPDATE login SET password = ? WHERE id = ?', [hashedPassword, userId]);


    // ✅ **Zwrócenie Odpowiedzi Sukcesu**

    return res.status(200).json({ message: 'Hasło zostało zmienione pomyślnie' });

  } catch (error) {

    // ❌ **Obsługa Błędów**

    console.error('Błąd zmiany hasła:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
