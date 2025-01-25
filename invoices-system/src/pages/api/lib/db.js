import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7759493',
  password: 'qDeSZsz8R3',
  database: 'sql7759493',
});

export default connection;
