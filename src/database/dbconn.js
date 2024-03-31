const mysql = require('mysql2');
require('dotenv').config({ path: './config/dev.env' });

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db;
