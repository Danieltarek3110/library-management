const express = require('express');
const router = express.Router();

const db = require('../database/dbconn'); 
const Book = require('../Model/book'); 

const bookModel = new Book(db);

    // Get all books
    router.get('/api/v1/books/', async (req, res) => {
        try {
            const rows =  await bookModel.listBooks();
            res.status(200).send(rows);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
  });

  // Get book by ID
    router.get('/api/v1/books/:id', async (req, res) => {
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


    // Add a book
    router.post('/api/v1/books/', async (req, res) => {
    const {title, author, isbn , available_quantity, shelf_location } = req.body;
    try {
        const bookId = await bookModel.addBook(title, author, isbn , available_quantity, shelf_location );
        res.status(201).json({ message: 'book added successfully', id: bookId });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
    });

    // Update a book
    router.patch('/api/v1/books/:id', async (req, res) => {
        const {title, author, isbn , available_quantity, shelf_location } = req.body;
        const { id } = req.params;
        try {
            await bookModel.updateBook(id, title, author, isbn , available_quantity, shelf_location  );
            res.json({ message: 'book updated successfully' });
        } catch (error) {
            console.error('Error updating book:', error);
            res.status(500).json({ error: 'Failed to update book' });
        }
    });

    // Delete a book
    router.delete('/api/v1/books/:id', async (req, res) => {
        const id  = req.params.id;
        try {
            const result = await bookModel.deleteBook(id);
            if (!result ) {
                res.status(404).json({ error: 'book not found' });
            } else {
                res.json({ message: 'book deleted successfully' });
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).send(error);
        }
    });

module.exports = router;