import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', `token=; HttpOnly; Path=/; Max-Age=0`);
  return res.status(200).json({ message: 'Wylogowano pomyślnie' });

}
