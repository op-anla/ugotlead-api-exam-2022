require("dotenv").config();
const mysql = require("mysql");
/* 
Rather than creating and managing connections one - by - one, 
this module also provides built - in connection pooling using mysql.createPool(config).
*/
var pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 100000,
  connectionLimit: 6,
});

// Monitor error
pool.on("error", function (err) {
  console.log("db error", err);
  // If the connection is disconnected, automatically reconnect
  if (err.code === "PROTOCOL_CONNECTION_LOST" && err.code === "ECONNRESET") {
    console.log("connection lost");
  } else {
    throw err;
  }
});
/* 
The pool will emit an acquire event when a connection is acquired from the pool.
This is called after all acquiring activity has been performed on the connection, 
right before the connection is handed to the callback of the acquiring code.
*/
pool.on("acquire", function (connection) {
  console.log("Connection %d acquired", connection.threadId);
});
/* 
The pool will emit a connection event when a new connection is made within the pool.
If you need to set session variables on the connection before it gets used, you can listen to the connection event.
*/
pool.on("connection", function (connection) {
  console.log("Connection has been made");
});
/* 
The pool will emit an enqueue event when a callback has been queued to wait
for an available connection.
*/
pool.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});
/* 
The pool will emit a release event when a connection is released back to the pool.
This is called after all release activity has been performed on the connection, 
so the connection will be listed as free at the time of the event.
*/
pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});
module.exports = pool;
