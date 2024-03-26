const mysql = require('mysql2');
require('dotenv').config({ path: './config/dev.env' });

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bosta'
  });

  module.exports = db;