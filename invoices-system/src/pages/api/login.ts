import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import bcrypt from 'bcrypt';
import pool from './lib/db';

// 📚 **User Login and JWT Token Generation**

// This endpoint handles the user login process.
// Login credentials are verified, and the user receives a JWT token,
// which is stored in an HTTP-only cookie for enhanced security.

// 📌 **JWT Configuration**

/**
 * @constant NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
 * Secret key used to sign the JWT token.
 */

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR!
);

// 📌 **API Handler**

/**
 * @function handler
 * Handles user login and generates a JWT token.
 *
 * @param {NextApiRequest} req - HTTP request object.
 * @param {NextApiResponse} res - HTTP response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Handle POST Method**

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 📌 **Retrieve Login Data**

  /**
   * Expected fields:
   * @property {string} email - User's email address.
   * @property {string} password - User's password.
   */
  const { email, password } = req.body;

  // 🛠️ **Verify User in Database**

  try {

    /**
     * Fetch the user from the database based on the email.
     */

    const [rows]: any = await pool.query('SELECT * FROM login WHERE email = ?', [email]);

    if (rows.length === 0) {

      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const user = rows[0];

    // 🔑 **Password Verification**

    /**
     * Compare the user-provided password with the encrypted password in the database.
     */

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // 🔐 **JWT Token Generation**

    /**
     * The token contains the user's unique identifier (`identyfikator`).
     * Token expiration time: 1 hour.
     */

    const token = await new SignJWT({ id: user.identyfikator })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);

    // 🍪 **Set Token in Cookie**

    /**
     * The JWT token is set in a cookie with the following properties:
     * - HttpOnly: Secures it from JavaScript access.
     * - Path: Available throughout the application.
     * - Max-Age: Expires in 1 hour.
     * - SameSite: Strict - only requests from the same domain.
     * - Secure: Requires HTTPS.
     */

    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure;`
    );

    // ✅ **Return Response**

    /**
     * Returns basic user information in the JSON response.
     */

    return res.status(200).json({

      message: 'Logged in successfully',
      id: user.id,
      name: user.name,
      email: user.email,
      identyfikator: user.identyfikator,
    });

  } catch (error) {

    // ❌ **Error Handling**

    console.error('User login error:', error);
    return res.status(500).json({ message: 'Server error occurred' });
  }
}
