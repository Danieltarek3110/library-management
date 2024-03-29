const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication');
const db = require('../database/dbconn'); 
const User = require('../Model/user');
const Book = require('../Model/book')

const userModel = new User(db);
const bookModel = new Book(db);

// Add a book
router.post('/api/v1/admin/books', async (req, res) =>{
    const {title, author, isbn , available_quantity, shelf_location } = req.body;
    try{
        const bookId = await bookModel.addBook(title, author, isbn , available_quantity, shelf_location );
        res.status(201).json({ message: 'book added successfully', id: bookId });
    }catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Update a book
router.patch('/api/v1/admin/books/:id', async (req, res) => {
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
router.get('/api/v1/admin/users', async (req, res) => {
    try{
        const rows =  await userModel.listUsers();
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

// Get all borrowed books
router.get('/api/v1/admin/borrowedbooks', async (req, res) => {
    try{
        const rows =  await bookModel.listBorrowedBooks();
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

// Get all overdue books
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
router.get('/api/v1/admin/users/:id', async (req, res) => {
    try {
        const user =  await userModel.getUserByID(req.params.id);
        if(!user[0]){
            return res.status(404).send('User id not found');
        }
        res.status(200).send(user[0]);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});



module.exports = router;
