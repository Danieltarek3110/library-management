const jwt = require("jsonwebtoken");
const User = require("../src/Model/user");
require("dotenv").config({ path: "./config/dev.env" });
const db = require("../src/database/dbconn");

const auth = async function (req, res, next) {
  const userModel = new User(db);
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "Daniel");

    const user = await userModel.getUserByID(decoded._id);

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = decoded._id;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
