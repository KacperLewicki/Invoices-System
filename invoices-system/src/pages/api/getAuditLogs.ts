import { NextApiRequest, NextApiResponse } from 'next';
import { RowDataPacket } from 'mysql2';
import pool from './lib/db';

interface AuditLog extends RowDataPacket {

  id: number;
  table_name: string;
  row_id: number;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: any;
  new_data: any;
  changed_at: string;
  changed_by?: string;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {

    if (req.method !== 'GET') {

      return res.status(405).json({ error: 'Method not allowed' });

    }

    const { tableName, rowId } = req.query;

    let query = 'SELECT * FROM audit_logs';
    const conditions: string[] = [];
    const values: any[] = [];

    if (typeof tableName === 'string' && tableName.length > 0) {

      conditions.push('table_name = ?');
      values.push(tableName);

    }

    if (typeof rowId === 'string' && rowId.length > 0) {

      conditions.push('row_id = ?');
      values.push(rowId);

    }

    if (conditions.length > 0) {

      query += ' WHERE ' + conditions.join(' AND ');

    }

    query += ' ORDER BY changed_at DESC';

    const [rows] = await pool.query<AuditLog[]>(query, values);

    if (!rows || rows.length === 0) {

      return res.status(200).json([]);
    }

    return res.status(200).json(rows);

  } catch (error: any) {

    console.error('Błąd w getAuditLogs:', error);
    return res.status(500).json({ error: String(error) });
  }
}
