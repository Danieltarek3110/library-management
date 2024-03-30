const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication');
const db = require('../database/dbconn'); 
const Book = require('../Model/book'); 

const bookModel = new Book(db);

// Get all books
/**
 * @swagger
 * /api/v1/books/:
 *   get:
 *     summary: Get all books
 *     description: Endpoint to retrieve all books.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving all books.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve books
 */

router.get('/api/v1/books/', auth ,async (req, res) => {
    try{
        const rows =  await bookModel.listBooks();
        res.status(200).send(rows);
    }catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// Get book by ID
/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Endpoint to retrieve a book by its ID.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to be retrieved.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Not Found. Indicates that the book with the specified ID was not found.
 *         content:
 *           application/json:
 *             example:
 *               error: Book id not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve book
 */
router.get('/api/v1/books/:id',auth ,async (req, res) => {
    try {
        const book =  await bookModel.getBookByID(req.params.id);
        if(book[0].length === 0){
            return res.status(404).send('book id not found');
        }
        res.status(200).send(book[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


// Testing reducing book stock
router.post('/api/v1/books/stock/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const book =  await bookModel.getBookByID(id);
        console.log("Book   " + book[0][0] )
        let quantity = book[0][0].available_quantity;
        console.log("Quantity   " + quantity)
        await bookModel.reduceStock(id)
        //await bookModel.updateBook(id, null, null, null , quantity-1 , null  );
        res.status(201).json({ message: 'reduced stock successfully', id: id });
    }catch(error){
        console.error('Error:   ', error);
        res.status(500).send( error );
    }
});






// borrow a book
/**
 * @swagger
 * /api/v1/books/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Endpoint to borrow a book.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Information about the book to be borrowed.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book borrowed successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: borrowed successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in borrowing the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to borrow book
 */
router.post('/api/v1/books/borrow', auth ,async (req, res) => {
    const bookid = req.body.book_id;
    let due_date = req.body.due_date;
    const parts = due_date.split("-");
    const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    due_date = new Date(isoDate);
    const userid = req.user;
    try{
        await bookModel.borrowBook(userid, bookid , due_date);
        res.json({ message: 'borrowed successfully' });
    }catch(error){
        console.log('Error borrowing book: ', error);
        res.status(500).send(error);
    }
});

// return a book
/**
 * @swagger
 * /api/v1/books/return:
 *   post:
 *     summary: Return a book
 *     description: Endpoint to return a borrowed book.
 *     tags:
 *       - Books
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Information about the book to be returned.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book returned successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: returned successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in returning the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to return book
 */
router.post('/api/v1/books/return', auth ,async (req, res) => {
    const bookid = req.body.book_id;
    const userid = req.user;
    try{
        await bookModel.returnBook(userid, bookid );
        res.json({ message: 'returned successfully' });
    }catch(error){
        console.log('Error returning book: ', error);
        res.status(500).send(error);
    }
});



module.exports = router;