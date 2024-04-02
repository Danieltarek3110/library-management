const express = require("express");
const userRouter = require("../src/Router/userRouter");
const bookRouter = require("../src/Router/bookRouter");
const adminRouter = require("../src/Router/adminRouter");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("../src/Swagger/swagger");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config({ path: "./config/dev.env" });

const app = express();
const PORT = process.env.PORT;

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: "",
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.use(userRouter);
app.use(bookRouter);
app.use(adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
