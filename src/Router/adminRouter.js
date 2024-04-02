const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication');
const db = require('../database/dbconn'); 
const User = require('../Model/user');
const Book = require('../Model/book')

const userModel = new User(db);
const bookModel = new Book(db);

// Add a book
/**
 * @swagger
 * /api/v1/admin/books:
 *   post:
 *     summary: Add a book
 *     description: Endpoint to add a new book.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Information about the book to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               available_quantity:
 *                 type: integer
 *               shelf_location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: book added successfully
 *               id: <bookId>
 *       500:
 *         description: Internal Server Error. Indicates a failure in adding the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to add book
 */
router.post('/api/v1/admin/books', auth ,async (req, res) =>{
    const {title, author, isbn , available_quantity, shelf_location } = req.body;
    try{
        const bookId = await bookModel.addBook(title, author, isbn , available_quantity, shelf_location );
        res.status(201).json({ message: 'book added successfully', id: bookId });
    }catch (error) {
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Update a book
/**
 * @swagger
 * /api/v1/admin/books/{id}:
 *   patch:
 *     summary: Update a book by ID
 *     description: Endpoint to update a book by its ID.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to be updated.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Information about the book fields to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               available_quantity:
 *                 type: integer
 *               shelf_location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: book updated successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to update book
 */
router.patch('/api/v1/admin/books/:id', auth ,async (req, res) => {
    const {title, author, isbn , available_quantity, shelf_location } = req.body;
    const { id } = req.params;
    try{
        await bookModel.updateBook(id, title, author, isbn , available_quantity, shelf_location  );
        res.json({ message: 'book updated successfully' });
    }catch (error){
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Get all users
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving all users.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve users
 */
router.get('/api/v1/admin/users', auth ,async (req, res) => {
    try{
        const rows =  await userModel.listUsers();
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

// Get all borrowed books
/**
 * @swagger
 * /api/v1/admin/borrowedbooks:
 *   get:
 *     summary: Get all borrowed books
 *     description: Endpoint to retrieve all borrowed books.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all borrowed books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving all borrowed books.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve borrowed books
 */
router.get('/api/v1/admin/borrowedbooks', auth ,async (req, res) => {
    try{
        const rows =  await bookModel.listBorrowedBooks();
        console.log(rows);
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

// Get all overdue books
/**
 * @swagger
 * /api/v1/admin/overdue:
 *   get:
 *     summary: Get overdue books
 *     description: Endpoint to retrieve overdue books.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved overdue books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving overdue books.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve overdue books
 */
router.get('/api/v1/admin/overdue', auth ,async (req, res) => {
    try{
        const rows =  await bookModel.listOverdueBooks();
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});


// Get user by ID
/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Endpoint to retrieve a user by ID.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User ID not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User id not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving the user.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to retrieve user
 */
router.get('/api/v1/admin/users/:id', auth ,async (req, res) => {
    try {
        const user =  await userModel.getUserByID(req.params.id);
        if(!user[0]){
            return res.status(404).json({ "error": "User id not found" });
        }else{
            res.status(200).send(user[0]);
        }
    } catch (error) {
        res.status(500).json({ "error": "Failed to retrieve user" });;
    }
});

// Delete a book
/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Endpoint to delete a book by its ID.
 *     tags:
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: Book deleted successfully
 *       404:
 *         description: Not Found. Indicates that the book to be deleted was not found.
 *         content:
 *           application/json:
 *             example:
 *               error: Book not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in deleting the book.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to delete book
 */
router.delete('/api/v1/books/:id', auth ,async (req, res) => {
    const id  = req.params.id;
    try{
        const result = await bookModel.deleteBook(id);
        if(!result ){
            res.status(404).json({ error: 'book not found' });
        }else{
            res.json({ message: 'book deleted successfully' });
        }
    }catch(error){
        console.error('Error deleting book:', error);
        res.status(500).send(error);
    }
});



module.exports = router;
