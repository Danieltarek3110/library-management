const db = require('mysql2');

class User {
  constructor(db) {
    this.db = db;
  }

    // Method to list all users
    async listUsers() {
        try {
            const sql = 'SELECT * FROM users';
            const [rows] = await this.db.promise().query(sql);
            return rows;
        } catch (error) {
            console.error('Error listing users:', error);
            throw error;
        }
    }

        // Method to get user by ID
        async getUserByID(id) {
            try {
                const sql = 'SELECT * FROM users WHERE id =?';
                const user = await this.db.promise().query(sql, id);
                return user;
            } catch (error) {
                console.error('Error fetching user:', error);
                throw error;
            }
        }


  // Method to add a new user
  async addUser(email, password) {
    try {
      const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      const [result] = await this.db.promise().query(sql, [email, password]);
      return result.insertId;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // Method to update a user
  async updateUser(id, email, password) {
    try {
      const sql = 'UPDATE users SET email = ?, password = ? WHERE id = ?';
      await this.db.promise().query(sql, [email, password,  id]);
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
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
  }


}

module.exports = User;