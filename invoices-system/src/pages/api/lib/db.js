import mysql from 'mysql2';

const connection = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: '',
  database: 'invoice_manualforms',

});

connection.connect(err => {

  if (err) {
    
    return;
  }
});

export default connection;
