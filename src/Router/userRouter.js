const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication')
const db = require('../database/dbconn'); 
const User = require('../Model/user');

const userModel = new User(db);

// Get all users
router.get('/api/v1/users/', async (req, res) => {
    try{
        const rows =  await userModel.listUsers();
        res.status(200).send(rows);
    }catch (error){
        console.log(error);
        res.status(500).send(error);
    }
});

// Get user by ID
router.get('/api/v1/users/:id', async (req, res) => {
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

//List current User's borrowed books
router.get('/api/v1/mybooks', auth , async (req, res) => {
    try {
        const userid =  req.user;
        const books = await userModel.getBookByUserID(userid);

        res.status(200).send(books);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


// Add a User
router.post('/api/v1/users/', async (req, res) => {
const { name, email, password } = req.body;
try {
    const userId = await userModel.addUser(name, email, password);
    res.status(201).json({ message: 'User added successfully', id: userId });
} catch(error){
    console.error('Error adding User:', error);
    res.status(500).json({ error: 'Failed to add user' });
}
});

// Update a user
router.patch('/api/v1/users/:id', async (req, res) => {
    const {name, email , password} = req.body;
    const { id } = req.params;
    try{
        await userModel.updateUser(id, name, email, password );
        res.json({ message: 'user updated successfully' });
    }catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

//LOGIN
router.post('/api/v1/users/login' , async (req, res) => {
    const {email , password} = req.body;
    try{
        const token = await userModel.loginUser(email, password );
        if(!token){
            return res.status(400).send('Incorrect username or password');
        }
        res.json({ message: 'Login successfully' , token: token });
    } catch(error){
        console.error('Error Authenticating: ', error);
        res.status(500).json({ error: ' Failed to login ' });
    }
});

// Delete a user
router.delete('/api/v1/users/:id', async (req, res) => {
    const id  = req.params.id;
    try{
        const result = await userModel.deleteUser(id);
        if(!result ){
            res.status(404).json({ error: 'User not found' });
        }else{
            res.json({ message: 'User deleted successfully' });
        }
    }catch(error){
        console.error('Error deleting User:', error);
        res.status(500).send(error);
    }
});

module.exports = router;