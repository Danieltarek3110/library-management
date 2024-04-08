const db = require("../database/dbconn");
const User = require("../Model/user");
const Book = require("../Model/book");

const userModel = new User(db);
const bookModel = new Book(db);

const addNewBook = async (req, res) => {
  if(!req.user.is_admin){
    return res.status(400).json({ error: "Please sign in with an administrator" });
  }
  const { title, author, isbn, available_quantity, shelf_location } = req.body;
  try {
    const bookId = await bookModel.addBook(
      title,
      author,
      isbn,
      available_quantity,
      shelf_location
    );
    res.status(201).json({ message: "book added successfully", id: bookId });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book" });
  }
};

const updateBook = async (req, res) => {
  const { title, author, isbn, available_quantity, shelf_location } = req.body;
  const { id } = req.params;
  try {
    await bookModel.updateBook(
      id,
      title,
      author,
      isbn,
      available_quantity,
      shelf_location
    );
    res.json({ message: "book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const rows = await userModel.listUsers();
    if (!rows || rows.length() === 0) {
      return res.status(404).send({ Error: "List empty" });
    }
    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getBorrowedBooks = async (req, res) => {
  try {
    const rows = await bookModel.listBorrowedBooks();
    if (!rows || rows.length === 0) {
      return res.status(404).send({ Error: "List empty" });
    }
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getOverdueBooks = async (req, res) => {
  try {
    const rows = await bookModel.listOverdueBooks();
    if (!rows || rows.length === 0) {
      return res.status(404).send({ Error: "List empty" });
    }
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getUserByID = async (req, res) => {
  try {
    const user = await userModel.getUserByID(req.params.id);
    if (!user[0]) {
      return res.status(404).json({ error: "User id not found" });
    } else {
      res.status(200).send(user[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

const deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await bookModel.deleteBook(id);
    if (!result) {
      res.status(404).json({ error: "book not found" });
    } else {
      res.json({ message: "book deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).send(error);
  }
};

module.exports = {
  addNewBook,
  updateBook,
  getAllUsers,
  getBorrowedBooks,
  getOverdueBooks,
  getUserByID,
  deleteBook,
};
