import { NextApiRequest, NextApiResponse } from 'next';

// 📚 **Wylogowanie Użytkownika (Usunięcie Tokena)**

// 📌 **Handler API**

/**
 * @function handler
 * Usuwa ciasteczko tokena JWT, wylogowując użytkownika.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Usunięcie Tokena z Ciasteczek**

  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure;`);


  // ✅ **Zwrócenie Odpowiedzi Sukcesu**
 
  return res.status(200).json({ message: 'Wylogowano pomyślnie' });
}
