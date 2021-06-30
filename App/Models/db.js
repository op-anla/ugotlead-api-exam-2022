require('dotenv').config();
const mysql = require("mysql");
// MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// open the MySQL connection
// connection.connect(function (err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }

//   console.log('Connected to database.');
// });


// Connection error, try again in 2 seconds
connection.connect(function (err) {
  if (err) {
    console.log('error when connecting to db:', err);
    setTimeout(handleError, 2000);
  }
  console.log('Connected to database.');
});
// Monitor error
connection.on('error', function (err) {
  console.log('db error', err);
  // If the connection is disconnected, automatically reconnect
  if (err.code === 'PROTOCOL_CONNECTION_LOST' && err.code === 'ECONNRESET') {
    console.log('connection lost')
  } else {
    throw err;
  }
});
// Monitor error
connection.on('error', function (err) {
  console.log('db error', err);
  // If the connection is disconnected, automatically reconnect
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleError();
  } else {
    throw err;
  }
});

module.exports = connection;
