import { NextApiRequest, NextApiResponse } from 'next';

// 📚 **User Logout (Token Removal)**

// 📌 **API Handler**

/**
 * @function handler
 * Removes the JWT token cookie, logging out the user.
 *
 * @param {NextApiRequest} req - HTTP request object.
 * @param {NextApiResponse} res - HTTP response object.
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  // 🔑 **Remove Token from Cookies**

  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict; Secure;`);

  // ✅ **Return Success Response**

  return res.status(200).json({ message: 'Logged out successfully' });
}
