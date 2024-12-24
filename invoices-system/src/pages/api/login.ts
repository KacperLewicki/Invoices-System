import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import pool from './lib/db';

// 📚 **Logowanie Użytkownika i Generowanie Tokena JWT**

// Ten endpoint obsługuje proces logowania użytkownika.
// Dane logowania są weryfikowane, a użytkownik otrzymuje token JWT,
// który jest przechowywany w ciasteczku HTTP-only dla zwiększenia bezpieczeństwa.


// 📌 **Konfiguracja JWT**

/**
 * @constant NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
 * Sekret używany do podpisywania tokena JWT.
 */

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR!
);

// 📌 **Handler API**

/**
 * @function handler
 * Obsługuje logowanie użytkownika i generuje token JWT.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Obsługa Metody POST**

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Metoda niedozwolona' });
  }

  // 📌 **Pobranie Danych Logowania**

  /**
   * Oczekiwane pola:
   * @property {string} email - Adres e-mail użytkownika.
   * @property {string} password - Hasło użytkownika.
   */
  const { email, password } = req.body;

  // 🛠️ **Weryfikacja Użytkownika w Bazie Danych**

  try {

    /**
     * Pobierz użytkownika z bazy danych na podstawie e-maila.
     */

    const [rows]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

    if (rows.length === 0) {

      return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
    }

    const user = rows[0];


    // 🔑 **Weryfikacja Hasła**

    /**
     * Porównaj hasło podane przez użytkownika z zaszyfrowanym hasłem w bazie.
     */

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
    }


    // 🔐 **Generowanie Tokena JWT**

    /**
     * Token zawiera unikalny identyfikator użytkownika (`identyfikator`).
     * Czas wygaśnięcia tokena: 1 godzina.
     */

    const token = await new SignJWT({ id: user.identyfikator })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);


    // 🍪 **Ustawienie Tokena w Ciasteczku**

    /**
     * Token JWT jest ustawiany w ciasteczku z właściwościami:
     * - HttpOnly: Zabezpiecza przed dostępem z poziomu JavaScript.
     * - Path: Dostępne w całej aplikacji.
     * - Max-Age: Wygasa po 1 godzinie.
     * - SameSite: Strict - tylko żądania z tej samej domeny.
     * - Secure: Wymaga HTTPS.
     */

    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure;`
    );


    // ✅ **Zwrócenie Odpowiedzi**

    /**
     * Zwraca podstawowe dane użytkownika w odpowiedzi JSON.
     */

    return res.status(200).json({

      message: 'Zalogowano pomyślnie',
      id: user.id,
      name: user.name,
      email: user.email,
      identyfikator: user.identyfikator,
    });

  } catch (error) {
   
    // ❌ **Obsługa Błędów**

    console.error('Błąd logowania użytkownika:', error);
    return res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
}
