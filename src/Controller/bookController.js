const Book = require("../Model/book");
const db = require("../database/dbconn");
const bookModel = new Book(db);

const getAllBooks = async (_req, res) => {
  try {
    const rows = await bookModel.listBooks();
    if (!rows || rows.length === 0) {
      return res.status(404).send({ Error: "List empty" });
    }
    res.status(200).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getBookByID = async (req, res) => {
  try {
    const book = await bookModel.getBookByID(req.params.id);
    if (!book || book[0].length === 0) {
      return res.status(404).send("book id not found");
    }
    res.status(200).send(book[0]);
  } catch (error) {
    res.status(500).send();
  }
};

const reduceStock = async (req, res) => {
  const id = req.params.id;
  try {
    const book = await bookModel.getBookByID(id);
    console.log("Book   " + book[0][0]);
    let quantity = book[0][0].available_quantity;
    console.log("Quantity   " + quantity);
    await bookModel.reduceStock(id);
    //await bookModel.updateBook(id, null, null, null , quantity-1 , null  );
    res.status(201).json({ message: "reduced stock successfully", id: id });
  } catch (error) {
    if (error.message == "No more copies of this book available.") {
      return res.status(400).send({ Error: error.message });
    }
    return res.status(500).send({ Error: "Internal Server Error" });
  }
};

const borrowBook = async (req, res) => {
  const bookid = req.body.book_id;
  let due_date = req.body.due_date;
  const parts = due_date.split("-");
  const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  due_date = new Date(isoDate);
  const userid = req.user;
  try {
    await bookModel.borrowBook(userid, bookid, due_date);
    res.json({ message: "borrowed successfully" });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
};

const returnBook = async (req, res) => {
  const bookid = req.body.book_id;
  const userid = req.user;
  try {
    await bookModel.returnBook(userid, bookid);
    res.json({ message: "returned successfully" });
  } catch (error) {
    res.status(400).send({ Error: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookByID,
  reduceStock,
  borrowBook,
  returnBook,
};
