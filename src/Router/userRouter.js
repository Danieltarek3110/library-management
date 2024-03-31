const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authentication')
const db = require('../database/dbconn'); 
const User = require('../Model/user');
const userModel = new User(db);

//List current User's borrowed books
/**
 * @swagger
 * /api/v1/mybooks:
 *   get:
 *     summary: Get user's books
 *     description: Endpoint to retrieve books associated with the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's books.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal Server Error. Indicates a failure in retrieving user's books.
 */
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


// Create a User
/**
 * @swagger
 * /api/v1/users/:
 *   post:
 *     summary: Register a user
 *     description: Endpoint to add a new user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User information to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User added successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: User added successfully
 *               id: userId
 *       500:
 *         description: Internal Server Error. Indicates a failure in adding the user.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to add user
 */
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
/**
 * @swagger
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Endpoint to update a user by its ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to be updated.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User information to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: user updated successfully
 *       500:
 *         description: Internal Server Error. Indicates a failure in updating the user.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to update user
 */
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

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user authentication.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for authentication.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             example:
 *               message: Login successfully
 *               token: <token_value>
 *       400:
 *         description: Bad Request. Indicates incorrect username or password.
 *         content:
 *           application/json:
 *             example:
 *               message: Incorrect username or password
 *       500:
 *         description: Internal Server Error. Indicates a failure in login.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to login
 */
router.post('/api/v1/users/login' , async (req, res) => {
    const {email , password} = req.body;
    try{
        const token = await userModel.loginUser(email, password );
        if(!token){
            return res.status(400).send('Incorrect username or password');
        }
        console.log({ message: 'Login successfully' , token: token });
        res.json({ message: 'Login successfully' , token: token });
    } catch(error){
        console.error('Error Authenticating: ', error);
        res.status(500).json({ error: ' Failed to login ' });
    }
});

// Delete a user

/**
 * @swagger
 * /api/v1/users:
 *   delete:
 *     summary: Delete current user
 *     description: Endpoint to delete the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       404:
 *         description: Not Found. Indicates that the user to be deleted was not found.
 *         content:
 *           application/json:
 *             example:
 *               error: User not found
 *       500:
 *         description: Internal Server Error. Indicates a failure in deleting the user.
 *         content:
 *           application/json:
 *             example:
 *               error: Failed to delete user
 */
router.delete('/api/v1/users', auth ,async (req, res) => {
    const id  = req.user;
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