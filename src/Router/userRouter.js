const express = require('express');
const router = express.Router();

const db = require('../database/dbconn'); 
const User = require('../Model/user'); 

const userModel = new User(db);

    // Get all users
    router.get('/api/v1/users', async (req, res) => {
        try {
            const rows =  await userModel.listUsers();
            res.status(200).send(rows);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
  });

  // Get user by ID
    router.get('/api/v1/:id', async (req, res) => {
        try {
            const user =  await userModel.getUserByID(req.params.id);
            res.status(200).send(user[0]);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    });


    // Add a borrower
    router.post('/api/v1/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userId = await userModel.addUser(email, password);
        res.status(201).json({ message: 'Borrower added successfully', id: userId });
    } catch (error) {
        console.error('Error adding borrower:', error);
        res.status(500).json({ error: 'Failed to add borrower' });
    }
    });

    // Update a borrower
    router.patch('/api/v1/:id', async (req, res) => {
    const { email , password} = req.body;
    const { id } = req.params;
    try {
        await userModel.updateUser(id, email, password );
        res.json({ message: 'Borrower updated successfully' });
    } catch (error) {
        console.error('Error updating borrower:', error);
        res.status(500).json({ error: 'Failed to update borrower' });
    }
    });

    // Delete a borrower
    router.delete('/api/v1/:id', async (req, res) => {
    const id  = req.params.id;
    try {
        const result = await userModel.deleteUser(id);

        console.log(result)

        if (!result ) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting User:', error);
        res.status(500).send(error);
    }
    });

module.exports = router;