import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: 'sql7.freesqldatabase.com',
  user: 'sql7758332',
  password: 'AJfJG9b5Kn',
  database: 'sql7758332',
});

export default connection;
