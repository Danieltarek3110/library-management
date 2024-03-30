const db = require('mysql2');
const bcrypt = require('bcrypt')
require('dotenv').config({ path: './config/dev.env' });
const jwt = require('jsonwebtoken')

class User {
  constructor(db){
    this.db = db;
  }

  // Method to list all users
  async listUsers(){
    try{
      const sql = 'SELECT * FROM users';
      const [rows] = await this.db.promise().query(sql);
      return rows;
    }catch(error){
      console.error('Error listing users:', error);
      throw error;
    }
  }

  // Method to get user by ID
  async getUserByID(id) {
    try{
      const sql = 'SELECT * FROM users WHERE id =?';
      const user = await this.db.promise().query(sql, [id]);
      if (!user[0] || user.length === 0) {
        throw new Error('User not found');
      }
      return user[0];
    }catch(error){
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Method to get user's current books
  async getBookByUserID(id){
    try{
      const sql = 'SELECT * FROM user_books WHERE user_id =?';
      const [books] = await this.db.promise().query(sql, id);
      return books;
    }catch(error){
      console.error( error);
      throw error;
    }
  }

  // Method to get user by email
  async getUserByEmail(email){
    try {
      const sql = 'SELECT * FROM users WHERE email =?';
      const user = await this.db.promise().query(sql, [email] );
      return user;
    } catch(error){
      console.error('Error fetching user:', error);
      throw error;
    }
  }



  // Method to add a new user
  async addUser(name , email, password){
    try {
      password = await bcrypt.hash(password , 8)
      const sql = 'INSERT INTO users (name , email, password) VALUES (?,? ,?)';
      const [result] = await this.db.promise().query(sql, [name, email, password]);
      return result.insertId;
    }catch(error){
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async loginUser(email, password){
    try{
      const [userRow] = await this.getUserByEmail(email);

      if (!userRow) {
        return null;
      }

      const userObject = userRow[0];
      const passwordMatch = await bcrypt.compare(password, userObject.password);
      console.log("Password match:", passwordMatch);

      if (!passwordMatch) {
        console.error('Incorrect username or password');
        return null;
      }
      const token = jwt.sign({ _id: userObject.id } , 'Daniel');

      return token;
    }catch(error){
      console.error('Could not login:', error);
      throw error;
    }
}


  // Method to update a user
  async updateUser(id, name , email, password) {
    password = await bcrypt.hash(password , 8);
    try {
      const sql = 'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), password = COALESCE(?, password) WHERE id = ?';
      await this.db.promise().query(sql, [name , email, password,  id]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Method to delete a user
  async deleteUser(id) {
    try {
      const sql = 'DELETE FROM users WHERE id = ?';
      const user = await this.getUserByID(id);
      console.log(user[0])
      if(user[0].length ===0){
          return null;
      }else{
        await this.db.promise().query(sql, [id]);
        return id
      }
    }catch (error){
      console.error('Error deleting user:', error);
      throw error;
    }
  }

}

module.exports = User;