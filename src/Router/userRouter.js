const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authentication");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Maximum 3 requests per IP
  message: 'Too many requests from this IP, please try again later'
});


const {
  getBookByUserID,
  registerAccount,
  updateUserByID,
  loginUser,
  deleteCurrentUser,
} = require("../Controller/userController");

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
router.get("/api/v1/mybooks", auth, getBookByUserID);

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
router.post("/api/v1/users/", limiter , registerAccount);

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
router.patch("/api/v1/users/:id", updateUserByID);

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
router.post("/api/v1/users/login", limiter , loginUser);

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
router.delete("/api/v1/users", auth, deleteCurrentUser);

module.exports = router;
