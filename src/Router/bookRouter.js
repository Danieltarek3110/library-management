const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication');
const { getAllBooks, getBookByID, reduceStock, borrowBook, returnBook } = require('../Controller/bookController')

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
router.get('/api/v1/books/', auth, getAllBooks);

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
router.get('/api/v1/books/:id', auth, getBookByID);


// Testing reducing book stock
router.post('/api/v1/books/stock/:id', reduceStock);

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
router.post('/api/v1/books/borrow', auth, borrowBook);

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
router.post('/api/v1/books/return', auth, returnBook);



module.exports = router;