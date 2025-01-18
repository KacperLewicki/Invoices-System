import { NextApiRequest, NextApiResponse } from 'next';
import { jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import pool from './lib/db';

// 📚 **User Password Change**

// This API endpoint handles changing a user's password.
// Authentication is done via a JWT token stored in cookies.
// The password is validated and hashed before saving to the database.

// 📌 **JWT Configuration**

/**
 * @constant NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
 * Secret key for JWT verification of the user token.
 */

const NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR
);

// 📌 **API Handler**

/**
 * @function handler
 * Changes the password of the logged-in user.
 *
 * @param {NextApiRequest} req - HTTP request object.
 * @param {NextApiResponse} res - HTTP response object.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Handle POST Method**

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 🔑 **JWT Token Verification**

  /**
   * The token is retrieved from cookies.
   * If the token does not exist, the user is unauthorized.
   */

  const token = req.cookies.token;

  if (!token) {

    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {

    // 📌 1. Verify JWT Token

    const decoded: any = await jwtVerify(token, NEXT_PUBLIC_SECRET_KEY_ADMINISTRATOR);
    const userId = decoded.payload.id;

    // 📌 2. Retrieve Data from Request

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {

      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    // 🛠️ **Fetch User from Database**

    /**
     * Fetch the user based on the ID obtained from the token.
     */

    const [rows]: any = await pool.query('SELECT * FROM login WHERE identyfikator = ?', [userId]);

    if (rows.length === 0) {

      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // 🔑 **Verify Current Password**

    /**
     * Compare the current password provided by the user with the hashed password in the database.
     */

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {

      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // 🔑 **Hash New Password**

    /**
     * The new password is hashed before saving to the database.
     */

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🛠️ **Update Password in Database**

    await pool.query('UPDATE login SET password = ? WHERE identyfikator = ?', [hashedPassword, userId]);


    // ✅ **Return Success Response**

    return res.status(200).json({ message: 'Password has been changed successfully' });

  } catch (error) {

    // ❌ **Error Handling**

    console.error('Password change error:', error);
    return res.status(500).json({ message: 'Server error occurred' });
  }
}
