import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// 📚 **User Registration**

// This API endpoint handles the user registration process.
// Input data is validated, the password is hashed before being saved to the database,
// and the user receives a unique `identifier`.

// 📌 **API Handler**

/**
 * @function handler
 * Registers a new user in the system.
 *
 * @param {NextApiRequest} req - HTTP request object.
 * @param {NextApiResponse} res - HTTP response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Handle POST Method**

  if (req.method === 'POST') {

    // 📌 1. Retrieve data from the request

    const { name, email, password } = req.body;

    try {

      // 🛡️ **Check for Existing User**

      /**
       * Check if a user with the provided email already exists.
       */

      const [existingUsers]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      // 🔑 **Password Hashing**

      /**
       * Hash the user's password before saving it to the database.
       */

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🆔 **Generate Unique Identifier**

      const identyfikator = uuidv4();

      // 🛠️ **Save User to Database**

      await pool.query(
        'INSERT INTO login (name, email, password, identyfikator) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, identyfikator]
      );

      // ✅ **Return Success Response**

      return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {

      // ❌ **Server Error Handling**

      console.error('Server error during registration:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  } else {

    // 🚫 **Handle Invalid Method**

    /**
     * If the request method is not `POST`, return a 405 error.
     */

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} is not supported`);
  }
}
