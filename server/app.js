const express = require('express');
const userRouter = require('../src/Router/userRouter')
const bookRouter = require('../src/Router/bookRouter')
const mysql = require('mysql2');
require('dotenv').config({ path: './config/dev.env' });

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: '',
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(userRouter);
app.use(bookRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
